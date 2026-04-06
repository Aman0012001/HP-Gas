package com.gasbooking.app.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.gasbooking.app.R
import com.gasbooking.app.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.cardHp.setOnClickListener {
            navigateToBooking("HP")
        }

        binding.cardIndian.setOnClickListener {
            navigateToBooking("INDIAN")
        }

        binding.cardBharat.setOnClickListener {
            navigateToBooking("BHARAT")
        }
    }

    private fun navigateToBooking(provider: String) {
        val bundle = bundleOf("provider" to provider)
        findNavController().navigate(R.id.action_homeFragment_to_bookingFragment, bundle)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
