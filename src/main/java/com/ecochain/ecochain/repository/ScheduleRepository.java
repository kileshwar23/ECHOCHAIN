package com.ecochain.ecochain.repository;

import com.ecochain.ecochain.entity.Schedule;
import com.ecochain.ecochain.entity.Schedule.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByStatus(ScheduleStatus status);

    List<Schedule> findByCollectionDateBetween(LocalDate from, LocalDate to);

    List<Schedule> findByAreaContainingIgnoreCase(String area);

    long countByStatus(ScheduleStatus status);
}
