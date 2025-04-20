package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Sert;
import com.pharma.clientapp.repository.SertRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SertService {
    private final SertRepository sertRepository;

    public SertService(SertRepository sertRepository) {
        this.sertRepository = sertRepository;
    }

    public List<Sert> findAll() {
        return sertRepository.findAll();
    }

    public Optional<Sert> findById(String uid) {
        return sertRepository.findById(uid);
    }

    public Sert save(Sert sert) {
        return sertRepository.save(sert);
    }

    public void deleteById(String uid) {
        sertRepository.deleteById(uid);
    }
}
