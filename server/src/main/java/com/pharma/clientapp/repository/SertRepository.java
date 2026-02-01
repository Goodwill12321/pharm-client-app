package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Sert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SertRepository extends JpaRepository<Sert, String> {
    // Поиск сертификатов по части номера с параметризованным LIMIT (для автодополнения)
    @Query("SELECT s FROM Sert s WHERE LOWER(s.sertNo) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY s.sertNo LIMIT :limit")
    List<Sert> findBySertNoContainingIgnoreCaseWithLimit(@Param("query") String query, @Param("limit") int limit);
    
    // Поиск UID сертификатов по номеру (для поиска сертификатов)
    @Query("SELECT s.uid FROM Sert s WHERE LOWER(s.sertNo) LIKE LOWER(CONCAT('%', :sertNo, '%'))")
    List<String> findUidsBySertNoContainingIgnoreCase(@Param("sertNo") String sertNo);

    interface CertificateSearchRow {
        String getUid();
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
                    s.uid AS \"uid\",
                    s.sertno AS \"certificateNumber\",
                    s.image AS \"imagePath\",
                    'PRODUCT' AS \"linkType\",
                    g.name AS \"productName\",
                    g.uid AS \"productUid\",
                    NULL::varchar AS \"seriesName\",
                    NULL::varchar AS \"seriesUid\"
                FROM sert s
                JOIN sert_goods sg ON sg.uid_sert = s.uid
                JOIN goods g ON g.uid = sg.uid_good
                LEFT JOIN invoice_t it ON it.good_uid = g.uid
                LEFT JOIN invoice_h ih ON ih.uid = it.uid
                WHERE
                    (:invoiceNumber IS NULL OR :invoiceNumber = '' OR LOWER(ih.docnum) LIKE LOWER(CONCAT('%', :invoiceNumber, '%')))
                AND (:productName IS NULL OR :productName = '' OR LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%')))
                AND (:seriesName IS NULL OR :seriesName = '')
                AND (:certificateNumber IS NULL OR :certificateNumber = '' OR LOWER(s.sertno) LIKE LOWER(CONCAT('%', :certificateNumber, '%')))

                UNION ALL

                SELECT DISTINCT
                    s.uid AS \"uid\",
                    s.sertno AS \"certificateNumber\",
                    s.image AS \"imagePath\",
                    'SERIES' AS \"linkType\",
                    g.name AS \"productName\",
                    g.uid AS \"productUid\",
                    series.name AS \"seriesName\",
                    series.uid AS \"seriesUid\"
                FROM sert s
                JOIN sert_series ss ON ss.uid_sert = s.uid
                JOIN series ON series.uid = ss.uid_series
                LEFT JOIN invoice_t it ON it.series_uid = series.uid
                LEFT JOIN goods g ON g.uid = it.good_uid
                LEFT JOIN invoice_h ih ON ih.uid = it.uid
                WHERE
                    (:invoiceNumber IS NULL OR :invoiceNumber = '' OR LOWER(ih.docnum) LIKE LOWER(CONCAT('%', :invoiceNumber, '%')))
                AND (:seriesName IS NULL OR :seriesName = '' OR LOWER(series.name) LIKE LOWER(CONCAT('%', :seriesName, '%')))
                AND (:productName IS NULL OR :productName = '' OR (g.name IS NOT NULL AND LOWER(g.name) LIKE LOWER(CONCAT('%', :productName, '%'))))
                AND (:certificateNumber IS NULL OR :certificateNumber = '' OR LOWER(s.sertno) LIKE LOWER(CONCAT('%', :certificateNumber, '%')))

                UNION ALL

                SELECT DISTINCT
                    s.uid AS \"uid\",
                    s.sertno AS \"certificateNumber\",
                    s.image AS \"imagePath\",
                    'NONE' AS \"linkType\",
                    NULL::varchar AS \"productName\",
                    NULL::varchar AS \"productUid\",
                    NULL::varchar AS \"seriesName\",
                    NULL::varchar AS \"seriesUid\"
                FROM sert s
                LEFT JOIN sert_goods sg ON sg.uid_sert = s.uid
                LEFT JOIN sert_series ss ON ss.uid_sert = s.uid
                WHERE
                    sg.uid_sert IS NULL
                AND ss.uid_sert IS NULL
                AND (:certificateNumber IS NOT NULL AND :certificateNumber != '' AND LOWER(s.sertno) LIKE LOWER(CONCAT('%', :certificateNumber, '%')))
                AND (:invoiceNumber IS NULL OR :invoiceNumber = '')
                AND (:productName IS NULL OR :productName = '')
                AND (:seriesName IS NULL OR :seriesName = '')
            ) q
            ORDER BY q.\"productName\" ASC NULLS LAST
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
