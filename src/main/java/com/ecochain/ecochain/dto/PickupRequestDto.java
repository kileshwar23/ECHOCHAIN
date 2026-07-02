package com.ecochain.ecochain.dto;

import com.ecochain.ecochain.entity.PickupRequest.RequestStatus;
import com.ecochain.ecochain.entity.PickupRequest.WasteType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PickupRequestDto {

    private Long id;

    // For create/update requests
    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Waste type is required")
    private WasteType wasteType;

    private LocalDate preferredDate;

    private String notes;

    // Response fields
    private RequestStatus status;
    private Long citizenId;
    private String citizenName;
    private Long scheduleId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
