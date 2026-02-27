package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.FilesClame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FilesClameRepository extends JpaRepository<FilesClame, Long> {

    Optional<FilesClame> findByUidClameAndUidFile(String uidClame, String uidFile);

    long countByUidFile(String uidFile);

    @Query(value = "SELECT fc.uid_file FROM files_clame fc WHERE fc.uid_clame = ?1", nativeQuery = true)
    List<String> findFileUidsByClaimUid(String claimUid);

    @Query(value = "SELECT EXISTS(\n" +
            "  SELECT 1\n" +
            "  FROM files_clame fc\n" +
            "  JOIN files f ON f.uid = fc.uid_file\n" +
            "  WHERE fc.uid_clame = ?1 AND f.file_name = ?2\n" +
            ")", nativeQuery = true)
    boolean existsByClaimUidAndFileName(String claimUid, String fileName);
}
