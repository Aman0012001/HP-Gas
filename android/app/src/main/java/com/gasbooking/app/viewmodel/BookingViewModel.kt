package com.gasbooking.app.viewmodel

import android.app.Application
import android.content.Context
import androidx.lifecycle.*
import com.gasbooking.app.model.*
import com.gasbooking.app.network.GasBookingApi
import com.google.gson.Gson
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class BookingViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = application.getSharedPreferences("booking_prefs", Context.MODE_PRIVATE)
    private val BASE_URL = "https://your-api-v2.up.railway.app/" // Update with your V2 URL

    private val api: GasBookingApi = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(GasBookingApi::class.java)

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState = _authState.asStateFlow()

    private val _bookingState = MutableStateFlow<BookingState>(BookingState.Idle)
    val bookingState = _bookingState.asStateFlow()

    private val _historyState = MutableStateFlow<HistoryState>(HistoryState.Idle)
    val historyState = _historyState.asStateFlow()

    fun register(name: String, email: String, pass: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val response = api.register(RegisterRequest(name, email, pass))
                if (response.isSuccessful) _authState.value = AuthState.Success("Account Created!")
                else _authState.value = AuthState.Error(parseError(response))
            } catch (e: Exception) { _authState.value = AuthState.Error(e.message ?: "Network error") }
        }
    }

    fun login(email: String, pass: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val response = api.login(LoginRequest(email, pass))
                if (response.isSuccessful && response.body() != null) {
                    saveToken(response.body()!!.token)
                    _authState.value = AuthState.Authenticated(response.body()!!.user)
                } else _authState.value = AuthState.Error(parseError(response))
            } catch (e: Exception) { _authState.value = AuthState.Error(e.message ?: "Network error") }
        }
    }

    fun bookGas(request: BookingRequest) {
        val token = "Bearer ${getToken()}"
        viewModelScope.launch {
            _bookingState.value = BookingState.Loading
            try {
                val response = api.bookCylinder(token, request)
                if (response.isSuccessful) _bookingState.value = BookingState.Success("Booking Confirmed!")
                else _bookingState.value = BookingState.Error(parseError(response))
            } catch (e: Exception) { _bookingState.value = BookingState.Error(e.message ?: "Error") }
        }
    }

    fun fetchHistory() {
        val token = "Bearer ${getToken()}"
        viewModelScope.launch {
            _historyState.value = HistoryState.Loading
            try {
                val response = api.listBookings(token)
                if (response.isSuccessful && response.body() != null) {
                    _historyState.value = HistoryState.Loaded(response.body()!!.bookings)
                } else _historyState.value = HistoryState.Error("Failed to fetch history")
            } catch (e: Exception) { _historyState.value = HistoryState.Error(e.message ?: "Network error") }
        }
    }

    private fun saveToken(token: String) = prefs.edit().putString("token", token).apply()
    private fun getToken() = prefs.getString("token", "")
    fun logout() = prefs.edit().remove("token").apply()

    private fun parseError(response: retrofit2.Response<*>): String {
        return try {
            val errorBody = response.errorBody()?.string()
            val errorMap = Gson().fromJson(errorBody, Map::class.java)
            errorMap["error"]?.toString() ?: "Unknown error"
        } catch (e: Exception) { "Something went wrong" }
    }

    sealed class AuthState {
        object Idle : AuthState()
        object Loading : AuthState()
        data class Authenticated(val user: User) : AuthState()
        data class Success(val message: String) : AuthState()
        data class Error(val message: String) : AuthState()
    }
    sealed class BookingState { object Idle : BookingState(); object Loading : BookingState(); data class Success(val msg: String) : BookingState(); data class Error(val msg: String) : BookingState() }
    sealed class HistoryState { object Idle : HistoryState(); object Loading : HistoryState(); data class Loaded(val bookings: List<BookingDetails>) : HistoryState(); data class Error(val msg: String) : HistoryState() }
}
