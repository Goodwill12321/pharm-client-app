package com.pharma.clientapp.repository;

import com.pharma.clientapp.dto.DocUnloadTaskSummaryDto;
import com.pharma.clientapp.dto.DocUnloadTaskViewDto;
import com.pharma.clientapp.dto.DocUnloadTaskViewProjection;
import com.pharma.clientapp.entity.DocUnloadTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DocUnloadTaskRepository extends JpaRepository<DocUnloadTask, String> {

    boolean existsByDocUidAndContactUidAndIsDelFalseAndIsUnloadedFalse(String docUid, String contactUid);

    @Query(value = """
        SELECT dut.*
        FROM doc_unload_tasks dut
        WHERE dut.is_del = false
        AND (CAST(:contactUid AS text) IS NULL OR dut.contact_uid = :contactUid)
        AND (CAST(:docUid AS text) IS NULL OR dut.doc_uid = :docUid)
        AND (CAST(:docNumLower AS text) IS NULL OR LOWER(dut.docnum) LIKE LOWER(CONCAT('%', :docNumLower, '%')))
        AND (CAST(:requestFrom AS timestamp) IS NULL OR dut.request_time >= :requestFrom)
        AND (CAST(:requestTo AS timestamp) IS NULL OR dut.request_time < :requestTo)
        ORDER BY dut.request_time DESC
    """, nativeQuery = true)
    List<DocUnloadTask> findFiltered(
        @Param("contactUid") String contactUid,
        @Param("docUid") String docUid,
        @Param("docNum") String docNum,
        @Param("docNumLower") String docNumLower,
        @Param("requestFrom") LocalDateTime requestFrom,
        @Param("requestTo") LocalDateTime requestTo
    );

    @Query(value = """
        SELECT
            dut.uid AS uid,
            dut.request_time AS requestTime,
            dut.contact_uid AS contactUid,
            COALESCE(c.fio, c.name, c.login, dut.contact_uid) AS contactName,
            dut.doc_type AS docType,
            dut.doc_uid AS docUid,
            dut.docnum AS docnum,
            CAST(dut.docdate AS timestamp) AS docdate,
            dut.is_unloaded AS isUnloaded,
            dut.unload_time AS unloadTime,
            dut.status_update_time AS statusUpdateTime,
            dut.unload_comment AS unloadComment,
            dut.is_del AS isDel
        FROM doc_unload_tasks dut
        LEFT JOIN contact c ON dut.contact_uid = c.uid
        WHERE dut.is_del = false
        AND (CAST(:contactUid AS text) IS NULL OR dut.contact_uid = :contactUid)
        AND (CAST(:docUid AS text) IS NULL OR dut.doc_uid = :docUid)
        AND (CAST(:docNumLower AS text) IS NULL OR LOWER(dut.docnum) LIKE LOWER(CONCAT('%', :docNumLower, '%')))
        AND (CAST(:requestFrom AS timestamp) IS NULL OR dut.request_time >= :requestFrom)
        AND (CAST(:requestTo AS timestamp) IS NULL OR dut.request_time < :requestTo)
        ORDER BY dut.request_time DESC
    """, nativeQuery = true)
    List<DocUnloadTaskViewProjection> findFilteredView(
        @Param("contactUid") String contactUid,
        @Param("docUid") String docUid,
        @Param("docNum") String docNum,
        @Param("docNumLower") String docNumLower,
        @Param("requestFrom") LocalDateTime requestFrom,
        @Param("requestTo") LocalDateTime requestTo
    );

    List<DocUnloadTask> findByDocUidAndIsDelFalseOrderByRequestTimeDesc(String docUid);

    List<DocUnloadTask> findByDocUidAndContactUidAndIsDelFalseOrderByRequestTimeDesc(String docUid, String contactUid);

    @Query("""
        SELECT new com.pharma.clientapp.dto.DocUnloadTaskViewDto(
            t.uid,
            t.requestTime,
            t.contactUid,
            COALESCE(c.fio, c.name, c.login, t.contactUid),
            t.docType,
            t.docUid,
            t.docNum,
            t.docDate,
            t.isUnloaded,
            t.unloadTime,
            t.statusUpdateTime,
            t.unloadComment,
            t.isDel
        )
        FROM DocUnloadTask t
        LEFT JOIN com.pharma.clientapp.entity.Contact c ON t.contactUid = c.uid
        WHERE t.isDel = false
          AND t.docUid = :docUid
          AND t.contactUid = :contactUid
        ORDER BY t.requestTime DESC
    """)
    List<DocUnloadTaskViewDto> findHistoryViewByDocUidForContact(
        @Param("docUid") String docUid,
        @Param("contactUid") String contactUid
    );

    @Query("""
        SELECT t
        FROM DocUnloadTask t
        WHERE t.isDel = false
          AND t.isUnloaded = false
          AND (:requestFrom IS NULL OR t.requestTime >= :requestFrom)
          AND (:requestTo IS NULL OR t.requestTime < :requestTo)
        ORDER BY t.requestTime DESC
    """)
    List<DocUnloadTask> findPendingAllContacts(
        @Param("requestFrom") LocalDateTime requestFrom,
        @Param("requestTo") LocalDateTime requestTo
    );

    @Query("""
        SELECT new com.pharma.clientapp.dto.DocUnloadTaskViewDto(
            t.uid,
            t.requestTime,
            t.contactUid,
            COALESCE(c.fio, c.name, c.login, t.contactUid),
            t.docType,
            t.docUid,
            t.docNum,
            t.docDate,
            t.isUnloaded,
            t.unloadTime,
            t.statusUpdateTime,
            t.unloadComment,
            t.isDel
        )
        FROM DocUnloadTask t
        LEFT JOIN com.pharma.clientapp.entity.Contact c ON t.contactUid = c.uid
        WHERE t.isDel = false
          AND t.isUnloaded = false
          AND (:requestFrom IS NULL OR t.requestTime >= :requestFrom)
          AND (:requestTo IS NULL OR t.requestTime < :requestTo)
        ORDER BY t.requestTime DESC
    """)
    List<DocUnloadTaskViewDto> findPendingAllContactsView(
        @Param("requestFrom") LocalDateTime requestFrom,
        @Param("requestTo") LocalDateTime requestTo
    );

    @Query("""
        SELECT new com.pharma.clientapp.dto.DocUnloadTaskSummaryDto(
            t.docUid,
            COUNT(t),
            SUM(CASE WHEN t.isUnloaded = true THEN 1 ELSE 0 END),
            SUM(CASE WHEN t.isUnloaded = false THEN 1 ELSE 0 END)
        )
        FROM DocUnloadTask t
        WHERE t.isDel = false
          AND t.docUid IN :docUids
          AND (:contactUid IS NULL OR t.contactUid = :contactUid)
        GROUP BY t.docUid
    """)
    List<DocUnloadTaskSummaryDto> getSummaryByDocUids(
        @Param("docUids") List<String> docUids,
        @Param("contactUid") String contactUid
    );

    @Query("""
        SELECT new com.pharma.clientapp.dto.DocUnloadTaskSummaryDto(
            NULL,
            COUNT(t),
            SUM(CASE WHEN t.isUnloaded = true THEN 1 ELSE 0 END),
            SUM(CASE WHEN t.isUnloaded = false THEN 1 ELSE 0 END)
        )
        FROM DocUnloadTask t
        WHERE t.isDel = false
          AND (:contactUid IS NULL OR t.contactUid = :contactUid)
    """)
    List<DocUnloadTaskSummaryDto> getSummaryByContactUid(
        @Param("contactUid") String contactUid
    );
}
