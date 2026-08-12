package com.artgallery.service.impl;

import com.artgallery.dto.ProfileResponse;
import com.artgallery.dto.UpdateProfileRequest;
import com.artgallery.entity.User;
import com.artgallery.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepo;


    // =========================
    // GET PROFILE
    // =========================

    public ProfileResponse getProfile(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return convertToResponse(user);
    }


    // =========================
    // UPDATE PROFILE
    // =========================

    @Transactional
    public ProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        if (request.getName() != null) {

            user.setName(
                    request.getName().trim()
            );

        }

        if (request.getPhone() != null) {

            user.setPhone(
                    request.getPhone().trim()
            );

        }

        if (request.getAddress() != null) {

            user.setAddress(
                    request.getAddress().trim()
            );

        }

        if (request.getCity() != null) {

            user.setCity(
                    request.getCity().trim()
            );

        }

        if (request.getState() != null) {

            user.setState(
                    request.getState().trim()
            );

        }

        if (request.getPincode() != null) {

            user.setPincode(
                    request.getPincode().trim()
            );

        }

        if (request.getCountry() != null) {

            user.setCountry(
                    request.getCountry().trim()
            );

        }


        userRepo.save(user);

        return convertToResponse(user);
    }


    // =========================
    // CONVERT USER → DTO
    // =========================

    private ProfileResponse convertToResponse(
            User user
    ) {

        ProfileResponse response =
                new ProfileResponse();

        response.setId(
                user.getId()
        );

        response.setName(
                user.getName()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setPhone(
                user.getPhone()
        );

        response.setAddress(
                user.getAddress()
        );

        response.setCity(
                user.getCity()
        );

        response.setState(
                user.getState()
        );

        response.setPincode(
                user.getPincode()
        );

        response.setCountry(
                user.getCountry()
        );

        if (user.getRole() != null) {

            response.setRole(
                    user.getRole()
                            .getName()
                            .name()
            );

        }

        return response;
    }
}