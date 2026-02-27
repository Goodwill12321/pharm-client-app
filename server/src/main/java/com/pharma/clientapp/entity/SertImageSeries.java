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
@Table(name = "sert_image_series")
public class SertImageSeries {
    @EmbeddedId
    private SertImageSeriesId id;

    @MapsId("sertImageUid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid_sert_image", nullable = false)
    private SertImage sertImage;

    @MapsId("seriesUid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid_series", nullable = false)
    private Series series;

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

    public String getSeriesUid() {
        return id != null ? id.getSeriesUid() : null;
    }

    public void setSertImageUid(String sertImageUid) {
        if (id == null) id = new SertImageSeriesId();
        id.setSertImageUid(sertImageUid);
    }

    public void setSeriesUid(String seriesUid) {
        if (id == null) id = new SertImageSeriesId();
        id.setSeriesUid(seriesUid);
    }
}
