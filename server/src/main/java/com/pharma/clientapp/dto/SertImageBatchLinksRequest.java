package com.pharma.clientapp.dto;

import com.pharma.clientapp.entity.SertImage;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SertImageBatchLinksRequest {

    @NotEmpty(message = "At least one image must be provided")
    @Valid
    private List<SertImage> images;

    @NotNull(message = "Links map cannot be null")
    private Map<@NotEmpty String, @Valid SertImageLinksRequest> links;
}
