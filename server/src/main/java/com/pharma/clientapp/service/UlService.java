package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Ul;
import com.pharma.clientapp.repository.UlRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UlService {
    private final UlRepository ulRepository;

    public UlService(UlRepository ulRepository) {
        this.ulRepository = ulRepository;
    }

    public List<Ul> findAll() {
        return ulRepository.findAll();
    }

    public Optional<Ul> findById(String uid) {
        return ulRepository.findById(uid);
    }

    public Ul save(Ul ul) {
        return ulRepository.save(ul);
    }

    public void deleteById(String uid) {
        ulRepository.deleteById(uid);
    }
}
