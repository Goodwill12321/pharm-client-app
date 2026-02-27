package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.SertImageGoods;
import com.pharma.clientapp.entity.SertImageGoodsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SertImageGoodsRepository extends JpaRepository<SertImageGoods, SertImageGoodsId> {
}
