package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SertImageRepository extends JpaRepository<SertImage, String> {
    Optional<SertImage> findBySert_Uid(String sertUid);

    List<SertImage> findByUidIn(List<String> uids);
    
    @Query("SELECT DISTINCT sig.sertImage FROM SertImageGoods sig " +
           "WHERE sig.good.uid IN :productUids")
    List<SertImage> findByProductUids(@Param("productUids") List<String> productUids);
}
