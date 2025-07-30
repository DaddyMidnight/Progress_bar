# Virtual Object Placer - Micro SaaS App

A modern web application that allows users to take photos of objects and virtually place them in different locations within a room. Perfect for interior design, furniture shopping, and space visualization.

## 🚀 Features

### Core Functionality
- **Photo Capture & Upload**: Take photos using webcam or upload existing images
- **Object Detection**: AI-powered object segmentation and detection
- **Virtual Placement**: Drag-and-drop objects anywhere in room photos
- **Real-time Editing**: Interactive canvas with zoom, rotate, and resize capabilities
- **Multiple Objects**: Add, duplicate, and manage multiple objects in a scene

### SaaS Features
- **User Authentication**: Secure login and registration system
- **Subscription Management**: Multiple pricing tiers (Free, Pro, Business)
- **Usage Tracking**: Monitor object placement usage
- **Export Options**: High-resolution image exports
- **Team Collaboration**: Multi-user support for business plans

### Technical Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Real-time Processing**: Instant object detection and placement
- **Cross-platform**: Works on desktop, tablet, and mobile devices
- **Cloud Storage**: Secure image storage and management
- **API Access**: RESTful API for integrations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Image Processing**: Fabric.js, React Webcam
- **File Upload**: React Dropzone
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **Payment Processing**: Stripe
- **Cloud Storage**: Cloudinary
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Cloudinary account
- Stripe account (for payments)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/virtual-object-placer.git
   cd virtual-object-placer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/virtual_placer"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # NextAuth Providers (Google, GitHub, etc.)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For End Users

1. **Upload Images**
   - Take a photo of an object using your webcam
   - Or upload an existing image from your device
   - Upload a room photo where you want to place the object

2. **Object Detection**
   - The AI automatically detects and segments the object
   - Review the detection results

3. **Virtual Placement**
   - Drag and drop the object anywhere in the room
   - Resize, rotate, and position as needed
   - Add multiple objects to create complete scenes

4. **Export & Share**
   - Save your creation in high resolution
   - Share with friends or save for later

### For Developers

The application is built with a modular architecture:

- `src/app/` - Next.js app router pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and configurations
- `src/types/` - TypeScript type definitions
- `prisma/` - Database schema and migrations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Images
- `POST /api/images/upload` - Upload image
- `GET /api/images/:id` - Get image by ID
- `DELETE /api/images/:id` - Delete image

### Projects
- `POST /api/projects` - Create new project
- `GET /api/projects` - Get user projects
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Subscriptions
- `POST /api/subscriptions/create` - Create subscription
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure environment variables**
   - Add all environment variables in Vercel dashboard

3. **Deploy**
   - Vercel will automatically deploy on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  room_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Objects table
CREATE TABLE objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  object_image_url VARCHAR(255) NOT NULL,
  position_x INTEGER,
  position_y INTEGER,
  scale_x DECIMAL(5,2) DEFAULT 1.0,
  scale_y DECIMAL(5,2) DEFAULT 1.0,
  rotation DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.virtualplacer.com](https://docs.virtualplacer.com)
- **Email**: support@virtualplacer.com
- **Discord**: [Join our community](https://discord.gg/virtualplacer)
- **Issues**: [GitHub Issues](https://github.com/yourusername/virtual-object-placer/issues)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic object placement
- ✅ User authentication
- ✅ Subscription management
- ✅ Image upload and processing

### Phase 2 (Q2 2024)
- 🔄 Advanced AI object detection
- 🔄 3D object placement
- 🔄 AR integration
- 🔄 Mobile app

### Phase 3 (Q3 2024)
- 📋 Real-time collaboration
- 📋 Advanced editing tools
- 📋 Integration marketplace
- 📋 White-label solutions

### Phase 4 (Q4 2024)
- 📋 AI-powered design suggestions
- 📋 Virtual reality support
- 📋 Enterprise features
- 📋 Global expansion

## 🙏 Acknowledgments

- [Fabric.js](http://fabricjs.com/) for canvas manipulation
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Stripe](https://stripe.com/) for payment processing
- [Cloudinary](https://cloudinary.com/) for image management

---

**Made with ❤️ by the VirtualPlacer team**