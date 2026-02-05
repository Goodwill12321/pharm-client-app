package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SeriesRepository extends JpaRepository<Series, String> {
    // Поиск серий по части наименования с параметризованным LIMIT (для автодополнения)
    @Query("SELECT s FROM Series s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY s.name LIMIT :limit")
    List<Series> findByNameContainingIgnoreCaseWithLimit(@Param("query") String query, @Param("limit") int limit);
    
    // Поиск серий по части наименования и накладной с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM series s
        JOIN invoice_t it ON it.series_uid = s.uid
        JOIN invoice_h ih ON ih.uid = it.uid
        WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
        AND LOWER(ih.docnum) LIKE LOWER(CONCAT('%', :invoiceNumber, '%'))
        ORDER BY s.name 
        LIMIT :limit
        """, nativeQuery = true)
    List<Series> findByNameContainingIgnoreCaseAndInvoiceWithLimit(@Param("query") String query, @Param("invoiceNumber") String invoiceNumber, @Param("limit") int limit);
    
    // Поиск серий по части наименования и товару с параметризованным LIMIT (через прямую связь)
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM series s
        WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
        AND s.good_uid IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM goods g 
            WHERE g.uid = s.good_uid 
            AND LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%'))
        )
        ORDER BY s.name 
        LIMIT :limit
        """, nativeQuery = true)
    List<Series> findByNameContainingIgnoreCaseAndProductWithLimit(@Param("query") String query, @Param("productName") String productName, @Param("limit") int limit);
    
    // Поиск серий по части наименования, накладной и товару с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM series s
        JOIN invoice_t it ON it.series_uid = s.uid
        JOIN invoice_h ih ON ih.uid = it.uid
        WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
        AND LOWER(ih.docnum) LIKE LOWER(CONCAT('%', :invoiceNumber, '%'))
        AND s.good_uid IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM goods g 
            WHERE g.uid = s.good_uid 
            AND LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%'))
        )
        ORDER BY s.name 
        LIMIT :limit
        """, nativeQuery = true)
    List<Series> findByNameContainingIgnoreCaseAndInvoiceAndProductWithLimit(@Param("query") String query, @Param("invoiceNumber") String invoiceNumber, @Param("productName") String productName, @Param("limit") int limit);
    
    // Поиск UID серий по наименованию 
    @Query("SELECT s.uid FROM Series s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<String> findUidsByNameContainingIgnoreCase(@Param("name") String name);
}
