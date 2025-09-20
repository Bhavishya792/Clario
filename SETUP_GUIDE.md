# 🚀 Clario Legal Platform - Complete Setup Guide

This guide will help you set up the complete Clario legal platform with all features working, including the backend API, database, and AI integration.

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **OpenAI API Key** (for AI features)

## 🏗️ Project Structure

```
clario-legal-organizer/
├── src/                    # Frontend React application
├── backend/                # Backend API server
├── package.json           # Frontend dependencies
└── SETUP_GUIDE.md         # This file
```

## 🎯 Quick Start (5 Minutes)

### 1. Install Frontend Dependencies

```bash
# In the root directory
npm install
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `backend/.env` file:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database (use MongoDB Atlas or local MongoDB)
MONGODB_URI=mongodb://localhost:27017/clario

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your-openai-api-key-here

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:8080
```

### 4. Set Up Database

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### 5. Seed the Database

```bash
# In the backend directory
npm run seed
# or
node scripts/seedGlossary.js
```

### 6. Start the Backend Server

```bash
# In the backend directory
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 7. Start the Frontend

```bash
# In the root directory (new terminal)
npm run dev
```

The frontend will be available at `http://localhost:8080`

## 🎉 You're Done!

Visit `http://localhost:8080` to see your Clario legal platform in action!

## 🔧 Detailed Setup Instructions

### Backend API Setup

The backend provides a complete REST API with the following features:

#### Authentication System
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- User profile management

#### Document Management
- File upload (PDF, DOC, DOCX, TXT)
- Document storage and retrieval
- Document versioning
- Metadata tracking

#### AI-Powered Features
- **Document Analysis**: Clause-by-clause analysis
- **Clause Checking**: Standard vs non-standard clause detection
- **Document Simplification**: AI-powered legal language simplification
- **AI Chat**: Interactive legal assistant

#### Legal Glossary
- Comprehensive database of legal terms
- Search and filtering capabilities
- Category-based organization
- Related terms and examples

### Frontend Features

#### Pages and Functionality
1. **Landing Page** (`/`) - Marketing page with feature overview
2. **Dashboard** (`/dashboard`) - Main dashboard with metrics
3. **Deadlines** (`/deadlines`) - Deadline tracking and management
4. **Documents** (`/documents`) - Document library and management
5. **AI Chat** (`/ai-chat`) - Interactive AI legal assistant
6. **Clause Checker** (`/clause-checker`) - AI-powered clause analysis
7. **Side-by-Side** (`/side-by-side`) - Document comparison tool
8. **Glossary** (`/glossary`) - Legal terms dictionary

#### Authentication
- User registration and login
- Protected routes
- User profile management
- Subscription-based feature access

## 🧪 Testing the Features

### 1. Test AI Chat
- Go to `/ai-chat`
- Ask questions like "What is indemnification?"
- Upload a document for clause analysis

### 2. Test Clause Checker
- Go to `/clause-checker`
- Paste a legal document
- Click "Analyze Clauses" to see AI analysis

### 3. Test Document Simplification
- Go to `/side-by-side`
- Paste a complex legal document
- Click "Generate Simplified Version"

### 4. Test Glossary
- Go to `/glossary`
- Search for terms like "force majeure"
- Click on terms to see detailed information

## 🔑 API Keys Setup

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Add it to your `backend/.env` file

**Note**: OpenAI API usage is paid. You'll need to add billing information to your OpenAI account.

## 🗄️ Database Schema

### Users Collection
```javascript
{
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  company: String,
  userType: String, // 'individual', 'startup', 'enterprise'
  subscription: String, // 'free', 'pro', 'enterprise'
  preferences: Object,
  isActive: Boolean,
  lastLogin: Date
}
```

### Documents Collection
```javascript
{
  userId: ObjectId,
  title: String,
  type: String,
  content: {
    original: String,
    simplified: String,
    analysis: Object
  },
  filePath: String,
  status: String,
  tags: [String],
  metadata: Object
}
```

### Legal Terms Collection
```javascript
{
  term: String,
  displayTerm: String,
  definition: String,
  category: String,
  complexity: String,
  examples: [String],
  relatedTerms: [ObjectId],
  synonyms: [String]
}
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure JWT secrets
4. Configure proper CORS settings
5. Set up file storage (AWS S3, etc.)
6. Use a reverse proxy (nginx)
7. Enable HTTPS

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to a static hosting service (Netlify, Vercel, etc.)
3. Update API URLs for production
4. Configure environment variables

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check firewall settings

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check API key permissions
   - Ensure billing is set up

3. **File Upload Issues**
   - Check file size limits
   - Verify file types are supported
   - Ensure upload directory exists

4. **Authentication Issues**
   - Check JWT secret is set
   - Verify token expiration settings
   - Check CORS configuration

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check the backend README for detailed API documentation

## 📚 Additional Resources

- [Backend API Documentation](backend/README.md)
- [React Documentation](https://reactjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🎯 Next Steps

Once everything is running:

1. **Customize the branding** - Update colors, logos, and text
2. **Add more legal terms** - Expand the glossary database
3. **Implement user management** - Add admin features
4. **Add more AI features** - Implement additional legal analysis tools
5. **Set up monitoring** - Add logging and analytics
6. **Deploy to production** - Set up hosting and domain

## 🏆 Congratulations!

You now have a fully functional legal platform with:
- ✅ AI-powered document analysis
- ✅ Clause checking and risk assessment
- ✅ Document simplification
- ✅ Legal terms glossary
- ✅ User authentication
- ✅ File upload and management
- ✅ Real-time AI chat

The platform is ready for use and can be customized further based on your specific needs!
