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
@Table(name = "sert_series")
public class SertSeries {
    @EmbeddedId
    private SertSeriesId id;

    @MapsId("sertUid")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid_sert", nullable = false)
    private Sert sert;

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

    // Convenience methods
    public String getSertUid() {
        return id != null ? id.getSertUid() : null;
    }

    public String getSeriesUid() {
        return id != null ? id.getSeriesUid() : null;
    }

    public void setSertUid(String sertUid) {
        if (id == null) id = new SertSeriesId();
        id.setSertUid(sertUid);
    }

    public void setSeriesUid(String seriesUid) {
        if (id == null) id = new SertSeriesId();
        id.setSeriesUid(seriesUid);
    }
}
