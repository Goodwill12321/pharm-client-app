package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Sert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface SertRepository extends JpaRepository<Sert, String> {
    Optional<Sert> findFirstBySertNoIgnoreCase(String sertNo);

    List<Sert> findBySertNoIn(List<String> sertNos);

    // Поиск сертификатов по части номера с параметризованным LIMIT (для автодополнения)
    @Query("SELECT s FROM Sert s WHERE LOWER(s.sertNo) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY s.sertNo LIMIT :limit")
    List<Sert> findBySertNoContainingIgnoreCaseWithLimit(@Param("query") String query, @Param("limit") int limit);
    
    // Поиск сертификатов по части номера и накладной с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM sert s
        JOIN sert_image_goods sg ON sg.uid_sert_image = s.uid
        JOIN invoice_t it ON it.good_uid = sg.uid_good
        JOIN invoice_h ih ON ih.uid = it.uid
        WHERE LOWER(s.sertno) LIKE LOWER(CONCAT('%', :query, '%'))
        AND LOWER(ih.docnum) = LOWER(:invoiceNumber)
        ORDER BY s.sertno 
        LIMIT :limit
        """, nativeQuery = true)
    List<Sert> findBySertNoContainingIgnoreCaseAndInvoiceWithLimit(@Param("query") String query, @Param("invoiceNumber") String invoiceNumber, @Param("limit") int limit);
    
    // Поиск сертификатов по части номера и товару с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM sert s
        JOIN sert_image_goods sg ON sg.uid_sert_image = s.uid
        JOIN goods g ON g.uid = sg.uid_good
        WHERE LOWER(s.sertno) LIKE LOWER(CONCAT('%', :query, '%'))
        AND LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%'))
        ORDER BY s.sertno 
        LIMIT :limit
        """, nativeQuery = true)
    List<Sert> findBySertNoContainingIgnoreCaseAndProductWithLimit(@Param("query") String query, @Param("productName") String productName, @Param("limit") int limit);
    
    // Поиск сертификатов по части номера и серии с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM sert s
        JOIN sert_image_series ss ON ss.uid_sert_image = s.uid
        JOIN series series ON series.uid = ss.uid_series
        LEFT JOIN goods g ON g.uid = series.good_uid
        WHERE LOWER(s.sertno) LIKE LOWER(CONCAT('%', :query, '%'))
        AND LOWER(series.name) LIKE LOWER(CONCAT('%', :seriesName, '%'))
        ORDER BY s.sertno 
        LIMIT :limit
        """, nativeQuery = true)
    List<Sert> findBySertNoContainingIgnoreCaseAndSeriesWithLimit(@Param("query") String query, @Param("seriesName") String seriesName, @Param("limit") int limit);
    
    // Поиск сертификатов по части номера, накладной и товару с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM sert s
        JOIN sert_image_goods sg ON sg.uid_sert_image = s.uid
        JOIN goods g ON g.uid = sg.uid_good
        JOIN invoice_t it ON it.good_uid = g.uid
        JOIN invoice_h ih ON ih.uid = it.uid
        WHERE LOWER(s.sertno) LIKE LOWER(CONCAT('%', :query, '%'))
        AND LOWER(ih.docnum) = LOWER(:invoiceNumber)
        AND LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%'))
        ORDER BY s.sertno 
        LIMIT :limit
        """, nativeQuery = true)
    List<Sert> findBySertNoContainingIgnoreCaseAndInvoiceAndProductWithLimit(@Param("query") String query, @Param("invoiceNumber") String invoiceNumber, @Param("productName") String productName, @Param("limit") int limit);
    
    // Поиск сертификатов по части номера, накладной и серии с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM sert s
        JOIN sert_image_series ss ON ss.uid_sert_image = s.uid
        JOIN series series ON series.uid = ss.uid_series
        LEFT JOIN goods g ON g.uid = series.good_uid
        JOIN invoice_t it ON it.series_uid = series.uid
        JOIN invoice_h ih ON ih.uid = it.uid
        WHERE LOWER(s.sertno) LIKE LOWER(CONCAT('%', :query, '%'))
        AND LOWER(ih.docnum) = LOWER(:invoiceNumber)
        AND LOWER(series.name) LIKE LOWER(CONCAT('%', :seriesName, '%'))
        ORDER BY s.sertno 
        LIMIT :limit
        """, nativeQuery = true)
    List<Sert> findBySertNoContainingIgnoreCaseAndInvoiceAndSeriesWithLimit(@Param("query") String query, @Param("invoiceNumber") String invoiceNumber, @Param("seriesName") String seriesName, @Param("limit") int limit);
    
    // Поиск сертификатов по части номера, товару и серии с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM sert s
        JOIN sert_image_goods sg ON sg.uid_sert_image = s.uid
        JOIN goods g ON g.uid = sg.uid_good
        JOIN sert_image_series ss ON ss.uid_sert_image = s.uid
        JOIN series series ON series.uid = ss.uid_series
        LEFT JOIN goods g2 ON g2.uid = series.good_uid
        WHERE LOWER(s.sertno) LIKE LOWER(CONCAT('%', :query, '%'))
        AND (
            LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%'))
            OR (series.good_uid IS NOT NULL AND EXISTS (
                SELECT 1 FROM goods g2 
                WHERE g2.uid = series.good_uid 
                AND LOWER(g2.name) LIKE LOWER(CONCAT('%', :productName, '%'))
            ))
        )
        AND LOWER(series.name) LIKE LOWER(CONCAT('%', :seriesName, '%'))
        ORDER BY s.sertno 
        LIMIT :limit
        """, nativeQuery = true)
    List<Sert> findBySertNoContainingIgnoreCaseAndProductAndSeriesWithLimit(@Param("query") String query, @Param("productName") String productName, @Param("seriesName") String seriesName, @Param("limit") int limit);
    
    // Поиск сертификатов по части номера, накладной, товару и серии с параметризованным LIMIT
    @Query(value = """
        SELECT DISTINCT s.* 
        FROM sert s
        LEFT JOIN sert_image_goods sg ON sg.uid_sert_image = s.uid
        LEFT JOIN sert_image_series ss ON ss.uid_sert_image = s.uid
        LEFT JOIN goods g ON g.uid = sg.uid_good
        LEFT JOIN series series ON series.uid = ss.uid_series
        LEFT JOIN invoice_t it_goods ON it_goods.good_uid = g.uid
        LEFT JOIN invoice_t it_series ON it_series.series_uid = series.uid
        LEFT JOIN invoice_h ih ON (ih.uid = it_goods.uid OR ih.uid = it_series.uid)
        WHERE LOWER(s.sertno) LIKE LOWER(CONCAT('%', :query, '%'))
        AND (:invoiceNumber IS NULL OR :invoiceNumber = '' OR LOWER(ih.docnum) = LOWER(:invoiceNumber))
        AND (:productName IS NULL OR :productName = '' OR LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%')))
        AND (:seriesName IS NULL OR :seriesName = '' OR LOWER(series.name) LIKE LOWER(CONCAT('%', :seriesName, '%')))
        ORDER BY s.sertno 
        LIMIT :limit
        """, nativeQuery = true)
    List<Sert> findBySertNoContainingIgnoreCaseAndInvoiceAndProductAndSeriesWithLimit(@Param("query") String query, @Param("invoiceNumber") String invoiceNumber, @Param("productName") String productName, @Param("seriesName") String seriesName, @Param("limit") int limit);
    
    // Поиск UID изображений по номеру сертификата (для поиска сертификатов)
    @Query("SELECT s.uid FROM Sert s WHERE LOWER(s.sertNo) LIKE LOWER(CONCAT('%', :sertNo, '%'))")
    List<String> findUidsBySertNoContainingIgnoreCase(@Param("sertNo") String sertNo);

    interface CertificateSearchRow {
        String getUidImage();
        String getSertUid();
        String getCertificateNumber();
        String getImagePath();
        String getLinkType();
        String getProductName();
        String getProductUid();
        String getSeriesName();
        String getSeriesUid();
    }

    @Query(
        value = """
            SELECT *
            FROM (
                SELECT DISTINCT
                    si.uid AS "uidImage",
                    s.uid AS "sertUid",
                    s.sertno AS "certificateNumber",
                    si.image AS "imagePath",
                    'PRODUCT' AS "linkType",
                    g.name AS "productName",
                    g.uid AS "productUid",
                    NULL::varchar AS "seriesName",
                    NULL::varchar AS "seriesUid"
                FROM sert_images si
                LEFT JOIN sert s ON s.uid = si.uid_sert
                JOIN sert_image_goods sg ON sg.uid_sert_image = si.uid
                JOIN goods g ON g.uid = sg.uid_good
                LEFT JOIN invoice_t it ON it.good_uid = g.uid
                LEFT JOIN invoice_h ih ON ih.uid = it.uid
                WHERE
                    (:invoiceNumber IS NULL OR :invoiceNumber = '' OR LOWER(ih.docnum) = LOWER(:invoiceNumber))
                AND (:productName IS NULL OR :productName = '' OR LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%')))
                AND (:seriesName IS NULL OR :seriesName = '')
                AND (:certificateNumber IS NULL OR :certificateNumber = '' OR (s.sertno IS NOT NULL AND LOWER(s.sertno) LIKE LOWER(CONCAT('%', :certificateNumber, '%'))))
                AND (si.is_del = FALSE OR si.is_del IS NULL)

                UNION ALL

                SELECT DISTINCT
                    si.uid AS "uidImage",
                    s.uid AS "sertUid",
                    s.sertno AS "certificateNumber",
                    si.image AS "imagePath",
                    'SERIES' AS "linkType",
                    g.name AS "productName",
                    g.uid AS "productUid",
                    series.name AS "seriesName",
                    series.uid AS "seriesUid"
                FROM sert_images si
                LEFT JOIN sert s ON s.uid = si.uid_sert
                JOIN sert_image_series ss ON ss.uid_sert_image = si.uid
                JOIN series ON series.uid = ss.uid_series
                LEFT JOIN goods g ON g.uid = series.good_uid
                LEFT JOIN invoice_t it ON it.series_uid = series.uid
                LEFT JOIN invoice_h ih ON ih.uid = it.uid
                WHERE
                    (:invoiceNumber IS NULL OR :invoiceNumber = '' OR LOWER(ih.docnum) = LOWER(:invoiceNumber))
                AND (:seriesName IS NULL OR :seriesName = '' OR LOWER(series.name) LIKE LOWER(CONCAT('%', :seriesName, '%')))
                AND (:productName IS NULL OR :productName = '' OR (g.name IS NOT NULL AND LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%'))))
                AND (:certificateNumber IS NULL OR :certificateNumber = '' OR (s.sertno IS NOT NULL AND LOWER(s.sertno) LIKE LOWER(CONCAT('%', :certificateNumber, '%'))))
                AND (si.is_del = FALSE OR si.is_del IS NULL)
            ) q
            ORDER BY q."productName" ASC NULLS LAST
            ,q."linkType" asc nulls last
            """,
        nativeQuery = true
    )
    List<CertificateSearchRow> findCertificateInfoDtoWithDynamicFilters(
        @Param("invoiceNumber") String invoiceNumber,
        @Param("productName") String productName,
        @Param("seriesName") String seriesName,
        @Param("certificateNumber") String certificateNumber
    );
}
