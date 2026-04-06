package com.gasbooking.app.ui.history

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.gasbooking.app.databinding.FragmentHistoryBinding
import com.gasbooking.app.model.BookingDetails
import com.gasbooking.app.viewmodel.BookingViewModel
import kotlinx.coroutines.flow.collectLatest

class HistoryFragment : Fragment() {

    private var _binding: FragmentHistoryBinding? = null
    private val binding get() = _binding!!
    private val viewModel: BookingViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHistoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        binding.rvHistory.layoutManager = LinearLayoutManager(context)
        viewModel.fetchHistory()
        setupObservers()
    }

    private fun setupObservers() {
        lifecycleScope.launchWhenStarted {
            viewModel.historyState.collectLatest { state ->
                when (state) {
                    is BookingViewModel.HistoryState.Loading -> binding.progressBar.visibility = View.VISIBLE
                    is BookingViewModel.HistoryState.Loaded -> {
                        binding.progressBar.visibility = View.GONE
                        binding.rvHistory.adapter = HistoryAdapter(state.bookings)
                    }
                    is BookingViewModel.HistoryState.Error -> {
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(context, state.msg, Toast.LENGTH_SHORT).show()
                    }
                    else -> {}
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    // Simple Adapter for demo
    class HistoryAdapter(private val bookings: List<BookingDetails>) :
        RecyclerView.Adapter<HistoryAdapter.ViewHolder>() {

        class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
            val tvProvider: TextView = view.findViewById(android.R.id.text1)
            val tvDetails: TextView = view.findViewById(android.R.id.text2)
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val view = LayoutInflater.from(parent.context)
                .inflate(android.R.layout.simple_list_item_2, parent, false)
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val booking = bookings[position]
            holder.tvProvider.text = "${booking.provider} Booking #${booking.id}"
            holder.tvDetails.text = "Status: ${booking.status ?: "PENDING"} | Date: ${booking.createdAt}"
        }

        override fun getItemCount() = bookings.size
    }
}
