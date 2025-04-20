package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.GoodsType;
import com.pharma.clientapp.repository.GoodsTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoodsTypeService {
    private final GoodsTypeRepository goodsTypeRepository;

    public GoodsTypeService(GoodsTypeRepository goodsTypeRepository) {
        this.goodsTypeRepository = goodsTypeRepository;
    }

    public List<GoodsType> findAll() {
        return goodsTypeRepository.findAll();
    }

    public Optional<GoodsType> findById(String uid) {
        return goodsTypeRepository.findById(uid);
    }

    public GoodsType save(GoodsType goodsType) {
        return goodsTypeRepository.save(goodsType);
    }

    public void deleteById(String uid) {
        goodsTypeRepository.deleteById(uid);
    }
}
