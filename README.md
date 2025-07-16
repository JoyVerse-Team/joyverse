#Contributors
1.Akshaya
2.Kaushik
3.Kunal
4.Sneha
5.Varshith
6.Shashank
# Joyverse - Testing Instructions

## 🌟 Overview

Joyverse is an innovative educational platform designed specifically for dyslexic children, combining engaging word games with real-time emotion detection to create a personalized learning experience. The platform uses AI-powered emotion recognition to adapt game difficulty based on children's emotional states, ensuring optimal learning outcomes while maintaining engagement.

## 🏗️ Architecture

### Frontend (Next.js 15 + React 19)
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS with shadcn/ui components
- **Game Engine:** Phaser.js for interactive games
- **Authentication:** JWT-based auth with role-based access control
- **State Management:** React Context API
- **TypeScript:** Full TypeScript support

### Backend (Node.js + Express)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with bcrypt password hashing
- **API Architecture:** RESTful APIs with role-based endpoints
- **Security:** CORS, input validation, and secure password storage

### AI/ML Services (FastAPI + Python)
- **Framework:** FastAPI for high-performance API
- **Computer Vision:** OpenCV for facial landmark detection
- **ML Model:** Custom Transformer model for emotion recognition
- **Real-time Processing:** WebSocket support for live emotion detection
- **Model Storage:** PyTorch models with joblib preprocessing

### Database Schema
- **Users:** Children's profiles with therapist assignments
- **Therapists:** Licensed professionals with approval workflow
- **Admins:** Superadmin management system
- **Sessions:** Game session data with emotion tracking
- **Games:** Progress tracking and performance analytics

## 🎯 Core Features

### 🎮 Educational Games

#### 1. Snake Game
- **Description:** Classic snake game with letter collection mechanics
- **Learning Focus:** Sequential letter recognition and word formation
- **Adaptive Difficulty:** 4 levels (level1-4) with increasing complexity
- **Emotion Integration:** Real-time difficulty adjustment based on frustration detection
- **Progress Tracking:** Word completion rates and session analytics

#### 2. Bouncy Letters Game
- **Description:** Interactive letter-catching game with dyslexia-friendly design
- **Learning Focus:** Letter recognition with emphasis on commonly confused letters (b, d, p, q)
- **Emotion Feedback:** Visual effects change based on detected emotions
- **Multi-Level Progression:** 5 structured levels with increasing challenge
- **Encouraging UI:** Positive reinforcement messaging for learning confidence

#### 3. Car Word Catcher
- **Description:** Driving game where players catch correct letters to form words
- **Learning Focus:** Letter sequence recognition and word building
- **Dynamic Difficulty:** Lane count and word complexity adjust based on performance
- **Visual Design:** Retro-style interface with engaging animations
- **Progression System:** Automatic difficulty scaling with performance metrics

#### 4. Word Puzzle Game
- **Description:** Drag-and-drop puzzle game for word formation
- **Learning Focus:** Letter arrangement and spelling practice
- **Visual Hints:** Image-based word recognition support
- **Accessibility:** Designed specifically for dyslexic learners
- **Interactive Elements:** Shuffle, reset, and hint systems

### 🤖 AI-Powered Emotion Detection

#### Real-time Emotion Recognition
- **Technology:** Custom Transformer model trained on facial expressions
- **Accuracy:** High-precision emotion classification (happy, sad, neutral, surprise, angry, fear, disgust)
- **Performance:** Real-time processing with minimal latency
- **Privacy:** Client-side image processing with secure data handling

#### Adaptive Learning System
- **Emotion-Based Difficulty:** Automatic game difficulty adjustment based on frustration/engagement levels
- **Learning Optimization:** Personalized pacing to maintain optimal challenge level
- **Progress Analytics:** Detailed emotion trends and learning pattern analysis
- **Therapeutic Insights:** Comprehensive reports for therapist review

### 👥 Multi-Role Management System

#### Children (Primary Users)
- **Secure Registration:** Age-appropriate signup with therapist assignment
- **Game Access:** Full access to educational games and activities
- **Progress Tracking:** Personal achievement and improvement metrics
- **Safety Features:** Restricted access and child-friendly interface

#### Therapists (Licensed Professionals)
- **Approval Workflow:** Admin-approved access for qualified professionals
- **Student Management:** Comprehensive student progress monitoring
- **Analytics Dashboard:** Detailed emotion and learning analytics
- **Session Reports:** Individual and group performance insights
- **Professional Tools:** Therapeutic assessment and intervention planning

