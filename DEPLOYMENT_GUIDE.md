# 🚀 Clario Legal Platform - Vercel Deployment Guide

This guide will help you deploy your Clario legal platform to Vercel for public access.

## 📋 Prerequisites

Before starting, you need:
1. **GitHub account** (free)
2. **Vercel account** (free)
3. **MongoDB Atlas account** (free)
4. **OpenAI API key** (paid, but has free credits)

## 🎯 Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas (Database)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a free account**
3. **Create a new project** called "Clario"
4. **Build a cluster** (choose the free M0 tier)
5. **Create a database user:**
   - Go to Database Access
   - Add New Database User
   - Username: `clario-user`
   - Password: Generate a secure password (save it!)
6. **Whitelist IP addresses:**
   - Go to Network Access
   - Add IP Address
   - Choose "Allow access from anywhere" (0.0.0.0/0)
7. **Get connection string:**
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

**Example connection string:**
```
mongodb+srv://clario-user:your-password@cluster0.xxxxx.mongodb.net/clario?retryWrites=true&w=majority
```

### Step 2: Get OpenAI API Key

1. **Go to [OpenAI Platform](https://platform.openai.com/api-keys)**
2. **Create account or sign in**
3. **Add billing information** (required for API access)
4. **Generate a new API key**
5. **Copy the key** (starts with `sk-`)

### Step 3: Push Code to GitHub

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Clario Legal Platform"
   ```

2. **Create GitHub repository:**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name: `clario-legal-platform`
   - Make it public
   - Don't initialize with README

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/your-username/clario-legal-platform.git
   git branch -M main
   git push -u origin main
   ```

### Step 4: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up with GitHub**
3. **Import your repository:**
   - Click "New Project"
   - Import `clario-legal-platform`
   - Click "Deploy"

4. **Configure environment variables:**
   - Go to Project Settings > Environment Variables
   - Add these variables:

   ```
   MONGODB_URI = mongodb+srv://clario-user:your-password@cluster0.xxxxx.mongodb.net/clario?retryWrites=true&w=majority
   OPENAI_API_KEY = sk-your-openai-api-key-here
   JWT_SECRET = clario-super-secure-jwt-secret-key-2024-production
   NODE_ENV = production
   JWT_EXPIRES_IN = 7d
   MAX_FILE_SIZE = 10485760
   UPLOAD_PATH = ./uploads
   RATE_LIMIT_WINDOW_MS = 900000
   RATE_LIMIT_MAX_REQUESTS = 100
   ```

5. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy" on the latest deployment

### Step 5: Seed the Database

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link to your project:**
   ```bash
   vercel link
   ```

4. **Pull environment variables:**
   ```bash
   vercel env pull .env.local
   ```

5. **Seed the database:**
   ```bash
   cd backend
   node scripts/seedGlossary.js
   ```

### Step 6: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://clario-legal-platform.vercel.app`)
2. **Test the features:**
   - Try AI Chat
   - Test Clause Checker
   - Use Side-by-Side View
   - Browse Glossary
   - Register a new user

## 🎉 Success!

Your Clario legal platform is now live and accessible to everyone!

## 🔧 Troubleshooting

### Common Issues:

1. **Database connection error:**
   - Check MongoDB Atlas connection string
   - Verify IP whitelist includes 0.0.0.0/0
   - Check database user credentials

2. **OpenAI API errors:**
   - Verify API key is correct
   - Check billing is set up on OpenAI account
   - Ensure API key has proper permissions

3. **Build errors:**
   - Check all environment variables are set
   - Verify package.json dependencies
   - Check Vercel build logs

4. **Frontend not loading:**
   - Check VITE_API_URL is set to `/api`
   - Verify Vercel routes configuration
   - Check browser console for errors

## 📱 Share Your Platform

Once deployed, you can:
- Share the Vercel URL with anyone
- Add it to your portfolio
- Submit to legal tech directories
- Get user feedback and iterate

## 🚀 Next Steps

After successful deployment:
1. **Customize the branding** (colors, logo, text)
2. **Add more legal terms** to the glossary
3. **Implement user management** features
4. **Add analytics** to track usage
5. **Set up monitoring** and error tracking

## 📞 Support

If you encounter any issues:
1. Check the Vercel deployment logs
2. Verify all environment variables
3. Test the API endpoints directly
4. Check MongoDB Atlas connection

Your Clario legal platform is now ready for the world! 🌍
