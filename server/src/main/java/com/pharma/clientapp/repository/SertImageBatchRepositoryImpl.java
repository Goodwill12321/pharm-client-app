package com.pharma.clientapp.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SertImageBatchRepositoryImpl {

    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public void batchUpsertSertImages(List<SertImageRow> rows) {
        if (rows == null || rows.isEmpty()) return;

        log.info("Upserting {} SertImage rows", rows.size());

        String sql = """
            INSERT INTO sert_images (uid, uid_sert, image, is_del)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (uid)
            DO UPDATE SET
                uid_sert = EXCLUDED.uid_sert,
                image = EXCLUDED.image,
                is_del = EXCLUDED.is_del
            """;

        int batchSize = Math.min(rows.size(), 1000);

        jdbcTemplate.batchUpdate(sql, rows, batchSize, (ps, r) -> {
            boolean isDel = r.isDel() != null ? r.isDel() : false;
            ps.setString(1, r.uidImage());
            // Allow NULL for uid_sert - images can exist without certificates
            if (r.sertUid() != null) {
                ps.setString(2, r.sertUid());
            } else {
                ps.setObject(2, null);
            }
            ps.setString(3, r.image());
            ps.setBoolean(4, isDel);
        });
        
        log.info("Successfully upserted {} SertImage rows", rows.size());
    }

    @Transactional
    public void batchMarkDeletedByUidImages(List<String> uidImages) {
        if (uidImages == null || uidImages.isEmpty()) return;

        String sql = "UPDATE sert_images SET is_del = true WHERE uid = ?";
        int batchSize = Math.min(uidImages.size(), 1000);

        jdbcTemplate.batchUpdate(sql, uidImages, batchSize, (ps, uid) -> ps.setString(1, uid));
    }

    public record SertImageRow(String uidImage, String sertUid, String image, Boolean isDel) {}
}
