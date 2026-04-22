package com.plastitrack.repository;

import com.plastitrack.entity.PickupRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PickupRequestRepository extends JpaRepository<PickupRequestEntity, Long> {
    List<PickupRequestEntity> findTop10ByOrderByCreatedAtDesc();
}
