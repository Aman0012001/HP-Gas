package com.gasbooking.app.model

data class SMSMessage(
    val id: Int? = null,
    val sender: String,
    val body: String,
    val timestamp: Long,
    val syncStatus: Int = 0 // 0 = not synced, 1 = synced
)
