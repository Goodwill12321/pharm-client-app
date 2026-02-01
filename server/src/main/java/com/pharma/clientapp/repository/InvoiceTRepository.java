package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.InvoiceT;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.pharma.clientapp.dto.InvoiceTWithNamesDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceTRepository extends JpaRepository<InvoiceT, String> {
    void deleteAllByUid(String uid);
    @Query("""
    SELECT new com.pharma.clientapp.dto.InvoiceTWithNamesDto(
        t.uidLine, t.uid, g.uid, g.name, g.mark, s.uid, s.name, s.dateExpBefore, s.dateProduction,
        t.price, t.qnt, t.nds, t.ndsSum, t.sumNoNds, t.sumSNds, t.gtin, t.ean, t.dateSaleProducer, t.priceReestr, t.priceProducer
    )
    FROM InvoiceT t
    LEFT JOIN Good g ON t.goodUid = g.uid
    LEFT JOIN Series s ON t.seriesUid = s.uid
    WHERE t.uid = :uid
    """)
    java.util.List<InvoiceTWithNamesDto> findWithNamesByUid(@Param("uid") String uid);

    List<InvoiceT> findByUid(String uid);
    
    // Поиск UID товаров и серий по UID накладной (для поиска сертификатов)
    @Query("SELECT DISTINCT t.goodUid FROM InvoiceT t WHERE t.uid IN :invoiceUids AND t.goodUid IS NOT NULL")
    List<String> findGoodUidsByInvoiceUids(@Param("invoiceUids") List<String> invoiceUids);
    
    @Query("SELECT DISTINCT t.seriesUid FROM InvoiceT t WHERE t.uid IN :invoiceUids AND t.seriesUid IS NOT NULL")
    List<String> findSeriesUidsByInvoiceUids(@Param("invoiceUids") List<String> invoiceUids);
}
