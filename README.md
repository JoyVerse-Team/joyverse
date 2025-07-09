#Contributors
1.Akshaya
2.Kaushik
3.Kunal
4.Sneha
5.Varshith
6.Shashank
# Joyverse - Testing Instructions
## Quick Start (Automatic - Both Servers)
# Joyverse - Testing Instructions

## Quick Start (Automatic - Both Servers)

### Option 1: Using NPM (Recommended)
```bash
cd frontend
npm run dev
```
This will automatically start both the backend and frontend servers simultaneously.

### Option 2: Using Batch File (Windows)
Double-click `start-joyverse.bat` in the root directory or run:
```batch
start-joyverse.bat
```

### Option 3: Manual Start (Individual Servers)
If you want to start servers separately:

**Backend Only:**
```bash
cd backend
npm run dev
```

**Frontend Only:**
```bash
cd frontend
npm run dev:frontend-only
```

## Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Test Credentials

### Test Therapist
- **Email:** therapist@joyverse.com
- **Password:** password123
- **Therapist ID:** 6852586bd1242044d0686343

### For Testing User Signup
Use the following test data:
- **Name:** Test User
- **Email:** testuser@example.com
- **Password:** Password123
- **Age:** 10
- **Gender:** male
- **Therapist ID:** 6852586bd1242044d0686343

## API Endpoints

- **POST /api/signup** - User registration (for kids only)
- **POST /api/login** - Login for both users and therapists
- **GET /api/profile/:id** - Get user/therapist profile

## Database
Make sure MongoDB is running and the connection string in the backend `.env` file is correct.

## Testing the Application
- Go to http://localhost:3000/signup to create a new user account
- Go to http://localhost:3000/login to login as either user or therapist
- 
