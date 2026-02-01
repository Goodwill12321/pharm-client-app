package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Good;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GoodRepository extends JpaRepository<Good, String> {
    // Поиск товаров по части наименования с параметризованным LIMIT (для автодополнения)
    @Query("SELECT g FROM Good g WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY g.name LIMIT :limit")
    List<Good> findByNameContainingIgnoreCaseWithLimit(@Param("query") String query, @Param("limit") int limit);
    
    // Поиск UID товаров по наименованию 
    @Query("SELECT g.uid FROM Good g WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<String> findUidsByNameContainingIgnoreCase(@Param("name") String name);
}
