package com.ecochain.ecochain.service;

import com.ecochain.ecochain.dto.DashboardStatsDto;
import com.ecochain.ecochain.entity.Complaint.ComplaintStatus;
import com.ecochain.ecochain.entity.PickupRequest.RequestStatus;
import com.ecochain.ecochain.entity.PickupRequest.WasteType;
import com.ecochain.ecochain.entity.Schedule.ScheduleStatus;
import com.ecochain.ecochain.entity.User.Role;
import com.ecochain.ecochain.repository.ComplaintRepository;
import com.ecochain.ecochain.repository.PickupRequestRepository;
import com.ecochain.ecochain.repository.ScheduleRepository;
import com.ecochain.ecochain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final ScheduleRepository scheduleRepository;
    private final ComplaintRepository complaintRepository;

    public DashboardStatsDto getStats() {
        // Waste type breakdown for chart
        Map<String, Long> wasteTypeBreakdown = Arrays.stream(WasteType.values())
                .collect(Collectors.toMap(
                        Enum::name,
                        pickupRequestRepository::countByWasteType,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));

        return DashboardStatsDto.builder()
                // Users
                .totalUsers(userRepository.count())
                .totalCitizens(userRepository.countByRole(Role.CITIZEN))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                // Pickup Requests
                .totalRequests(pickupRequestRepository.count())
                .pendingRequests(pickupRequestRepository.countByStatus(RequestStatus.PENDING))
                .approvedRequests(pickupRequestRepository.countByStatus(RequestStatus.APPROVED))
                .scheduledRequests(pickupRequestRepository.countByStatus(RequestStatus.SCHEDULED))
                .collectedRequests(pickupRequestRepository.countByStatus(RequestStatus.COLLECTED))
                .rejectedRequests(pickupRequestRepository.countByStatus(RequestStatus.REJECTED))
                .cancelledRequests(pickupRequestRepository.countByStatus(RequestStatus.CANCELLED))
                // Schedules
                .totalSchedules(scheduleRepository.count())
                .plannedSchedules(scheduleRepository.countByStatus(ScheduleStatus.PLANNED))
                .inProgressSchedules(scheduleRepository.countByStatus(ScheduleStatus.IN_PROGRESS))
                .completedSchedules(scheduleRepository.countByStatus(ScheduleStatus.COMPLETED))
                // Complaints
                .totalComplaints(complaintRepository.count())
                .openComplaints(complaintRepository.countByStatus(ComplaintStatus.OPEN))
                .underReviewComplaints(complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW))
                .resolvedComplaints(complaintRepository.countByStatus(ComplaintStatus.RESOLVED))
                .closedComplaints(complaintRepository.countByStatus(ComplaintStatus.CLOSED))
                // Breakdown
                .requestsByWasteType(wasteTypeBreakdown)
                .build();
    }
}
