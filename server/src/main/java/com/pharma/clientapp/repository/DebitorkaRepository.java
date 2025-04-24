package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Debitorka;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

import com.pharma.clientapp.dto.DebtWithAddressDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DebitorkaRepository extends JpaRepository<Debitorka, Long> {
    List<Debitorka> findByPayDateBefore(LocalDate date);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(*) FROM Debitorka d WHERE d.payDate < :today")
    long countOverdue(LocalDate today);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(d.sumDolg),0) FROM Debitorka d WHERE d.payDate < :today")
    Double sumOverdue(LocalDate today);
    @Query("""
    SELECT new com.pharma.clientapp.dto.DebtWithAddressDto(
        d.id, d.docUid, d.ulUid, d.otsrochkaDay, d.payDate, d.ostatokDay, d.prosrochkaDay,
        d.sumDoc, d.sumPaid, d.sumDolg, c.deliveryAddress
    )
    FROM Debitorka d
    JOIN InvoiceH ih ON ih.uid = d.docUid
    JOIN Client c ON ih.clientUid = c.uid
    JOIN ClientContact cc ON c.uid = cc.clientUid
    WHERE cc.contactUid = :contactUid
      AND (
        :addresses IS NULL OR COALESCE(:addresses, NULL) IS NULL
        OR c.uid IN (:addresses)
      )
    """)
    java.util.List<DebtWithAddressDto> findDebtsForContact(@Param("contactUid") String contactUid, @Param("addresses") java.util.List<String> addresses);

    // Старый метод для обратной совместимости
    @Query("""
    SELECT new com.pharma.clientapp.dto.DebtWithAddressDto(
        d.id, d.docUid, d.ulUid, d.otsrochkaDay, d.payDate, d.ostatokDay, d.prosrochkaDay,
        d.sumDoc, d.sumPaid, d.sumDolg, c.deliveryAddress
    )
    FROM Debitorka d
    JOIN InvoiceH ih ON ih.uid = d.docUid
    JOIN Client c ON ih.clientUid = c.uid
    JOIN ClientContact cc ON c.uid = cc.clientUid
    WHERE cc.contactUid = :contactUid
      AND (:address IS NULL OR c.deliveryAddress = :address)
    """)
    java.util.List<DebtWithAddressDto> findDebtsForContact(@Param("contactUid") String contactUid, @Param("address") String address);
}
