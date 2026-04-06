package com.gasbooking.app.utils

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.gasbooking.app.model.SMSMessage

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, "sms_db", null, 1) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender TEXT NOT NULL,
                body TEXT NOT NULL,
                date LONG NOT NULL,
                sync_status INTEGER DEFAULT 0
            )
        """)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS messages")
        onCreate(db)
    }

    // Insert SMS locally
    fun insertSMS(sms: SMSMessage): Long {
        val db = this.writableDatabase
        val values = ContentValues().apply {
            put("sender", sms.sender)
            put("body", sms.body)
            put("date", sms.timestamp)
            put("sync_status", 0)
        }
        return db.insert("messages", null, values)
    }

    // Fetch Unsynced messages
    fun getUnsyncedMessages(): List<SMSMessage> {
        val list = mutableListOf<SMSMessage>()
        val db = this.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM messages WHERE sync_status = 0", null)
        
        if (cursor.moveToFirst()) {
            do {
                list.add(SMSMessage(
                    id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                    sender = cursor.getString(cursor.getColumnIndexOrThrow("sender")),
                    body = cursor.getString(cursor.getColumnIndexOrThrow("body")),
                    timestamp = cursor.getLong(cursor.getColumnIndexOrThrow("date")),
                    syncStatus = cursor.getInt(cursor.getColumnIndexOrThrow("sync_status"))
                ))
            } while (cursor.moveToNext())
        }
        cursor.close()
        return list
    }

    // Update sync status on success
    fun updateSyncStatus(id: Int, status: Int) {
        val db = this.writableDatabase
        val values = ContentValues().apply {
            put("sync_status", status)
        }
        db.update("messages", values, "id = ?", arrayOf(id.toString()))
    }
}
