package com.ecochain.ecochain.service;

import com.ecochain.ecochain.dto.ComplaintDto;
import com.ecochain.ecochain.entity.Complaint;
import com.ecochain.ecochain.entity.Complaint.ComplaintStatus;
import com.ecochain.ecochain.entity.PickupRequest;
import com.ecochain.ecochain.entity.User;
import com.ecochain.ecochain.exception.ResourceNotFoundException;
import com.ecochain.ecochain.repository.ComplaintRepository;
import com.ecochain.ecochain.repository.PickupRequestRepository;
import com.ecochain.ecochain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final PickupRequestRepository pickupRequestRepository;

    // CITIZEN: File a new complaint
    public ComplaintDto fileComplaint(ComplaintDto dto, String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PickupRequest pickupRequest = null;
        if (dto.getPickupRequestId() != null) {
            pickupRequest = pickupRequestRepository.findById(dto.getPickupRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException("PickupRequest", dto.getPickupRequestId()));
        }

        Complaint complaint = Complaint.builder()
                .citizen(citizen)
                .pickupRequest(pickupRequest)
                .subject(dto.getSubject())
                .description(dto.getDescription())
                .build();

        return toDto(complaintRepository.save(complaint));
    }

    // CITIZEN: Get own complaints
    public List<ComplaintDto> getMyComplaints(String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return complaintRepository.findByCitizenId(citizen.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ADMIN: Get all complaints
    public List<ComplaintDto> getAllComplaints() {
        return complaintRepository.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ADMIN: Get complaints by status
    public List<ComplaintDto> getByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ADMIN: Respond to and resolve a complaint
    public ComplaintDto resolveComplaint(Long complaintId, String adminResponse, ComplaintStatus newStatus) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", complaintId));

        complaint.setAdminResponse(adminResponse);
        complaint.setStatus(newStatus);

        if (newStatus == ComplaintStatus.RESOLVED || newStatus == ComplaintStatus.CLOSED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        return toDto(complaintRepository.save(complaint));
    }

    private ComplaintDto toDto(Complaint c) {
        ComplaintDto dto = new ComplaintDto();
        dto.setId(c.getId());
        dto.setSubject(c.getSubject());
        dto.setDescription(c.getDescription());
        dto.setPickupRequestId(c.getPickupRequest() != null ? c.getPickupRequest().getId() : null);
        dto.setStatus(c.getStatus());
        dto.setAdminResponse(c.getAdminResponse());
        dto.setCitizenId(c.getCitizen().getId());
        dto.setCitizenName(c.getCitizen().getName());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        return dto;
    }
}
