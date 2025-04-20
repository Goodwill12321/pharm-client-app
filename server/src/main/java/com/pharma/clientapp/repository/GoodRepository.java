package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Good;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodRepository extends JpaRepository<Good, String> {
}
