package com.ecochain.ecochain.dto;

import com.ecochain.ecochain.entity.User.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserProfileDto {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    // Response-only fields
    private Role role;
    private LocalDateTime createdAt;
    private int totalRequests;
    private int totalComplaints;
}
