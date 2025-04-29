package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Good;
import com.pharma.clientapp.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goods")
public class GoodController {
    @Autowired
    private GoodService goodService;

    @GetMapping
    public List<Good> getAllGoods() {
        return goodService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Good> getGoodsById(@PathVariable String uid) {
        return goodService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Добавляет новый товар или обновляет существующий по uid (upsert).
     * Если uid уже есть в базе — запись обновляется, иначе создается новая.
     */
    @PostMapping
    public Good upsertGood(@RequestBody Good good) {
        return goodService.save(good);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteGoods(@PathVariable String uid) {
        goodService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
