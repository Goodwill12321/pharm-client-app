package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClameT;
import com.pharma.clientapp.repository.ClameTRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClameTService {
    private final ClameTRepository clameTRepository;

    public ClameTService(ClameTRepository clameTRepository) {
        this.clameTRepository = clameTRepository;
    }

    public List<ClameT> findAll() {
        return clameTRepository.findAll();
    }

    public Optional<ClameT> findById(String uidLine) {
        return clameTRepository.findById(uidLine);
    }

    public ClameT save(ClameT clameT) {
        return clameTRepository.save(clameT);
    }

    public void deleteById(String uidLine) {
        clameTRepository.deleteById(uidLine);
    }
}
