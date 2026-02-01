package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertSeries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class SertSeriesBatchRepositoryImpl {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void batchUpsertSertSeries(List<SertSeries> sertSeries) {
        if (sertSeries.isEmpty()) return;

        String sql = """
            INSERT INTO sert_series (uid_sert, uid_series, is_del)
            VALUES (?, ?, ?)
            ON CONFLICT (uid_sert, uid_series) 
            DO UPDATE SET 
                is_del = EXCLUDED.is_del
            """;

        // Оптимальный размер пакета для PostgreSQL
        int batchSize = Math.min(sertSeries.size(), 1000);
        
        jdbcTemplate.batchUpdate(sql, sertSeries, batchSize, (ps, ss) -> {
            boolean isDel = ss.getIsDel() != null ? ss.getIsDel() : false;

            ps.setString(1, ss.getSert().getUid());
            ps.setString(2, ss.getSeries().getUid());
            ps.setBoolean(3, isDel);
        });
    }
}
