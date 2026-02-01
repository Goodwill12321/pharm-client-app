package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SeriesRepository extends JpaRepository<Series, String> {
    // Поиск серий по части наименования с параметризованным LIMIT (для автодополнения)
    @Query("SELECT s FROM Series s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY s.name LIMIT :limit")
    List<Series> findByNameContainingIgnoreCaseWithLimit(@Param("query") String query, @Param("limit") int limit);
    
    // Поиск UID серий по наименованию 
    @Query("SELECT s.uid FROM Series s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<String> findUidsByNameContainingIgnoreCase(@Param("name") String name);
}
