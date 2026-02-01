package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.SertGoods;
import com.pharma.clientapp.service.SertGoodsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sert-goods")
public class SertGoodsController {
    private final SertGoodsService sertGoodsService;

    public SertGoodsController(SertGoodsService sertGoodsService) {
        this.sertGoodsService = sertGoodsService;
    }

    @GetMapping
    public List<SertGoods> getAllSertGoods() {
        return sertGoodsService.findAll();
    }

    @GetMapping("/{sertUid}/{goodUid}")
    public ResponseEntity<SertGoods> getSertGoodsById(
            @PathVariable String sertUid, 
            @PathVariable String goodUid) {
        return sertGoodsService.findById(sertUid, goodUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    /**
     * Добавляет новую связь сертификата с товаром (SertGoods) или обновляет существующую по композитному ключу (sertUid, goodUid).
     */
    public SertGoods upsertSertGoods(@RequestBody SertGoods sertGoods) {
        return sertGoodsService.save(sertGoods);
    }

    @PostMapping("/add_batch")
    /**
     * Добавляет или обновляет список связей сертификатов с товарами (batch upsert).
     */
    public List<SertGoods> upsertSertGoodsBatch(@RequestBody List<SertGoods> sertGoodsList) {
        return sertGoodsService.saveAll(sertGoodsList);
    }

    @DeleteMapping("/{sertUid}/{goodUid}")
    public ResponseEntity<Void> deleteSertGoods(
            @PathVariable String sertUid, 
            @PathVariable String goodUid) {
        if (!sertGoodsService.findById(sertUid, goodUid).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        sertGoodsService.deleteById(sertUid, goodUid);
        return ResponseEntity.noContent().build();
    }
}
