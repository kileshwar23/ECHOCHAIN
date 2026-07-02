package com.ecochain.ecochain.service;

import com.ecochain.ecochain.dto.ScheduleDto;
import com.ecochain.ecochain.entity.Schedule;
import com.ecochain.ecochain.entity.Schedule.ScheduleStatus;
import com.ecochain.ecochain.exception.ResourceNotFoundException;
import com.ecochain.ecochain.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    // ADMIN: Create a new schedule
    public ScheduleDto createSchedule(ScheduleDto dto) {
        Schedule schedule = Schedule.builder()
                .area(dto.getArea())
                .collectionDate(dto.getCollectionDate())
                .collectorName(dto.getCollectorName())
                .vehicleNumber(dto.getVehicleNumber())
                .notes(dto.getNotes())
                .build();

        return toDto(scheduleRepository.save(schedule));
    }

    // ADMIN: Update a schedule
    public ScheduleDto updateSchedule(Long id, ScheduleDto dto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id));

        schedule.setArea(dto.getArea());
        schedule.setCollectionDate(dto.getCollectionDate());
        schedule.setCollectorName(dto.getCollectorName());
        schedule.setVehicleNumber(dto.getVehicleNumber());
        schedule.setNotes(dto.getNotes());

        return toDto(scheduleRepository.save(schedule));
    }

    // ADMIN: Update schedule status
    public ScheduleDto updateStatus(Long id, ScheduleStatus status) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id));

        schedule.setStatus(status);
        return toDto(scheduleRepository.save(schedule));
    }

    // ADMIN: Delete a schedule
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule", id);
        }
        scheduleRepository.deleteById(id);
    }

    // ALL AUTHENTICATED: Get all schedules
    public List<ScheduleDto> getAllSchedules() {
        return scheduleRepository.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ALL AUTHENTICATED: Get schedule by ID
    public ScheduleDto getScheduleById(Long id) {
        return toDto(scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id)));
    }

    // ALL AUTHENTICATED: Get schedules by status
    public List<ScheduleDto> getByStatus(ScheduleStatus status) {
        return scheduleRepository.findByStatus(status)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private ScheduleDto toDto(Schedule s) {
        ScheduleDto dto = new ScheduleDto();
        dto.setId(s.getId());
        dto.setArea(s.getArea());
        dto.setCollectionDate(s.getCollectionDate());
        dto.setCollectorName(s.getCollectorName());
        dto.setVehicleNumber(s.getVehicleNumber());
        dto.setNotes(s.getNotes());
        dto.setStatus(s.getStatus());
        dto.setCreatedAt(s.getCreatedAt());
        dto.setUpdatedAt(s.getUpdatedAt());
        return dto;
    }
}
