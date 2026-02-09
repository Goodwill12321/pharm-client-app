package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.ClameH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClameHRepository extends JpaRepository<ClameH, String> {

    @Query(value = "SELECT COALESCE(MAX(CAST(code AS INTEGER)), 0) FROM clame_h WHERE code ~ '^[0-9]+$'", nativeQuery = true)
    Integer findMaxNumericCode();
}
