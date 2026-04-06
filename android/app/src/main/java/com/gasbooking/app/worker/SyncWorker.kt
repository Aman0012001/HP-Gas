package com.gasbooking.app.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.gasbooking.app.network.RetrofitClient
import com.gasbooking.app.network.SMSRequest
import com.gasbooking.app.utils.DatabaseHelper
import java.lang.Exception

class SyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val dbHelper = DatabaseHelper(applicationContext)
        val unsyncedList = dbHelper.getUnsyncedMessages()

        if (unsyncedList.isEmpty()) return Result.success()

        for (sms in unsyncedList) {
            try {
                // 1. Prepare Request (matching backend JSON)
                val request = SMSRequest(
                    sender = sms.sender,
                    message = sms.body,
                    timestamp = sms.timestamp.toString()
                )

                // 2. Sync via API
                val response = RetrofitClient.smsApi.saveSMS(request)

                if (response.isSuccessful) {
                    // 3. Update sync status locally on Success
                    dbHelper.updateSyncStatus(sms.id!!, 1) // 1 = synced
                    println("SMS SYNC SUCCESS: ID ${sms.id}")
                } else {
                    println("SMS SYNC FAILED: API Error ${response.code()}")
                }

            } catch (e: Exception) {
                // If network fails, return Retry to try again later
                return Result.retry()
            }
        }

        return Result.success()
    }
}
