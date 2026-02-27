package com.pharma.clientapp.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SertImageSeriesId implements Serializable {
    private String sertImageUid;
    private String seriesUid;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SertImageSeriesId that = (SertImageSeriesId) o;
        return Objects.equals(sertImageUid, that.sertImageUid) &&
                Objects.equals(seriesUid, that.seriesUid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sertImageUid, seriesUid);
    }
}
