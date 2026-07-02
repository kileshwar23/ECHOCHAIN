package com.ecochain.ecochain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_request_id")
    private PickupRequest pickupRequest;

    @NotBlank
    @Column(nullable = false)
    private String subject;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = ComplaintStatus.OPEN;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ComplaintStatus {
        OPEN, UNDER_REVIEW, RESOLVED, CLOSED
    }
}
