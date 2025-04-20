package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Series;
import com.pharma.clientapp.repository.SeriesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeriesService {
    private final SeriesRepository seriesRepository;

    public SeriesService(SeriesRepository seriesRepository) {
        this.seriesRepository = seriesRepository;
    }

    public List<Series> findAll() {
        return seriesRepository.findAll();
    }

    public Optional<Series> findById(String uid) {
        return seriesRepository.findById(uid);
    }

    public Series save(Series series) {
        return seriesRepository.save(series);
    }

    public void deleteById(String uid) {
        seriesRepository.deleteById(uid);
    }
}
