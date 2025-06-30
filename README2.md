# Cross-Border Payment App Backend - Setup Instructions

## 📋 Prerequisites

Before setting up the backend, ensure you have the following installed and configured:

### Required Software
- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (v8.x or higher) - comes with Node.js
- **MongoDB** (v5.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Required Accounts & Services
1. **Firebase Account** - [Get Started](https://firebase.google.com/)
   - Create a new Firebase project
   - Enable Authentication
   - Generate Admin SDK private key
   
2. **Cloudinary Account** - [Sign Up](https://cloudinary.com/)
   - Get your cloud name, API key, and API secret
   
3. **Email Service** (Choose one):
   - **SendGrid** - [Sign Up](https://sendgrid.com/)
   - **Gmail SMTP** - [Setup App Password](https://support.google.com/accounts/answer/185833)
   
4. **Currency Exchange API** (Choose one):
   - **ExchangeRate-API** - [Get Free API Key](https://exchangerate-api.com/)
   - **Fixer.io** - [Get API Key](https://fixer.io/)

---

## 🚀 Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd cross-border-payment-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

#### Create `.env` file from template:
```bash
cp .env.example .env
```

#### Edit `.env` file with your credentials:
```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/payment_app
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Choose one)
# SendGrid
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourapp.com
FROM_NAME=YourApp

# Gmail SMTP (Alternative)
# EMAIL_SERVICE=gmail
# GMAIL_USER=your-email@gmail.com
# GMAIL_PASS=your-app-password

# Currency Exchange API
EXCHANGE_RATE_API_KEY=your-exchange-rate-api-key
EXCHANGE_RATE_BASE_URL=https://api.exchangerate-api.com/v4/latest/

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
OTP_EXPIRY_MINUTES=10
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=30

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp,application/pdf

# Transaction Limits
DAILY_TRANSACTION_LIMIT=10000
SINGLE_TRANSACTION_LIMIT=5000
MIN_TRANSACTION_AMOUNT=1

# Webhook URLs (for payment gateways)
WEBHOOK_SECRET=your-webhook-secret
PAYMENT_SUCCESS_URL=http://localhost:3000/api/payments/success
PAYMENT_CANCEL_URL=http://localhost:3000/api/payments/cancel
```

### 4. Firebase Setup

#### Download Firebase Admin SDK Key:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Download the JSON file
4. Extract the values for your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the newlines as `\n`)

### 5. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
# Windows: Start MongoDB as a Windows Service

# Create database (optional - will be created automatically)
mongosh
> use payment_app
> db.createCollection("users")
> exit
```

#### Option B: MongoDB Atlas (Cloud)
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create database user
3. Whitelist your IP address
4. Get connection string and update `MONGODB_URI` in `.env`

---

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Using npm
npm run dev

# Using nodemon directly
npx nodemon server.js

# Using node (without auto-restart)
npm start
```

### Production Mode
```bash
NODE_ENV=production npm start
```

The server will start on `http://localhost:3000` (or your specified PORT).

---

## 🧪 Testing the Backend

### 1. Verify Server is Running
```bash
curl http://localhost:3000/api/health
```
**Expected Response:**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### 2. Verify Database Connection
Check server logs for:
```
✅ Connected to MongoDB successfully
```

### 3. Test Key Endpoints

#### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "phone": "+1234567890",
    "countryCode": "US"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get User Profile (requires token)
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Get Wallet Balance
```bash
curl -X GET http://localhost:3000/api/wallet/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Send Money
```bash
curl -X POST http://localhost:3000/api/transaction/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "recipientEmail": "recipient@example.com",
    "amount": 100.00,
    "currency": "USD",
    "description": "Test payment"
  }'
```

#### Get Exchange Rates
```bash
curl -X GET "http://localhost:3000/api/currency/rates?from=USD&to=EUR"
```

---

## 📱 Postman Collection

### Import these endpoints into Postman:

```json
{
  "info": {
    "name": "Cross-Border Payment API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Wallet",
      "item": [
        {
          "name": "Get Balance",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{baseUrl}}/api/wallet/balance",
              "host": ["{{baseUrl}}"],
              "path": ["api", "wallet", "balance"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": "your-jwt-token-here"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```
Error: MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solutions:**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check MongoDB logs: `sudo journalctl -u mongod`
- Verify connection string in `.env`

#### 2. Firebase Authentication Error
```
Error: Firebase Admin SDK initialization failed
```
**Solutions:**
- Verify Firebase credentials in `.env`
- Ensure private key format is correct (with `\n` for newlines)
- Check Firebase project permissions

#### 3. Email Service Error
```
Error: Email service configuration invalid
```
**Solutions:**
- Verify email service credentials
- For Gmail: ensure 2FA is enabled and app password is used
- For SendGrid: verify API key is valid

#### 4. File Upload Issues
```
Error: File upload failed
```
**Solutions:**
- Check Cloudinary credentials
- Verify file size limits
- Ensure allowed file types are correct

#### 5. Rate Limiting Errors
```
Error: Too many requests
```
**Solutions:**
- Adjust rate limiting settings in `.env`
- Clear rate limit cache (restart server)
- Check IP whitelist settings

### Debug Mode
Enable detailed logging:
```bash
DEBUG=app:* npm run dev
```

### Server Logs
Monitor server logs for detailed error information:
```bash
tail -f logs/app.log  # if logging to file
```

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

### Database Health
```bash
curl http://localhost:3000/api/health/database
```

### Service Status
```bash
curl http://localhost:3000/api/health/services
```

---

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/payment_app
# Update all URLs to production domains
# Use strong secrets and keys
# Enable SSL/HTTPS
```

### Production Checklist
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up proper database backups
- [ ] Configure monitoring and alerting
- [ ] Set up log aggregation
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up CI/CD pipeline
- [ ] Configure environment-specific settings
- [ ] Enable security headers

---

## 📚 API Documentation

Once the server is running, visit:
- API Documentation: `http://localhost:3000/api/docs` (if Swagger is implemented)
- Health Status: `http://localhost:3000/api/health`

---

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check server logs for detailed error messages
4. Ensure all required services are running

---

**🎉 Your Cross-Border Payment App Backend is now ready for development!**