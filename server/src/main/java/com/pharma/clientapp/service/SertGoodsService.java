package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.SertGoods;
import com.pharma.clientapp.entity.SertGoodsId;
import com.pharma.clientapp.repository.SertGoodsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SertGoodsService {
    private final SertGoodsRepository sertGoodsRepository;

    public SertGoodsService(SertGoodsRepository sertGoodsRepository) {
        this.sertGoodsRepository = sertGoodsRepository;
    }

    public List<SertGoods> findAll() {
        return sertGoodsRepository.findAll();
    }

    public Optional<SertGoods> findById(String sertUid, String goodUid) {
        return sertGoodsRepository.findById(new SertGoodsId(sertUid, goodUid));
    }

    public SertGoods save(SertGoods sertGoods) {
        return sertGoodsRepository.save(sertGoods);
    }

    @Transactional
    public List<SertGoods> saveAll(List<SertGoods> sertGoodsList) {
        return sertGoodsRepository.saveAll(sertGoodsList);
    }

    public void deleteById(String sertUid, String goodUid) {
        sertGoodsRepository.deleteById(new SertGoodsId(sertUid, goodUid));
    }

    @Transactional
    public void softDelete(String sertUid, String goodUid) {
        sertGoodsRepository.findById(new SertGoodsId(sertUid, goodUid)).ifPresent(sertGoods -> {
            sertGoods.setIsDel(true);
            sertGoodsRepository.save(sertGoods);
        });
    }
}
