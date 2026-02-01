package com.pharma.clientapp.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SertSeriesId implements Serializable {
    private String sertUid;
    private String seriesUid;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SertSeriesId that = (SertSeriesId) o;
        return Objects.equals(sertUid, that.sertUid) && 
               Objects.equals(seriesUid, that.seriesUid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sertUid, seriesUid);
    }
}
