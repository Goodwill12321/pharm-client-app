package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertImageSeries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class SertImageSeriesBatchRepositoryImpl {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void batchUpsertSertImageSeries(List<SertImageSeries> rows) {
        if (rows == null || rows.isEmpty()) return;

        String sql = """
            INSERT INTO sert_image_series (uid_sert_image, uid_series, is_del)
            VALUES (?, ?, ?)
            ON CONFLICT (uid_sert_image, uid_series)
            DO UPDATE SET
                is_del = EXCLUDED.is_del
            """;

        int batchSize = Math.min(rows.size(), 1000);

        jdbcTemplate.batchUpdate(sql, rows, batchSize, (ps, r) -> {
            boolean isDel = r.getIsDel() != null ? r.getIsDel() : false;
            ps.setString(1, r.getSertImage().getUid());
            ps.setString(2, r.getSeries().getUid());
            ps.setBoolean(3, isDel);
        });
    }
}
