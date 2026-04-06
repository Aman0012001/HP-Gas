package com.gasbooking.app.model

import com.google.gson.annotations.SerializedName

// Auth Models
data class LoginRequest(val email: String, val pass: String)
data class RegisterRequest(val name: String, val email: String, val pass: String)

data class AuthResponse(
    val success: Boolean,
    val user: User,
    val token: String
)

data class User(
    val id: Int,
    val name: String,
    val email: String
)

// Booking Models
data class BookingRequest(
    val name: String,
    val mobile: String,
    val address: String,
    @SerializedName("consumer_number") val consumerNumber: String,
    val provider: String
)

data class BookingResponse(
    val success: Boolean,
    val message: String,
    val bookings: List<BookingDetails>
)

data class BookingDetails(
    val id: Int,
    val name: String,
    val provider: String,
    val status: String?,
    @SerializedName("created_at") val createdAt: String
)
