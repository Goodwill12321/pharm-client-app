package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.GoodsType;
import com.pharma.clientapp.service.GoodsTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goodstype")
public class GoodsTypeController {
    private final GoodsTypeService goodsTypeService;

    public GoodsTypeController(GoodsTypeService goodsTypeService) {
        this.goodsTypeService = goodsTypeService;
    }

    @GetMapping
    public List<GoodsType> getAllGoodsType() {
        return goodsTypeService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<GoodsType> getGoodsTypeById(@PathVariable String uid) {
        return goodsTypeService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GoodsType createGoodsType(@RequestBody GoodsType goodsType) {
        return goodsTypeService.save(goodsType);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteGoodsType(@PathVariable String uid) {
        goodsTypeService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
