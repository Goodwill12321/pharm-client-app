package com.pharma.clientapp.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SertBatchRepositoryImpl {

    private final JdbcTemplate jdbcTemplate;

    public static class SertRow {
        public final String uid;
        public final String sertNo;
        public final String image;
        public final Boolean imageLoaded;
        public final Boolean isDel;
        public final LocalDateTime createTime;
        public final LocalDateTime updateTime;

        public SertRow(String uid, String sertNo, String image, Boolean imageLoaded, Boolean isDel, LocalDateTime createTime, LocalDateTime updateTime) {
            this.uid = uid;
            this.sertNo = sertNo;
            this.image = image;
            this.imageLoaded = imageLoaded;
            this.isDel = isDel;
            this.createTime = createTime;
            this.updateTime = updateTime;
        }
    }

    /**
     * Batch upsert Sert records using sertNo as business key
     * Uses INSERT ... ON CONFLICT with unique constraint on sertno
     */
    public void batchUpsertSerts(List<SertRow> rows) {
        if (rows.isEmpty()) {
            return;
        }

        String sql = """
            INSERT INTO sert (uid, sertno, image, image_loaded, is_del, create_time, update_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (sertno) 
            DO UPDATE SET 
                image = EXCLUDED.image,
                image_loaded = EXCLUDED.image_loaded,
                is_del = EXCLUDED.is_del,
                update_time = EXCLUDED.update_time
            """;

        jdbcTemplate.batchUpdate(sql, rows, rows.size(),
            (ps, row) -> {
                ps.setString(1, row.uid);
                ps.setString(2, row.sertNo);
                ps.setString(3, row.image);
                ps.setObject(4, row.imageLoaded);
                ps.setObject(5, row.isDel);
                ps.setObject(6, row.createTime);
                ps.setObject(7, row.updateTime);
            });
    }

    /**
     * Batch soft delete Sert records by sertNo
     */
    public void batchSoftDeleteSerts(List<String> sertNos) {
        if (sertNos.isEmpty()) {
            return;
        }

        String sql = """
            UPDATE sert 
            SET is_del = true, update_time = CURRENT_TIMESTAMP 
            WHERE sertno = ANY(?)
            """;

        jdbcTemplate.update(sql, sertNos.toArray());
    }
}
