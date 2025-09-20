# Clario Backend API

This is the backend API for the Clario legal platform, providing AI-powered legal document analysis, clause checking, and document simplification services.

## Features

- **User Authentication**: JWT-based authentication with user registration and login
- **Document Management**: Upload, store, and manage legal documents
- **AI Integration**: OpenAI-powered document analysis and simplification
- **Clause Checking**: AI-powered standard clause verification
- **Legal Glossary**: Comprehensive database of legal terms
- **File Upload**: Support for PDF, DOC, DOCX, and TXT files

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **OpenAI API** for AI-powered features
- **JWT** for authentication
- **Multer** for file uploads
- **Express Validator** for input validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/clario

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# OpenAI Configuration
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

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if using local installation)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 4. Seed the Database

Populate the legal terms glossary:

```bash
npm run seed
# or
node scripts/seedGlossary.js
```

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Documents
- `GET /api/documents` - Get user's documents
- `POST /api/documents` - Create new document
- `POST /api/documents/upload` - Upload document file
- `GET /api/documents/:id` - Get single document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/analyze` - Analyze document
- `POST /api/documents/:id/simplify` - Simplify document
- `POST /api/documents/:id/check-clauses` - Check standard clauses

### AI Services
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/analyze-clauses` - Analyze document clauses
- `POST /api/ai/simplify-document` - Simplify legal document
- `POST /api/ai/check-standard-clauses` - Check standard clauses
- `POST /api/ai/generate-document` - Generate legal document

### Glossary
- `GET /api/glossary` - Get legal terms with search/filter
- `GET /api/glossary/:id` - Get single legal term
- `GET /api/glossary/search/:term` - Search for specific term
- `GET /api/glossary/categories` - Get all categories
- `GET /api/glossary/random/:count` - Get random terms

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Upload

The API supports file uploads for documents. Supported formats:
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Plain Text (.txt)

Maximum file size: 10MB

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Applied to all `/api/` routes

## Error Handling

All API responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": object (optional),
  "errors": array (optional)
}
```

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed the database with legal terms
- `npm test` - Run tests

### Project Structure

```
backend/
├── config/          # Database configuration
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic services
├── scripts/         # Database seeding scripts
├── uploads/         # File upload directory
└── server.js        # Main server file
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure JWT secrets
4. Configure proper CORS settings
5. Set up file storage (AWS S3, etc.)
6. Use a reverse proxy (nginx)
7. Enable HTTPS

## Support

For issues or questions, please contact the development team.
