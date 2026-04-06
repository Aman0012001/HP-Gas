package com.gasbooking.app.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import com.gasbooking.app.model.SMSMessage
import com.gasbooking.app.utils.DatabaseHelper

class SMSReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            val dbHelper = DatabaseHelper(context)

            for (sms in messages) {
                val sender = sms.originatingAddress ?: "Unknown"
                val body = sms.messageBody ?: ""
                val timestamp = sms.timestampMillis

                // Save to Local SQLite Database (syncStatus = 0)
                val localId = dbHelper.insertSMS(SMSMessage(
                    sender = sender,
                    body = body,
                    timestamp = timestamp
                ))
                
                println("SMS CAPTURED: From $sender, Saved with local ID $localId")
            }
        }
    }
}
