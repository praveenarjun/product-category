package com.example.productcatalog.web.controller;

import com.example.productcatalog.service.ProductService;
import com.example.productcatalog.web.dto.ProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
// Explicitly activate "test" profile so application-test.yml is loaded.
// This makes spring.cache.type=none take effect inside the WebMvc test slice,
// preventing CacheAutoConfiguration from trying to connect to Redis.
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.flyway.enabled=false",
        "spring.cache.type=none",
        "spring.data.redis.repositories.enabled=false"
})
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    // Satisfy @EnableCaching on the main class inside the WebMvc slice context
    @MockBean
    private CacheManager cacheManager;

    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setSku("SKU-123");
        productDTO.setName("Test Product");
        productDTO.setPrice(BigDecimal.valueOf(100.0));
    }

    @Test
    void getAllProducts_ShouldReturnPage() throws Exception {
        Page<ProductDTO> productPage = new PageImpl<>(Collections.singletonList(productDTO));
        given(productService.getAllProducts(any(Pageable.class))).willReturn(productPage);

        mockMvc.perform(get("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].sku").value("SKU-123"));
    }

    @Test
    void getProductById_ShouldReturnProduct() throws Exception {
        given(productService.getProductById(1L)).willReturn(productDTO);

        mockMvc.perform(get("/api/v1/products/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sku").value("SKU-123"));
    }

    @Test
    void getProductBySku_ShouldReturnProduct() throws Exception {
        given(productService.getProductBySku("SKU-123")).willReturn(productDTO);

        mockMvc.perform(get("/api/v1/products/sku/SKU-123")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sku").value("SKU-123"));
    }
}
