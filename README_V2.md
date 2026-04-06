# Gas Booking Utility Platform V2.0 - Upgrade & Deployment Guide

This document outlines the massive upgrade from a simple booking tool to a **production-grade, scalable utility platform**.

## 🚀 Backend Upgrade (Node.js v2.0)

### 1. New Features
*   **JWT Authentication**: All user actions are now secured via JSON Web Tokens.
*   **Password Security**: Bcrypt hashing (10 salt rounds) for user passwords.
*   **Layered Design**: Separation of Routes, Controllers, and Middleware.
*   **Security Headers**: Integrated `helmet` and `cors` for production hardening.

### 2. Environment Variables (.env)
You **MUST** add these to your Railway service:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_super_secret_key_123
PORT=3000
```

---

## 🗄️ Database Schema Update (V2)
Run the script in `database_v2.sql` to modernize your data structure.
*   **`users` table**: Stores account information with unique emails.
*   **`bookings` table**: Now linked to `users.id` with a required `status` field.
*   **Performance**: B-tree indexes added for rapid lookup on `user_id`, `email`, and `status`.

---

## 📱 Android Client v2.0 (Premium)

### 1. Architecture: MVVM + Navigation
*   **Authentication**: Integrated `LoginFragment` and `RegisterFragment` as the app entry point.
*   **State Management**: `BookingViewModel` now persists JWT tokens in SharedPreferences.
*   **Bottom Navigation**: Switch between **Home**, **My Bookings (History)**, and **Profile** seamlessly.
*   **Authorization**: Every network call now includes the `Authorization: Bearer <token>` header.

### 2. UI Updates
*   **Dynamic Bottom Nav**: Automatically hides during login/register for a clean auth flow.
*   **Success Animations**: Material design 3 feedback on booking confirmation.
*   **Real-time Tracking**: Users can monitor `PENDING` → `CONFIRMED` → `DELIVERED` status updates.

---

## 📊 Admin Dashboard (New)
The web-based dashboard is located in `admin/index.html`.
*   **Stats Overview**: At-a-glance view of total, pending, and delivered bookings.
*   **Control Center**: Administrators can manually update status for any user booking.
*   **Data Portability**: Export all platform data to CSV for offline reporting or accounting.
*   **Search Engine**: Instant filtering by consumer number or user email.

---

## 🎯 Production Roadmap
1.  **Deployment**: Push `/backend` to Railway (v2 code).
2.  **Database**: apply `database_v2.sql`.
3.  **Admin**: Host `admin/index.html` (Vercel/Netlify) or run locally to manage bookings.
4.  **Mobile**: Distribute the upgraded Android APK with the new `BASE_URL`.

---

## 🛡️ Future Extensions
The V2.0 system is designed to be **Utility Ready**. You can easily add `POST /api/bill-pay/electricity` or `water` by adding new tables and controllers following the existing booking pattern.
