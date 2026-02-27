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
public class SertImageGoodsId implements Serializable {
    private String sertImageUid;
    private String goodUid;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SertImageGoodsId that = (SertImageGoodsId) o;
        return Objects.equals(sertImageUid, that.sertImageUid) &&
                Objects.equals(goodUid, that.goodUid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sertImageUid, goodUid);
    }
}
