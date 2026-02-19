package com.example.productcatalog.service.impl;

import com.example.productcatalog.domain.Category;
import com.example.productcatalog.domain.Product;
import com.example.productcatalog.exception.ResourceNotFoundException;
import com.example.productcatalog.repository.CategoryRepository;
import com.example.productcatalog.repository.ProductRepository;
import com.example.productcatalog.web.dto.CreateProductRequest;
import com.example.productcatalog.web.dto.ProductDTO;
import com.example.productcatalog.web.mapper.ProductMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private ProductDTO productDTO;
    private CreateProductRequest createProductRequest;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setSku("SKU-123");
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(100.0));
        product.setStatus("ACTIVE");

        productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setSku("SKU-123");
        productDTO.setName("Test Product");
        productDTO.setPrice(BigDecimal.valueOf(100.0));

        createProductRequest = new CreateProductRequest();
        createProductRequest.setSku("SKU-123");
        createProductRequest.setName("Test Product");
        createProductRequest.setPrice(BigDecimal.valueOf(100.0));
    }

    @Test
    void createProduct_Success() {
        when(productRepository.existsBySku(anyString())).thenReturn(false);
        when(productMapper.toEntity(any(CreateProductRequest.class))).thenReturn(product);
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);

        ProductDTO result = productService.createProduct(createProductRequest);

        assertNotNull(result);
        assertEquals("SKU-123", result.getSku());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void getProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        ProductDTO result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(1L));
    }

    @Test
    void deleteProduct_SoftDelete() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        productService.deleteProduct(1L);

        verify(productRepository).save(product);
        assertEquals("ARCHIVED", product.getStatus());
    }

    @Test
    void getAllProducts_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(Collections.singletonList(product));

        when(productRepository.findAll(pageable)).thenReturn(productPage);
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        Page<ProductDTO> result = productService.getAllProducts(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }
}
