package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertImageSeries;
import com.pharma.clientapp.entity.SertImageSeriesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SertImageSeriesRepository extends JpaRepository<SertImageSeries, SertImageSeriesId> {
    
    /**
     * Находит все привязки изображений к сериям по UID изображения
     * @param sertImageUid UID изображения
     * @return Список привязок к сериям
     */
    @Query("select sis from SertImageSeries sis where sis.sertImage.uid = :sertImageUid")
    List<SertImageSeries> findBySertImageUid(@Param("sertImageUid") String sertImageUid);
}
