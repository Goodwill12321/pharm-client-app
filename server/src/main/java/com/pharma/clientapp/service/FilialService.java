package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Filial;
import com.pharma.clientapp.repository.FilialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FilialService {
    @Autowired
    private FilialRepository filialRepository;

    public List<Filial> findAll() {
        return filialRepository.findAll();
    }

    public Optional<Filial> findById(String uid) {
        return filialRepository.findById(uid);
    }

    public Filial save(Filial filial) {
        return filialRepository.save(filial);
    }

    public void deleteById(String uid) {
        filialRepository.deleteById(uid);
    }
}
