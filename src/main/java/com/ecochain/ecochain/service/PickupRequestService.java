package com.ecochain.ecochain.service;

import com.ecochain.ecochain.dto.PickupRequestDto;
import com.ecochain.ecochain.entity.PickupRequest;
import com.ecochain.ecochain.entity.PickupRequest.RequestStatus;
import com.ecochain.ecochain.entity.Schedule;
import com.ecochain.ecochain.entity.User;
import com.ecochain.ecochain.exception.ResourceNotFoundException;
import com.ecochain.ecochain.repository.PickupRequestRepository;
import com.ecochain.ecochain.repository.ScheduleRepository;
import com.ecochain.ecochain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PickupRequestService {

    private final PickupRequestRepository pickupRequestRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    // CITIZEN: Submit a new pickup request
    public PickupRequestDto createRequest(PickupRequestDto dto, String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PickupRequest request = PickupRequest.builder()
                .citizen(citizen)
                .address(dto.getAddress())
                .wasteType(dto.getWasteType())
                .preferredDate(dto.getPreferredDate())
                .notes(dto.getNotes())
                .build();

        return toDto(pickupRequestRepository.save(request));
    }

    // CITIZEN: Get own requests
    public List<PickupRequestDto> getMyRequests(String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return pickupRequestRepository.findByCitizenId(citizen.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // CITIZEN: Cancel own request
    public PickupRequestDto cancelRequest(Long requestId, String citizenEmail) {
        PickupRequest request = getRequestOwnedByCitizen(requestId, citizenEmail);

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING requests can be cancelled");
        }
        request.setStatus(RequestStatus.CANCELLED);
        return toDto(pickupRequestRepository.save(request));
    }

    // ADMIN: Get all requests
    public List<PickupRequestDto> getAllRequests() {
        return pickupRequestRepository.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ADMIN: Get requests by status
    public List<PickupRequestDto> getRequestsByStatus(RequestStatus status) {
        return pickupRequestRepository.findByStatus(status)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ADMIN: Update request status
    public PickupRequestDto updateStatus(Long requestId, RequestStatus newStatus) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("PickupRequest", requestId));

        request.setStatus(newStatus);
        return toDto(pickupRequestRepository.save(request));
    }

    // ADMIN: Assign a schedule to a request
    public PickupRequestDto assignSchedule(Long requestId, Long scheduleId) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("PickupRequest", requestId));

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", scheduleId));

        request.setSchedule(schedule);
        request.setStatus(RequestStatus.SCHEDULED);
        return toDto(pickupRequestRepository.save(request));
    }

    // Helper: ensure citizen owns the request
    private PickupRequest getRequestOwnedByCitizen(Long requestId, String citizenEmail) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("PickupRequest", requestId));

        if (!request.getCitizen().getEmail().equals(citizenEmail)) {
            throw new IllegalArgumentException("You do not own this request");
        }
        return request;
    }

    private PickupRequestDto toDto(PickupRequest r) {
        PickupRequestDto dto = new PickupRequestDto();
        dto.setId(r.getId());
        dto.setAddress(r.getAddress());
        dto.setWasteType(r.getWasteType());
        dto.setPreferredDate(r.getPreferredDate());
        dto.setNotes(r.getNotes());
        dto.setStatus(r.getStatus());
        dto.setCitizenId(r.getCitizen().getId());
        dto.setCitizenName(r.getCitizen().getName());
        dto.setScheduleId(r.getSchedule() != null ? r.getSchedule().getId() : null);
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }
}
