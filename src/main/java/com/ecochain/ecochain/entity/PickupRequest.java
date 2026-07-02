package com.ecochain.ecochain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickup_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PickupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_type", nullable = false)
    private WasteType wasteType;

    @Column(name = "preferred_date")
    private LocalDate preferredDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = RequestStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum WasteType {
        GENERAL, RECYCLABLE, HAZARDOUS, ORGANIC, ELECTRONIC
    }

    public enum RequestStatus {
        PENDING, APPROVED, SCHEDULED, COLLECTED, REJECTED, CANCELLED
    }
}
