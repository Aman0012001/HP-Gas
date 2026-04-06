# Gas Booking App - Implementation & Deployment Guide

This guide provides the complete setup for your production-ready **Gas Booking App**, featuring a modern Android frontend and a scalable Node.js backend.

## 🚀 Backend Setup (Node.js + PostgreSQL)

### 1. Database Schema
Run the following SQL in your PostgreSQL instance (e.g., on Railway):

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    consumer_number VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Deployment to Railway (Recommended)
1. **Prepare Code**: Push the `/backend` folder to a GitHub repository.
2. **Connect to Railway**: 
   - New Project → Deploy from GitHub repo.
   - Add a PostgreSQL database to your project via Railway.
3. **Environment Variables**:
   Railway will automatically provide `DATABASE_URL`. Ensure your service have these:
   - `DATABASE_URL`: (PostgreSQL connection string)
   - `PORT`: 3000 (standard)

### 3. API Endpoint
- **URL**: `https://your-api-url.up.railway.app/book-gas`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "mobile": "9876543210",
    "address": "123 Main St, Kolkata",
    "consumer_number": "HP123456",
    "provider": "HP"
  }
  ```

---

## 📱 Android Frontend (Kotlin + MVVM)

### 1. Project Tech Stack
* **Language**: Kotlin
* **UI**: XML with Material 3, ViewBinding
* **Network**: Retrofit 2 + Gson
* **Architecture**: MVVM with StateFlow

### 2. Connect to API
Update the `BASE_URL` in `BookingViewModel.kt` with your actual Railway backend URL.

```kotlin
// In android/app/src/main/java/com/gasbooking/app/viewmodel/BookingViewModel.kt
private val BASE_URL = "https://your-app-url.up.railway.app/"
```

### 3. UI Features
* **Modern Home**: Card-based provider selection with ripple effects and soft gradients.
* **Smart Form**: Real-time validation for phone numbers and empty fields.
* **Success Feedback**: Material alert dialogs for booking confirmation.

---

## 🛡️ Security & Best Practices
- **Rate Limiting**: Backend is configured with `express-rate-limit` to prevent brute-force booking.
- **Sanitization**: Inputs are escaped using `validator.js` to prevent SQL injection/XSS.
- **MVVM Architecture**: Clean separation of concerns for scalability and testability.
- **Material 3**: Follows Google's latest design guidelines for a premium look and feel.
