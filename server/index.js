const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/objectplacer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  stripeCustomerId: String,
  apiUsage: {
    monthly: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  roomImage: String,
  objects: [{
    id: String,
    name: String,
    image: String,
    detectedClass: String,
    confidence: Number,
    positions: [{
      x: Number,
      y: Number,
      z: Number,
      rotation: { x: Number, y: Number, z: Number },
      scale: { x: Number, y: Number, z: Number }
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Load COCO-SSD model
let model;
const loadModel = async () => {
  try {
    console.log('Loading COCO-SSD model...');
    model = await cocoSsd.load();
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Check API usage limits
const checkUsageLimit = (req, res, next) => {
  const limits = {
    free: 10,
    pro: 100,
    enterprise: 1000
  };

  const userLimit = limits[req.user.subscription];
  
  // Reset monthly usage if needed
  const now = new Date();
  const lastReset = new Date(req.user.apiUsage.lastReset);
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    req.user.apiUsage.monthly = 0;
    req.user.apiUsage.lastReset = now;
  }

  if (req.user.apiUsage.monthly >= userLimit) {
    return res.status(429).json({ error: 'Monthly API limit exceeded. Please upgrade your plan.' });
  }

  next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', model: model ? 'loaded' : 'loading' });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    res.status(201).json({ token, user: { id: user._id, email: user.email, subscription: user.subscription } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    res.json({ token, user: { id: user._id, email: user.email, subscription: user.subscription } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Object detection endpoint
app.post('/api/detect-object', authenticateToken, checkUsageLimit, upload.single('image'), async (req, res) => {
  try {
    if (!model) {
      return res.status(503).json({ error: 'Model not loaded yet' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Process image with Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(640, 640, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Convert to tensor
    const imageTensor = tf.node.decodeImage(processedImage, 3);
    
    // Run object detection
    const predictions = await model.detect(imageTensor);
    
    // Clean up tensor
    imageTensor.dispose();

    // Update user API usage
    req.user.apiUsage.monthly += 1;
    await req.user.save();

    // Filter predictions with confidence > 0.5
    const filteredPredictions = predictions.filter(pred => pred.score > 0.5);

    res.json({
      predictions: filteredPredictions,
      imageData: `data:image/jpeg;base64,${processedImage.toString('base64')}`
    });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: 'Object detection failed' });
  }
});

// Create project
app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { name, roomImage } = req.body;
    
    const project = new Project({
      userId: req.user._id,
      name,
      roomImage,
      objects: []
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get user projects
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get specific project
app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Stripe payment endpoints
app.post('/api/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body;
    
    const prices = {
      pro: 999, // $9.99
      enterprise: 2999 // $29.99
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: prices[plan],
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        plan: plan
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Upgrade subscription
app.post('/api/upgrade-subscription', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    req.user.subscription = plan;
    await req.user.save();

    res.json({ message: 'Subscription upgraded successfully', subscription: plan });
  } catch (error) {
    res.status(500).json({ error: 'Subscription upgrade failed' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      email: req.user.email,
      subscription: req.user.subscription,
      apiUsage: req.user.apiUsage
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  await loadModel();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();