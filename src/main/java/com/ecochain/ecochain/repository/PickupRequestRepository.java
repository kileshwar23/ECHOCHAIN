package com.ecochain.ecochain.repository;

import com.ecochain.ecochain.entity.PickupRequest;
import com.ecochain.ecochain.entity.PickupRequest.RequestStatus;
import com.ecochain.ecochain.entity.PickupRequest.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long> {

    List<PickupRequest> findByCitizenId(Long citizenId);

    List<PickupRequest> findByStatus(RequestStatus status);

    List<PickupRequest> findByCitizenIdAndStatus(Long citizenId, RequestStatus status);

    List<PickupRequest> findByScheduleId(Long scheduleId);

    long countByStatus(RequestStatus status);

    long countByWasteType(WasteType wasteType);
}
