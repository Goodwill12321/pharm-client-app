package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertImageSeries;
import com.pharma.clientapp.entity.SertImageSeriesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SertImageSeriesRepository extends JpaRepository<SertImageSeries, SertImageSeriesId> {
}
