# 🏛️ Clario - Legal Life Organizer

**Clario** is a comprehensive legal management platform designed to simplify legal document management, deadline tracking, and legal research for individuals and small businesses. Built with modern web technologies and featuring AI-powered assistance, Clario makes legal processes more accessible and efficient.

![Clario Logo](https://img.shields.io/badge/Clario-Legal%20Life%20Organizer-blue?style=for-the-badge&logo=scale&logoColor=white)

## ✨ Features

### 🤖 **AI-Powered Legal Assistant**
- **Smart Chat Bot**: Get instant answers to legal questions with varied, intelligent responses
- **Clause-by-Clause Analysis**: Upload documents for detailed clause analysis and risk assessment
- **Document Simplification**: Convert complex legal language into plain, understandable text
- **Risk Assessment**: Identify potential legal risks and compliance issues

### 📋 **Document Management**
- **Document Generator**: Create professional legal documents from templates
- **Side-by-Side Comparison**: Compare original vs simplified versions of legal documents
- **File Upload Support**: Upload and analyze PDF, DOC, DOCX, and TXT files
- **Version Control**: Track document versions and changes

### 📅 **Deadline & Task Management**
- **Smart Deadline Tracking**: Never miss important legal deadlines
- **Priority Management**: Categorize tasks by urgency and importance
- **Calendar Integration**: Visual timeline of upcoming legal obligations
- **Automated Reminders**: Stay on top of critical dates

### 📚 **Legal Knowledge Base**
- **Comprehensive Glossary**: Searchable database of legal terms and definitions
- **Category Filtering**: Organize terms by legal practice areas
- **Complexity Levels**: From basic to advanced legal concepts
- **Usage Examples**: Real-world context for legal terminology

### 📊 **Analytics & Reporting**
- **Legal Health Dashboard**: Overview of your legal compliance status
- **Risk Scoring**: Quantified assessment of legal risks
- **Progress Tracking**: Monitor completion of legal tasks
- **Compliance Reports**: Generate detailed legal health reports

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/clario-legal-organizer.git
   cd clario-legal-organizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8081` (or the port shown in terminal)

### 🎯 **Demo Mode**
Clario runs in demo mode by default, featuring:
- ✅ **No backend required** - Everything works out of the box
- ✅ **Sample data included** - Test all features immediately
- ✅ **Mock AI responses** - Experience AI functionality without API keys
- ✅ **Full feature access** - All tools available for demonstration

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icons

### Backend (Optional)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **OpenAI API** - AI-powered features
- **JWT** - Authentication

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vite** - Build tooling

## 📱 User Interface

### Dark Theme
Clario features a professional dark theme optimized for:
- **Reduced eye strain** during long legal research sessions
- **Better focus** on document content
- **Modern aesthetic** that feels professional and trustworthy
- **Accessibility** with high contrast ratios

### Responsive Design
- **Mobile-first** approach
- **Tablet optimized** layouts
- **Desktop enhanced** features
- **Touch-friendly** interactions

## 🎮 How to Use

### 1. **AI Chat Assistant** (`/ai-chat`)
- Ask legal questions and get instant, varied responses
- Upload documents for analysis
- Get clause-by-clause breakdowns
- Receive risk assessments and recommendations

### 2. **Clause Checker** (`/clause-checker`)
- Upload legal documents for analysis
- Identify standard vs non-standard clauses
- Get risk level assessments
- View detailed recommendations

### 3. **Side-by-Side View** (`/side-by-side`)
- Compare original vs simplified documents
- Upload files or use sample documents
- Copy simplified versions to clipboard
- Switch between different view modes

### 4. **Legal Glossary** (`/glossary`)
- Search through legal terms and definitions
- Filter by category and complexity
- View usage examples and synonyms
- Learn legal concepts with context

### 5. **Dashboard** (`/dashboard`)
- Overview of your legal health
- Quick access to all features
- Generate legal health reports
- Track compliance metrics

### 6. **Deadlines** (`/deadlines`)
- Manage legal deadlines and tasks
- Set priorities and categories
- Track progress and completion
- Get automated reminders

### 7. **Documents** (`/documents`)
- Generate legal documents from templates
- Upload and manage files
- Track document versions
- Export and share documents

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Clario Legal Organizer

# Optional: Backend Configuration (for full features)
MONGODB_URI=mongodb://localhost:27017/clario
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Customization
- **Themes**: Modify `src/index.css` for custom color schemes
- **Components**: Customize UI components in `src/components/ui/`
- **Features**: Add new features in `src/pages/`
- **API**: Extend API services in `src/services/`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Backend (Optional)
cd backend
npm install          # Install backend dependencies
npm start            # Start backend server
npm run seed         # Seed database with sample data
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Self-Hosted
1. Build the project: `npm run build`
2. Serve the `dist` folder with any static file server
3. Configure your web server for SPA routing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions
- **Email**: Contact us at support@clario-legal.com

## 🗺️ Roadmap

### Version 2.0
- [ ] Real-time collaboration features
- [ ] Advanced AI document analysis
- [ ] Integration with legal databases
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics

### Version 1.5
- [ ] User authentication and profiles
- [ ] Document sharing and collaboration
- [ ] Advanced search capabilities
- [ ] Export to multiple formats
- [ ] Integration with calendar apps

### Version 1.2
- [ ] Additional document templates
- [ ] Enhanced AI responses
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Multi-language support

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Radix UI** for accessible UI primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the comprehensive icon set
- **Vite** for the fast development experience

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/clario-legal-organizer)
![GitHub issues](https://img.shields.io/github/issues/your-username/clario-legal-organizer)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/clario-legal-organizer)
![GitHub stars](https://img.shields.io/github/stars/your-username/clario-legal-organizer)

---

**Built with ❤️ for the legal community**

*Clario - Making legal processes accessible, efficient, and understandable for everyone.*