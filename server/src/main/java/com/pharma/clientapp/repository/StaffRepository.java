package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, String> {
}
