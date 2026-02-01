package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertGoods;
import com.pharma.clientapp.entity.SertGoodsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SertGoodsRepository extends JpaRepository<SertGoods, SertGoodsId> {
    
    @Query("SELECT sg FROM SertGoods sg WHERE sg.id.sertUid = :sertUid")
    List<SertGoods> findBySertUid(@Param("sertUid") String sertUid);
    
    @Query("DELETE FROM SertGoods sg WHERE sg.id.sertUid = :sertUid")
    void deleteBySertUid(@Param("sertUid") String sertUid);
    
    // Поиск UID сертификатов по UID товаров (для поиска сертификатов)
    @Query("SELECT DISTINCT sg.id.sertUid FROM SertGoods sg WHERE sg.id.goodUid IN :goodUids")
    List<String> findSertUidsByGoodUids(@Param("goodUids") List<String> goodUids);
}
