package com.ecochain.ecochain.controller;

import com.ecochain.ecochain.dto.ComplaintDto;
import com.ecochain.ecochain.dto.DashboardStatsDto;
import com.ecochain.ecochain.dto.PickupRequestDto;
import com.ecochain.ecochain.dto.ScheduleDto;
import com.ecochain.ecochain.dto.UserProfileDto;
import com.ecochain.ecochain.entity.Complaint.ComplaintStatus;
import com.ecochain.ecochain.entity.PickupRequest.RequestStatus;
import com.ecochain.ecochain.entity.Schedule.ScheduleStatus;
import com.ecochain.ecochain.entity.User.Role;
import com.ecochain.ecochain.service.ComplaintService;
import com.ecochain.ecochain.service.DashboardService;
import com.ecochain.ecochain.service.PickupRequestService;
import com.ecochain.ecochain.service.ScheduleService;
import com.ecochain.ecochain.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PickupRequestService pickupRequestService;
    private final ScheduleService scheduleService;
    private final ComplaintService complaintService;
    private final DashboardService dashboardService;
    private final UserProfileService userProfileService;

    // -------------------- DASHBOARD --------------------

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboard() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    // -------------------- PROFILE (admin can also view/update own profile) --------------------

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userProfileService.getMyProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @Valid @RequestBody UserProfileDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userProfileService.updateMyProfile(userDetails.getUsername(), dto));
    }

    // -------------------- USER MANAGEMENT --------------------

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getAllUsers(
            @RequestParam(required = false) Role role) {
        if (role != null) {
            return ResponseEntity.ok(userProfileService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userProfileService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userProfileService.getUserById(id));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserProfileDto> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role) {
        return ResponseEntity.ok(userProfileService.updateUserRole(id, role));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userProfileService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // -------------------- PICKUP REQUESTS --------------------

    @GetMapping("/requests")
    public ResponseEntity<List<PickupRequestDto>> getAllRequests(
            @RequestParam(required = false) RequestStatus status) {
        if (status != null) {
            return ResponseEntity.ok(pickupRequestService.getRequestsByStatus(status));
        }
        return ResponseEntity.ok(pickupRequestService.getAllRequests());
    }

    @PatchMapping("/requests/{id}/status")
    public ResponseEntity<PickupRequestDto> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status) {
        return ResponseEntity.ok(pickupRequestService.updateStatus(id, status));
    }

    @PatchMapping("/requests/{id}/assign-schedule/{scheduleId}")
    public ResponseEntity<PickupRequestDto> assignSchedule(
            @PathVariable Long id,
            @PathVariable Long scheduleId) {
        return ResponseEntity.ok(pickupRequestService.assignSchedule(id, scheduleId));
    }

    // -------------------- SCHEDULES --------------------

    @PostMapping("/schedules")
    public ResponseEntity<ScheduleDto> createSchedule(@Valid @RequestBody ScheduleDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleService.createSchedule(dto));
    }

    @GetMapping("/schedules")
    public ResponseEntity<List<ScheduleDto>> getAllSchedules(
            @RequestParam(required = false) ScheduleStatus status) {
        if (status != null) {
            return ResponseEntity.ok(scheduleService.getByStatus(status));
        }
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/schedules/{id}")
    public ResponseEntity<ScheduleDto> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }

    @PutMapping("/schedules/{id}")
    public ResponseEntity<ScheduleDto> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleDto dto) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, dto));
    }

    @PatchMapping("/schedules/{id}/status")
    public ResponseEntity<ScheduleDto> updateScheduleStatus(
            @PathVariable Long id,
            @RequestParam ScheduleStatus status) {
        return ResponseEntity.ok(scheduleService.updateStatus(id, status));
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Map<String, String>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(Map.of("message", "Schedule deleted successfully"));
    }

    // -------------------- COMPLAINTS --------------------

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintDto>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status) {
        if (status != null) {
            return ResponseEntity.ok(complaintService.getByStatus(status));
        }
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PatchMapping("/complaints/{id}/resolve")
    public ResponseEntity<ComplaintDto> resolveComplaint(
            @PathVariable Long id,
            @RequestParam String response,
            @RequestParam ComplaintStatus status) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id, response, status));
    }
}
