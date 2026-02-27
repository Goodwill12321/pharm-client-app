package com.pharma.clientapp.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sert_image_goods")
public class SertImageGoods {
    @EmbeddedId
    private SertImageGoodsId id;

    @MapsId("sertImageUid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid_sert_image", nullable = false)
    private SertImage sertImage;

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

    public String getSertImageUid() {
        return id != null ? id.getSertImageUid() : null;
    }

    public String getGoodUid() {
        return id != null ? id.getGoodUid() : null;
    }

    public void setSertImageUid(String sertImageUid) {
        if (id == null) id = new SertImageGoodsId();
        id.setSertImageUid(sertImageUid);
    }

    public void setGoodUid(String goodUid) {
        if (id == null) id = new SertImageGoodsId();
        id.setGoodUid(goodUid);
    }
}
