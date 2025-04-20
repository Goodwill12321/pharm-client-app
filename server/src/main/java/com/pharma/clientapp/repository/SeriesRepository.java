package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Series;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeriesRepository extends JpaRepository<Series, String> {
}
