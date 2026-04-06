package com.gasbooking.app.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

data class SMSRequest(
    val sender: String,
    val message: String,
    val timestamp: String
)

interface SMSApiService {
    @POST("api/sms/save")
    suspend fun saveSMS(@Body request: SMSRequest): Response<Unit>
}
