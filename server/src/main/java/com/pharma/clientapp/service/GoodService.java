package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Good;
import com.pharma.clientapp.repository.GoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoodService {
    @Autowired
    private GoodRepository goodRepository;

    public List<Good> findAll() {
        return goodRepository.findAll();
    }

    public Optional<Good> findById(String uid) {
        return goodRepository.findById(uid);
    }

    public Good save(Good good) {
        return goodRepository.save(good);
    }

    public void deleteById(String uid) {
        goodRepository.deleteById(uid);
    }
}
