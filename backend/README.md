# Joyverse Backend

Backend authentication system for Joyverse - A platform for dyslexic kids and therapists.

## Features

- 🔐 User registration (for dyslexic kids only)
- 🔑 Login system for both users and therapists
- 🔒 Password hashing with bcrypt
- 📧 Email-based authentication
- 👥 Role-based access (users and therapists)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env` file and update with your MongoDB URI
   - Set your preferred port (default: 5000)

3. **Start MongoDB**
   Make sure MongoDB is running on your system

4. **Run the Server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### POST /api/signup
Register a new user (dyslexic kids only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "age": 10,
  "gender": "male",
  "therapistUID": "therapist_object_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_object_id",
    "pid": "USER_timestamp_randomstring",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 10,
    "gender": "male",
    "therapistId": "therapist_object_id",
    "role": "user"
  }
}
```

### POST /api/login
Login for both users and therapists

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_object_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    // Additional fields for users:
    "pid": "USER_timestamp_randomstring",
    "age": 10,
    "gender": "male",
    "therapistId": "therapist_object_id"
  }
}
```

### GET /api/profile/:id
Get user/therapist profile by ID

## Database Models

### User Model
- `pid`: Unique user identifier
- `name`: User's full name
- `age`: User's age
- `gender`: User's gender
- `email`: User's email (unique)
- `passwordHash`: Hashed password
- `therapistId`: Reference to assigned therapist

### Therapist Model
- `name`: Therapist's full name
- `email`: Therapist's email (unique)
- `passwordHash`: Hashed password

## Security Features

- Passwords are hashed using bcrypt with 12 salt rounds
- Input validation for all required fields
- Duplicate email prevention
- Therapist ID validation during user signup

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 400: Bad Request (missing fields, validation errors)
- 401: Unauthorized (invalid credentials)
- 404: Not Found (user/therapist not found)
- 500: Internal Server Error
