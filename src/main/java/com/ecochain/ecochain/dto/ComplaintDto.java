package com.ecochain.ecochain.dto;

import com.ecochain.ecochain.entity.Complaint.ComplaintStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintDto {

    private Long id;

    // For create
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private Long pickupRequestId;

    // Response fields
    private ComplaintStatus status;
    private String adminResponse;
    private Long citizenId;
    private String citizenName;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