#### Superadmin (System Management)
- **Therapist Approval:** Review and approve therapist access requests
- **System Overview:** Platform-wide analytics and user management
- **Quality Control:** Ensure platform safety and educational standards
- **Administrative Tools:** User management and system configuration

### 📊 Analytics & Reporting

#### Student Progress Analytics
- **Game Performance:** Completion rates, accuracy, and improvement trends
- **Emotion Patterns:** Emotional state tracking during learning sessions
- **Learning Insights:** Personalized recommendations for optimal learning
- **Time Tracking:** Session duration and engagement metrics

#### Therapist Dashboard
- **Student Overview:** Multi-student progress monitoring
- **Detailed Reports:** Individual session analysis with emotion data
- **Intervention Planning:** Data-driven therapeutic recommendations
- **Progress Visualization:** Charts and graphs for easy interpretation

#### Administrative Reports
- **Platform Usage:** User engagement and system performance metrics
- **Therapeutic Outcomes:** Success rates and improvement indicators
- **System Health:** Technical performance and error monitoring
- **User Satisfaction:** Feedback and platform effectiveness measures

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js:** Version 18 or higher
- **MongoDB:** Local installation or MongoDB Atlas connection
- **Python:** Version 3.8+ for AI services
- **Git:** For version control

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/PeerStackLabs/joyverse.git
cd joyverse
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **AI Services Setup**
```bash
cd fastapi
pip install -r requirements.txt
```

5. **Database Configuration**
- Install MongoDB locally or set up MongoDB Atlas
- Update connection string in backend `.env` file

## 🚀 Starting the Application

### ⚡ Option 1: Quick Start (Windows - Recommended)
The easiest way to start all services simultaneously:

```batch
# Double-click the batch file or run in terminal
start-joyverse.bat
```

This will automatically start:
- **Backend Server** on http://localhost:5000
- **Frontend Application** on http://localhost:3000  
- **FastAPI/AI Services** on http://localhost:8000

### 🔧 Option 2: Manual Start (All Platforms)
Start each service in separate terminals:

#### Terminal 1: Backend Server
```bash
cd backend
npm run dev
# Backend will start on http://localhost:5000
```

#### Terminal 2: Frontend Application
```bash
cd frontend
npm run dev
# Frontend will start on http://localhost:3000
```

#### Terminal 3: AI/ML Services
```bash
cd fastapi
python main.py
# FastAPI will start on http://localhost:8000
```

### 🌐 Access Points Summary
Once all services are running:
- **🎮 Main Application:** http://localhost:3000
- **🔌 Backend API:** http://localhost:5000
- **🤖 AI Services:** http://localhost:8000

### ✅ Verification
To verify everything is working:
1. Open http://localhost:3000 in your browser
2. You should see the Joyverse homepage
3. Try signing up or logging in with test credentials

## 🔐 Authentication & Security

### User Roles & Permissions
- **Children:** Game access, progress tracking, emotion detection
- **Therapists:** Student management, analytics, session monitoring
- **Superadmin:** System management, therapist approval, platform oversight

### Security Features
- **Password Hashing:** bcrypt with salt rounds for secure storage
- **JWT Tokens:** Secure session management with role-based access
- **Input Validation:** Comprehensive data validation and sanitization
- **CORS Protection:** Cross-origin request security
- **Privacy Compliance:** Child-safe data handling and storage

### Test Credentials

#### Test Therapist
- **Email:** therapist@joyverse.com
- **Password:** password123
- **Therapist ID:** 6852586bd1242044d0686343

#### Test Child Account
- **Name:** Test User
- **Email:** testuser@example.com
- **Password:** Password123
- **Age:** 10
- **Gender:** male
- **Therapist ID:** 6852586bd1242044d0686343

## 📁 Project Structure

```
joyverse/
├── backend/                    # Node.js/Express API
│   ├── middleware/            # Authentication & validation
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   └── scripts/              # Database utilities
├── frontend/                  # Next.js React application
│   ├── app/                  # App Router pages
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions
├── fastapi/                   # Python AI services
│   ├── static/               # Static assets
│   └── templates/            # HTML templates
├── model/                     # AI/ML models
│   └── fer_model/            # Emotion recognition models
└── word-puzzle/              # Standalone word puzzle game
```

