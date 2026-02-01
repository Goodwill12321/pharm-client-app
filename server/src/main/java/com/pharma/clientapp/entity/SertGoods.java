package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sert_goods")
public class SertGoods {
    @EmbeddedId
    private SertGoodsId id;

    @MapsId("sertUid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid_sert", nullable = false)
    private Sert sert;

    @MapsId("goodUid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid_good", nullable = false)
    private Good good;

    @Column(name = "create_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel = false;

    // Convenience methods
    public String getSertUid() {
        return id != null ? id.getSertUid() : null;
    }

    public String getGoodUid() {
        return id != null ? id.getGoodUid() : null;
    }

    public void setSertUid(String sertUid) {
        if (id == null) id = new SertGoodsId();
        id.setSertUid(sertUid);
    }

    public void setGoodUid(String goodUid) {
        if (id == null) id = new SertGoodsId();
        id.setGoodUid(goodUid);
    }
}
