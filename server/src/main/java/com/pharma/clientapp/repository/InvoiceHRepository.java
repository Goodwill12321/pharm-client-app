package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.InvoiceH;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pharma.clientapp.dto.InvoiceHFilteredDto;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceHRepository extends JpaRepository<InvoiceH, String> {
    @Query("""
    SELECT new com.pharma.clientapp.dto.InvoiceHFilteredDto(
        h.uid, h.typeUid, h.docNum, h.docDate, h.ndsSum, h.sumNoNds, h.sumSNds,
        h.clientUid, c.name, h.status, h.comment, h.statusBuh, h.filial, h.createTime, h.updateTime, h.isDel
    )
    FROM InvoiceH h
    LEFT JOIN Client c ON h.clientUid = c.uid
    WHERE (:clientUids IS NULL OR h.clientUid IN :clientUids)
      AND (h.docDate >= :dateFrom AND h.docDate < :dateTo)
    """)
    List<InvoiceHFilteredDto> findFilteredDtoByClientUidsAndDates(
        @Param("clientUids") List<String> clientUids,
        @Param("dateFrom") java.time.LocalDateTime dateFrom,
        @Param("dateTo") java.time.LocalDateTime dateTo
    );

    List<InvoiceH> findByClientUidIn(List<String> clientUids);
}
