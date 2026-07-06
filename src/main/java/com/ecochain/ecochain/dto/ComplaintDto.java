package com.ecochain.ecochain.dto;

import com.ecochain.ecochain.entity.Complaint.ComplaintStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintDto {

    private Long id;

    @NotBlank(message = "Subject is required")
    @Size(min = 5, max = 150, message = "Subject must be between 5 and 150 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 1000, message = "Description must be between 20 and 1000 characters")
    private String description;

    @Positive(message = "Pickup request ID must be a positive number")
    private Long pickupRequestId;

    // Response-only fields
    private ComplaintStatus status;
    private String adminResponse;
    private Long citizenId;
    private String citizenName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime resolvedAt;
}
