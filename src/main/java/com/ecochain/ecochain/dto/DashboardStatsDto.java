package com.ecochain.ecochain.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {

    // Users
    private long totalUsers;
    private long totalCitizens;
    private long totalAdmins;

    // Pickup Requests
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long scheduledRequests;
    private long collectedRequests;
    private long rejectedRequests;
    private long cancelledRequests;

    // Schedules
    private long totalSchedules;
    private long plannedSchedules;
    private long inProgressSchedules;
    private long completedSchedules;

    // Complaints
    private long totalComplaints;
    private long openComplaints;
    private long underReviewComplaints;
    private long resolvedComplaints;
    private long closedComplaints;

    // Breakdown maps for charts
    private Map<String, Long> requestsByWasteType;
}
