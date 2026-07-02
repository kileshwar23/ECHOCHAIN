package com.ecochain.ecochain.dto;

import com.ecochain.ecochain.entity.Schedule.ScheduleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ScheduleDto {

    private Long id;

    @NotBlank(message = "Area is required")
    private String area;

    @NotNull(message = "Collection date is required")
    private LocalDate collectionDate;

    private String collectorName;

    private String vehicleNumber;

    private String notes;

    // Response fields
    private ScheduleStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
