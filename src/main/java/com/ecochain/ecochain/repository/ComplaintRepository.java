package com.ecochain.ecochain.repository;

import com.ecochain.ecochain.entity.Complaint;
import com.ecochain.ecochain.entity.Complaint.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByCitizenId(Long citizenId);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findByCitizenIdAndStatus(Long citizenId, ComplaintStatus status);

    long countByStatus(ComplaintStatus status);
}
