package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Debitorka;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DebitorkaRepository extends JpaRepository<Debitorka, Long> {
    List<Debitorka> findByPayDateBefore(LocalDate date);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(*) FROM Debitorka d WHERE d.payDate < :today")
    long countOverdue(LocalDate today);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(d.sumDolg),0) FROM Debitorka d WHERE d.payDate < :today")
    Double sumOverdue(LocalDate today);
}
