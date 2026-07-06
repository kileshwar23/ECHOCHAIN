package com.ecochain.ecochain.dto;

import com.ecochain.ecochain.entity.PickupRequest.RequestStatus;
import com.ecochain.ecochain.entity.PickupRequest.WasteType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PickupRequestDto {

    private Long id;

    @NotBlank(message = "Pickup address is required")
    @Size(min = 10, max = 255, message = "Address must be between 10 and 255 characters")
    private String address;

    @NotNull(message = "Waste type is required. Valid values: GENERAL, RECYCLABLE, HAZARDOUS, ORGANIC, ELECTRONIC")
    private WasteType wasteType;

    @Future(message = "Preferred date must be a future date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate preferredDate;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;

    // Response-only fields
    private RequestStatus status;
    private Long citizenId;
    private String citizenName;
    private Long scheduleId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
