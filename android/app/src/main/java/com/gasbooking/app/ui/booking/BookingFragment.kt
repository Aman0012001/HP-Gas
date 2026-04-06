package com.gasbooking.app.ui.booking

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import com.gasbooking.app.databinding.FragmentBookingBinding
import com.gasbooking.app.model.BookingRequest
import com.gasbooking.app.viewmodel.BookingViewModel
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import kotlinx.coroutines.flow.collectLatest

class BookingFragment : Fragment() {

    private var _binding: FragmentBookingBinding? = null
    private val binding get() = _binding!!
    private val viewModel: BookingViewModel by viewModels()
    private var selectedProvider: String = "HP"

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentBookingBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Get provider from arguments
        selectedProvider = arguments?.getString("provider") ?: "HP"
        binding.tvProviderTitle.text = "Booking for $selectedProvider Gas"

        setupObservers()

        binding.btnBook.setOnClickListener {
            if (validateForm()) {
                val request = BookingRequest(
                    name = binding.etName.text.toString(),
                    mobile = binding.etMobile.text.toString(),
                    address = binding.etAddress.text.toString(),
                    consumerNumber = binding.etConsumer.text.toString(),
                    provider = selectedProvider
                )
                viewModel.bookGas(request)
            }
        }
    }

    private fun validateForm(): Boolean {
        var isValid = true
        if (binding.etName.text.isNullOrBlank()) {
            binding.layoutName.error = "Name is required"
            isValid = false
        } else binding.layoutName.error = null

        if (binding.etMobile.text.isNullOrBlank() || binding.etMobile.text!!.length < 10) {
            binding.layoutMobile.error = "Enter a valid 10-digit mobile number"
            isValid = false
        } else binding.layoutMobile.error = null

        if (binding.etAddress.text.isNullOrBlank()) {
            binding.layoutAddress.error = "Address is required"
            isValid = false
        } else binding.layoutAddress.error = null

        if (binding.etConsumer.text.isNullOrBlank()) {
            binding.layoutConsumer.error = "Consumer number is required"
            isValid = false
        } else binding.layoutConsumer.error = null

        return isValid
    }

    private fun setupObservers() {
        lifecycleScope.launchWhenStarted {
            viewModel.bookingState.collectLatest { state ->
                when (state) {
                    is BookingViewModel.BookingState.Loading -> {
                        binding.progressBar.visibility = View.VISIBLE
                        binding.btnBook.isEnabled = false
                    }
                    is BookingViewModel.BookingState.Success -> {
                        binding.progressBar.visibility = View.GONE
                        binding.btnBook.isEnabled = true
                        showSuccessDialog(state.msg)
                    }
                    is BookingViewModel.BookingState.Error -> {
                        binding.progressBar.visibility = View.GONE
                        binding.btnBook.isEnabled = true
                        Toast.makeText(context, state.msg, Toast.LENGTH_LONG).show()
                    }
                    else -> {}
                }
            }
        }
    }

    private fun showSuccessDialog(message: String) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle("Booking Successful")
            .setMessage(message)
            .setPositiveButton("Done") { dialog, _ ->
                dialog.dismiss()
                parentFragmentManager.popBackStack()
            }
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
