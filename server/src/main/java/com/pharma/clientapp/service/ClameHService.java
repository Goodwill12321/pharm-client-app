package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClameH;
import com.pharma.clientapp.repository.ClameHRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClameHService {
    private final ClameHRepository clameHRepository;

    public ClameHService(ClameHRepository clameHRepository) {
        this.clameHRepository = clameHRepository;
    }

    public List<ClameH> findAll() {
        return clameHRepository.findAll();
    }

    public Optional<ClameH> findById(String uid) {
        return clameHRepository.findById(uid);
    }

    public ClameH save(ClameH clameH) {
        return clameHRepository.save(clameH);
    }

    public void deleteById(String uid) {
        clameHRepository.deleteById(uid);
    }
}
