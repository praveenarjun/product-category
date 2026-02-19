package com.example.productcatalog.web.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {

    private String name;
    private String description;
    private String shortDescription;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;

    private String status;
    private Integer quantity;
    private Integer lowStockThreshold;
    private String brand;
    private Double weightGrams;
    private Long categoryId;
    private Boolean featured;
    private Set<String> tags;
    private Set<String> images;
}
