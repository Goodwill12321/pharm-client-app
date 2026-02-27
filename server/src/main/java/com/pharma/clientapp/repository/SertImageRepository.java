package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SertImageRepository extends JpaRepository<SertImage, String> {
    Optional<SertImage> findBySert_Uid(String sertUid);

    List<SertImage> findByUidIn(List<String> uids);
}
