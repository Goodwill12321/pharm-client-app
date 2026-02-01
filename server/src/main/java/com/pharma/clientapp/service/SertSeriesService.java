package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.SertSeries;
import com.pharma.clientapp.entity.SertSeriesId;
import com.pharma.clientapp.repository.SertSeriesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SertSeriesService {
    private final SertSeriesRepository sertSeriesRepository;

    public SertSeriesService(SertSeriesRepository sertSeriesRepository) {
        this.sertSeriesRepository = sertSeriesRepository;
    }

    public List<SertSeries> findAll() {
        return sertSeriesRepository.findAll();
    }

    public Optional<SertSeries> findById(String sertUid, String seriesUid) {
        return sertSeriesRepository.findById(new SertSeriesId(sertUid, seriesUid));
    }

    public SertSeries save(SertSeries sertSeries) {
        return sertSeriesRepository.save(sertSeries);
    }

    @Transactional
    public List<SertSeries> saveAll(List<SertSeries> sertSeriesList) {
        return sertSeriesRepository.saveAll(sertSeriesList);
    }

    public void deleteById(String sertUid, String seriesUid) {
        sertSeriesRepository.deleteById(new SertSeriesId(sertUid, seriesUid));
    }

    @Transactional
    public void softDelete(String sertUid, String seriesUid) {
        sertSeriesRepository.findById(new SertSeriesId(sertUid, seriesUid)).ifPresent(sertSeries -> {
            sertSeries.setIsDel(true);
            sertSeriesRepository.save(sertSeries);
        });
    }
}
