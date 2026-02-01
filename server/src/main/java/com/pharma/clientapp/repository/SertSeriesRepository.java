package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertSeries;
import com.pharma.clientapp.entity.SertSeriesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SertSeriesRepository extends JpaRepository<SertSeries, SertSeriesId> {
    
    @Query("SELECT ss FROM SertSeries ss WHERE ss.id.sertUid = :sertUid")
    List<SertSeries> findBySertUid(@Param("sertUid") String sertUid);
    
    @Query("DELETE FROM SertSeries ss WHERE ss.id.sertUid = :sertUid")
    void deleteBySertUid(@Param("sertUid") String sertUid);
    
    // Поиск UID сертификатов по UID серий (для поиска сертификатов)
    @Query("SELECT DISTINCT ss.id.sertUid FROM SertSeries ss WHERE ss.id.seriesUid IN :seriesUids")
    List<String> findSertUidsBySeriesUids(@Param("seriesUids") List<String> seriesUids);
}
