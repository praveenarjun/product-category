package com.example.productcatalog.web.controller;

import com.example.productcatalog.common.ApiResponse;
import com.example.productcatalog.service.ProductService;
import com.example.productcatalog.web.dto.CreateProductRequest;
import com.example.productcatalog.web.dto.ProductDTO;
import com.example.productcatalog.web.dto.UpdateProductRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getAllProducts(@PageableDefault(size = 20) Pageable pageable) {
        Page<ProductDTO> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(ApiResponse.success(products, "Products retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product, "Product retrieved successfully"));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductBySku(@PathVariable String sku) {
        ProductDTO product = productService.getProductBySku(sku);
        return ResponseEntity.ok(ApiResponse.success(product, "Product retrieved successfully"));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> filterProducts(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String search,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long categoryId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String brand,
            @org.springframework.web.bind.annotation.RequestParam(required = false) java.math.BigDecimal minPrice,
            @org.springframework.web.bind.annotation.RequestParam(required = false) java.math.BigDecimal maxPrice,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String status,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Boolean inStock,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Boolean featured,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<ProductDTO> products = productService.searchProducts(search, categoryId, brand, minPrice, maxPrice, status,
                inStock, featured, pageable);
        return ResponseEntity.ok(ApiResponse.success(products, "Filter results retrieved successfully"));

    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getFeaturedProducts(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ProductDTO> products = productService.getFeaturedProducts(pageable);
        return ResponseEntity.ok(ApiResponse.success(products, "Featured products retrieved successfully"));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getLowStockProducts(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ProductDTO> products = productService.getLowStockProducts(pageable);
        return ResponseEntity.ok(ApiResponse.success(products, "Low stock products retrieved successfully"));
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProductStatus(@PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestParam String status) {
        ProductDTO updatedProduct = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updatedProduct, "Product status updated successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDTO createdProduct = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdProduct, "Product created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(@PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        ProductDTO updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedProduct, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }
}
