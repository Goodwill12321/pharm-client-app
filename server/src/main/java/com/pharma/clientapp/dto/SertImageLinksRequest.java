package com.pharma.clientapp.dto;

import lombok.Data;

import java.util.List;

@Data
public class SertImageLinksRequest {
    private List<String> goodUids;
    private List<String> seriesUids;
}
