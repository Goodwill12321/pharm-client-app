package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Debitorka;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DebitorkaRepository extends JpaRepository<Debitorka, Long> {
    List<Debitorka> findByPayDateBefore(LocalDate date);

}
