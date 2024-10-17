package com.urambank.uram.repository;

import com.urambank.uram.entities.PickUpPlaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickUpPlaceRepository extends JpaRepository<PickUpPlaceEntity, Integer> {

    PickUpPlaceEntity findByPickupPlaceName(String branch);
}
