package com.ecochain.ecochain.service;

import com.ecochain.ecochain.dto.ChangePasswordRequest;
import com.ecochain.ecochain.dto.UserProfileDto;
import com.ecochain.ecochain.entity.User;
import com.ecochain.ecochain.entity.User.Role;
import com.ecochain.ecochain.exception.BadRequestException;
import com.ecochain.ecochain.exception.DuplicateResourceException;
import com.ecochain.ecochain.exception.ResourceNotFoundException;
import com.ecochain.ecochain.repository.ComplaintRepository;
import com.ecochain.ecochain.repository.PickupRequestRepository;
import com.ecochain.ecochain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;

    // -------------------- CITIZEN & ADMIN: Own Profile --------------------

    public UserProfileDto getMyProfile(String email) {
        User user = findByEmail(email);
        return toDto(user);
    }

    public UserProfileDto updateMyProfile(String email, UserProfileDto dto) {
        User user = findByEmail(email);

        // If email is changing, ensure new email isn't taken
        if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + dto.getEmail());
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        return toDto(userRepository.save(user));
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = findByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // -------------------- ADMIN: User Management --------------------

    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserProfileDto> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserProfileDto getUserById(Long id) {
        return toDto(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }

    public UserProfileDto updateUserRole(Long id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setRole(newRole);
        return toDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", id);
        }
        userRepository.deleteById(id);
    }

    // -------------------- Helpers --------------------

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private UserProfileDto toDto(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setTotalRequests((int) pickupRequestRepository.findByCitizenId(user.getId()).size());
        dto.setTotalComplaints((int) complaintRepository.findByCitizenId(user.getId()).size());
        return dto;
    }
}
