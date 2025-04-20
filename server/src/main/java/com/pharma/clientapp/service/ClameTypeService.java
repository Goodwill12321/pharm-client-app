package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClameType;
import com.pharma.clientapp.repository.ClameTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClameTypeService {
    private final ClameTypeRepository clameTypeRepository;

    public ClameTypeService(ClameTypeRepository clameTypeRepository) {
        this.clameTypeRepository = clameTypeRepository;
    }

    public List<ClameType> findAll() {
        return clameTypeRepository.findAll();
    }

    public Optional<ClameType> findById(String uid) {
        return clameTypeRepository.findById(uid);
    }

    public ClameType save(ClameType clameType) {
        return clameTypeRepository.save(clameType);
    }

    public void deleteById(String uid) {
        clameTypeRepository.deleteById(uid);
    }
}
