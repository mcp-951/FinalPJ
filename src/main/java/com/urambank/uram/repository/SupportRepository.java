package com.urambank.uram.repository;

import com.urambank.uram.entities.Support;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportRepository extends JpaRepository<Support, Integer> {
    List<Support> findAllByUserId(Integer userId);
}
