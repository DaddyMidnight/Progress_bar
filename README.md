# ObjectPlacer - Virtual Object Placement SaaS

A micro SaaS application that uses AI-powered computer vision to detect objects in photos and allows users to virtually place them in different locations within a room using augmented reality technology.

![ObjectPlacer Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=ObjectPlacer+Demo)

## ✨ Features

- **AI Object Detection**: Advanced computer vision using TensorFlow.js and COCO-SSD model
- **AR Visualization**: 3D object placement using Three.js and React Three Fiber
- **Real-time Camera Capture**: Live camera feed with instant object detection
- **Project Management**: Save and manage multiple AR projects
- **SaaS Business Model**: Subscription tiers with usage limits
- **User Authentication**: Secure JWT-based authentication
- **Payment Processing**: Stripe integration for subscriptions
- **Responsive Design**: Beautiful UI that works on all devices
- **API Rate Limiting**: Usage tracking and limits per subscription tier

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Three.js & React Three Fiber** - 3D graphics and AR visualization
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Webcam** - Camera integration

### Backend
- **Node.js & Express** - Server and API
- **TensorFlow.js** - AI/ML object detection
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Sharp** - Image processing
- **Multer** - File upload handling

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB (local or cloud)
- Stripe account (for payments)
- Modern web browser with camera support

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/object-placer-saas.git
   cd object-placer-saas
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Update `server/.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/objectplacer
   JWT_SECRET=your_super_secret_jwt_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas cloud service.

5. **Run the application**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend (port 3000).

## 🎯 Usage

### For Users

1. **Sign Up**: Create a free account to get started
2. **Capture Objects**: Use your camera or upload images to detect objects
3. **Place in AR**: Virtually position detected objects in a 3D room
4. **Save Projects**: Keep your AR arrangements for later viewing
5. **Upgrade**: Get more API calls and features with Pro/Enterprise plans

### API Endpoints

```
POST /api/register          - User registration
POST /api/login            - User login
GET  /api/profile          - Get user profile
POST /api/detect-object    - Object detection from image
GET  /api/projects         - Get user projects
POST /api/projects         - Create new project
PUT  /api/projects/:id     - Update project
DELETE /api/projects/:id   - Delete project
POST /api/create-payment-intent - Create Stripe payment
```

## 💰 Subscription Tiers

| Feature | Free | Pro ($9.99/mo) | Enterprise ($29.99/mo) |
|---------|------|----------------|------------------------|
| Object Detections | 10/month | 100/month | 1000/month |
| Projects | 1 | Unlimited | Unlimited |
| AR Features | Basic | Advanced | Premium |
| Support | Community | Priority | 24/7 Dedicated |
| Processing Speed | Standard | Fast | Ultra-fast |

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│    MongoDB      │
│                 │    │                 │    │                 │
│ • Camera        │    │ • Authentication│    │ • Users         │
│ • AR Viewer     │    │ • Object Detection   │ • Projects      │
│ • Dashboard     │    │ • File Upload   │    │ • Subscriptions │
│ • Payments      │    │ • Rate Limiting │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         │              │  External APIs  │
         │              │                 │
         └──────────────│ • TensorFlow.js │
                        │ • Stripe        │
                        │ • COCO-SSD      │
                        └─────────────────┘
```

## 🔧 Development

### Project Structure
```
object-placer-saas/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── App.js
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Main server file
│   ├── .env.example      # Environment template
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build` - Build frontend for production
- `npm start` - Start production server

### Adding New Features

1. **Backend**: Add new routes in `server/index.js`
2. **Frontend**: Create components in `client/src/components/`
3. **Pages**: Add new pages in `client/src/pages/`
4. **Styling**: Use styled-components for consistent styling

## 🚀 Deployment

### Heroku Deployment

1. **Prepare for deployment**
   ```bash
   # Add Heroku remote
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set STRIPE_SECRET_KEY=your_stripe_secret
   ```

2. **Deploy**
   ```bash
   git push heroku main
   ```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- TensorFlow.js team for the COCO-SSD model
- Three.js community for 3D graphics capabilities
- React team for the amazing framework
- All open source contributors

## 📞 Support

- 📧 Email: support@objectplacer.com
- 💬 Discord: [Join our community](https://discord.gg/objectplacer)
- 📖 Documentation: [docs.objectplacer.com](https://docs.objectplacer.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/object-placer-saas/issues)

---

**Made with ❤️ by the ObjectPlacer Team**