package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertImageGoods;
import com.pharma.clientapp.entity.SertImageGoodsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SertImageGoodsRepository extends JpaRepository<SertImageGoods, SertImageGoodsId> {
    
    /**
     * Находит все привязки изображений к товарам по UID изображения
     * @param sertImageUid UID изображения
     * @return Список привязок к товарам
     */
    @Query("select sig from SertImageGoods sig where sig.sertImage.uid = :sertImageUid")
    List<SertImageGoods> findBySertImageUid(@Param("sertImageUid") String sertImageUid);
}