## 🎮 Game Development

### Game Engine: Phaser.js
- **Version:** Phaser 3.90.0
- **Features:** Canvas-based rendering, physics engine, audio support
- **Optimization:** Responsive design, performance monitoring
- **Accessibility:** Dyslexia-friendly fonts and color schemes

### Game Development Guidelines
- **Child-Friendly Design:** Age-appropriate interfaces and content
- **Educational Focus:** Learning objectives integrated into gameplay
- **Emotional Intelligence:** Emotion-responsive game mechanics
- **Progress Tracking:** Comprehensive analytics and feedback systems

## 🤖 AI/ML Integration

### Emotion Recognition Model
- **Architecture:** Custom Transformer model for facial expression analysis
- **Training Data:** Facial landmark detection with emotion classification
- **Performance:** Real-time processing with high accuracy
- **Privacy:** Local processing with secure data handling

### Model Specifications
- **Input:** Facial landmarks (468 points)
- **Output:** Emotion classification (7 categories)
- **Framework:** PyTorch with custom Transformer architecture
- **Preprocessing:** Landmark normalization and feature extraction

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/signup` - Child registration
- `POST /api/login` - User/therapist login
- `POST /api/therapist-signup` - Therapist registration request
- `GET /api/profile/:id` - User profile retrieval

### Game Session Endpoints
- `POST /api/game/session` - Create game session
- `PUT /api/game/session/:id` - Update session with emotion data
- `GET /api/game/sessions` - Retrieve session history

### Therapist Dashboard Endpoints
- `GET /therapist/students/:therapistId` - Get assigned students
- `GET /therapist/dashboard/:therapistId` - Dashboard analytics
- `GET /therapist/session/:sessionId/emotions` - Session emotion data

### Admin Management Endpoints
- `GET /admin/therapists` - List therapist requests
- `POST /admin/therapists/:id/approve` - Approve therapist
- `POST /admin/therapists/:id/reject` - Reject therapist
- `GET /admin/dashboard/stats` - Platform statistics

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/joyverse
JWT_SECRET=your-secret-key
PORT=5000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

### Database Configuration
- **MongoDB:** Document-based storage for user data and sessions
- **Connection:** Automatic retry logic with connection pooling
- **Indexes:** Optimized queries for performance
- **Backup:** Regular data backup and recovery procedures

## 🚀 Deployment

### Production Deployment
1. **Environment Setup:** Configure production environment variables
2. **Database Migration:** Set up production MongoDB instance
3. **Build Process:** Compile frontend and backend applications
4. **Security Configuration:** SSL certificates and security headers
5. **Monitoring:** Set up application monitoring and logging

### Performance Optimization
- **Frontend:** Next.js optimization with SSR/SSG
- **Backend:** Express.js with caching and compression
- **Database:** MongoDB indexing and query optimization
- **AI Services:** Model optimization and caching strategies

## 🤝 Contributing

### Development Guidelines
- **Code Style:** ESLint and Prettier configuration
- **Testing:** Jest for unit tests, Cypress for e2e testing
- **Documentation:** Comprehensive code documentation
- **Version Control:** Git workflow with feature branches

### Educational Focus
- **Dyslexia Research:** Evidence-based learning approaches
- **Child Development:** Age-appropriate design principles
- **Therapeutic Integration:** Collaboration with licensed professionals
- **Accessibility:** WCAG compliance and inclusive design

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Technical Support
- **Documentation:** Comprehensive developer documentation
- **Community:** Developer community and forums
- **Professional Support:** Enterprise support options

### Educational Support
- **Therapist Training:** Platform usage training for professionals
- **Parent Resources:** Guides for supporting children's learning
- **Research Collaboration:** Academic research partnerships

## 🎯 Future Roadmap

### Planned Features
- **Multi-language Support:** Localization for global accessibility
- **Advanced Analytics:** Machine learning insights for learning patterns
- **Mobile Application:** Native mobile app development
- **Social Features:** Safe peer interaction and collaboration tools

### Research Integration
- **Academic Partnerships:** Collaboration with educational institutions
- **Evidence-Based Development:** Research-driven feature development
- **Therapeutic Validation:** Clinical studies and outcome measurement
- **Accessibility Improvements:** Continuous accessibility enhancements

---

**Joyverse** - Transforming learning for dyslexic children through technology, empathy, and innovation. 🌟
