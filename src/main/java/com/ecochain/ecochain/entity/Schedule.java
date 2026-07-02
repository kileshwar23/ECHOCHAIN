package com.ecochain.ecochain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String area;

    @Column(name = "collection_date", nullable = false)
    private LocalDate collectionDate;

    @Column(name = "collector_name")
    private String collectorName;

    @Column(name = "vehicle_number")
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "schedule", fetch = FetchType.LAZY)
    private List<PickupRequest> pickupRequests;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = ScheduleStatus.PLANNED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ScheduleStatus {
        PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
