# Prometheus Backend

Backend API for Prometheus 2026 event registration system built with Express.js and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB URI

Update the `.env` file with your MongoDB connection URI:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prometheus?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**How to get MongoDB URI:**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/prometheus?retryWrites=true&w=majority`
- Replace `username`, `password`, and cluster details

### 3. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/profile` - Get user profile (requires auth)
- **PUT** `/api/auth/profile` - Update user profile (requires auth)

### Payment Routes (`/api/payment`)

- **POST** `/api/payment/submit-utr` - Submit UTR/transaction ID (requires auth)
- **GET** `/api/payment/status` - Get payment status (requires auth)

### Events Routes (`/api/events`)

- **POST** `/api/events/register` - Register for event (requires auth)
- **GET** `/api/events/registered` - Get all registered events (requires auth)
- **GET** `/api/events/available` - Get available events
- **DELETE** `/api/events/unregister/:eventName` - Unregister from event (requires auth)

## Database Schema

### User Model

```javascript
{
  // Personal Information
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),

  // Educational Information
  college: String,
  branch: String,
  year: String (1st, 2nd, 3rd, 4th),

  // Payment Information
  paymentStatus: String (pending, completed, failed),
  transactionId: String,
  paymentAmount: Number,
  paymentDate: Date,

  // Event Registration
  registeredEvents: [
    {
      eventName: String (Enigma, Order of Chaos, Tech Quiz),
      registrationDate: Date,
      status: String (registered, participated, completed)
    }
  ],

  // Account Status
  isVerified: Boolean,
  verificationToken: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Available Events

- Enigma
- Order of Chaos
- Tech Quiz

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer <your_jwt_token>
```

## Example Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "college": "Delhi University",
    "branch": "Computer Science",
    "year": "2nd",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Submit UTR
```bash
curl -X POST http://localhost:5000/api/payment/submit-utr \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "UTR12345678",
    "paymentAmount": 500
  }'
```

### Register for Event
```bash
curl -X POST http://localhost:5000/api/events/register \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Enigma"
  }'
```

## Registration Flow

1. **User Registration**: Fill in personal and educational details → User is created
2. **Payment**: Submit UTR/transaction ID → Payment status updated to "completed"
3. **Event Registration**: Register for contests (Enigma, Order of Chaos, Tech Quiz) → Events added to user's registered events

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | Server port (default: 5000) |
| `JWT_SECRET` | Secret key for JWT token generation |
| `NODE_ENV` | Environment (development, production) |

---

For frontend integration, use the token received from login/register endpoints for authenticated requests.
