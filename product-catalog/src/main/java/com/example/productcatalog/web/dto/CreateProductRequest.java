package com.example.productcatalog.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateProductRequest {

    @NotBlank(message = "SKU is required")
    @com.example.productcatalog.validation.ValidSKU
    private String sku;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    private String shortDescription;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;

    @NotBlank(message = "Status is required")
    private String status;

    private Integer quantity;
    private Integer lowStockThreshold;

    private String brand;
    private Double weightGrams;

    private Long categoryId;

    private boolean featured;

    private Set<String> tags;
    private Set<String> images;
}
