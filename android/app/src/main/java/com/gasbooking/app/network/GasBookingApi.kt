package com.gasbooking.app.network

import com.gasbooking.app.model.*
import retrofit2.Response
import retrofit2.http.*

interface GasBookingApi {
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/bookings/create")
    suspend fun bookCylinder(
        @Header("Authorization") token: String,
        @Body request: BookingRequest
    ): Response<BookingResponse>

    @GET("api/bookings/list")
    suspend fun listBookings(
        @Header("Authorization") token: String
    ): Response<BookingResponse>
}
