package com.gasbooking.app.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    // Replace with your actual Railway backend URL
    private const val BASE_URL = "https://hp-gas-production.up.railway.app/"

    val smsApi: SMSApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(SMSApiService::class.java)
    }
}
