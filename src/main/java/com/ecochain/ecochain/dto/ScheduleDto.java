package com.ecochain.ecochain.dto;

import com.ecochain.ecochain.entity.Schedule.ScheduleStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ScheduleDto {

    private Long id;

    @NotBlank(message = "Area is required")
    @Size(min = 3, max = 200, message = "Area must be between 3 and 200 characters")
    private String area;

    @NotNull(message = "Collection date is required")
    @FutureOrPresent(message = "Collection date cannot be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate collectionDate;

    @Size(max = 100, message = "Collector name must not exceed 100 characters")
    private String collectorName;

    @Pattern(regexp = "^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}$|^$",
            message = "Vehicle number must follow format: MH-12-AB-1234")
    private String vehicleNumber;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;

    // Response-only
    private ScheduleStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
