package com.ecochain.ecochain.controller;

import com.ecochain.ecochain.dto.ChangePasswordRequest;
import com.ecochain.ecochain.dto.ComplaintDto;
import com.ecochain.ecochain.dto.PickupRequestDto;
import com.ecochain.ecochain.dto.ScheduleDto;
import com.ecochain.ecochain.dto.UserProfileDto;
import com.ecochain.ecochain.entity.Schedule.ScheduleStatus;
import com.ecochain.ecochain.service.ComplaintService;
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
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
public class CitizenController {

    private final PickupRequestService pickupRequestService;
    private final ComplaintService complaintService;
    private final ScheduleService scheduleService;
    private final UserProfileService userProfileService;

    // -------------------- PROFILE --------------------

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

    @PatchMapping("/profile/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        userProfileService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // -------------------- PICKUP REQUESTS --------------------

    @PostMapping("/requests")
    public ResponseEntity<PickupRequestDto> submitRequest(
            @Valid @RequestBody PickupRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pickupRequestService.createRequest(dto, userDetails.getUsername()));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<PickupRequestDto>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pickupRequestService.getMyRequests(userDetails.getUsername()));
    }

    @PatchMapping("/requests/{id}/cancel")
    public ResponseEntity<PickupRequestDto> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pickupRequestService.cancelRequest(id, userDetails.getUsername()));
    }

    // -------------------- COMPLAINTS --------------------

    @PostMapping("/complaints")
    public ResponseEntity<ComplaintDto> fileComplaint(
            @Valid @RequestBody ComplaintDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.fileComplaint(dto, userDetails.getUsername()));
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintDto>> getMyComplaints(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(complaintService.getMyComplaints(userDetails.getUsername()));
    }

    // -------------------- SCHEDULES (read-only) --------------------

    @GetMapping("/schedules")
    public ResponseEntity<List<ScheduleDto>> getSchedules() {
        return ResponseEntity.ok(scheduleService.getByStatus(ScheduleStatus.PLANNED));
    }

    @GetMapping("/schedules/{id}")
    public ResponseEntity<ScheduleDto> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }
}
