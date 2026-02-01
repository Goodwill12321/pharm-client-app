package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertGoods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class SertGoodsBatchRepositoryImpl {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void batchUpsertSertGoods(List<SertGoods> sertGoods) {
        if (sertGoods.isEmpty()) return;

        String sql = """
            INSERT INTO sert_goods (uid_sert, uid_good, is_del)
            VALUES (?, ?, ?)
            ON CONFLICT (uid_sert, uid_good) 
            DO UPDATE SET 
                is_del = EXCLUDED.is_del
            """;

        // Оптимальный размер пакета для PostgreSQL
        int batchSize = Math.min(sertGoods.size(), 1000);
        
        jdbcTemplate.batchUpdate(sql, sertGoods, batchSize, (ps, sg) -> {
            boolean isDel = sg.getIsDel() != null ? sg.getIsDel() : false;

            ps.setString(1, sg.getSert().getUid());
            ps.setString(2, sg.getGood().getUid());
            ps.setBoolean(3, isDel);
        });
    }
}
