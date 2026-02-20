package com.example.productcatalog.web.mapper;

import com.example.productcatalog.domain.Product;
import com.example.productcatalog.web.dto.CreateProductRequest;
import com.example.productcatalog.web.dto.ProductDTO;
import com.example.productcatalog.web.dto.UpdateProductRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "imageUrls", source = "images")
    @Mapping(target = "inStock", expression = "java(product.getQuantity() != null && product.getQuantity() > 0)")
    @Mapping(target = "lowStock", expression = "java(product.getQuantity() != null && product.getLowStockThreshold() != null && product.getQuantity() <= product.getLowStockThreshold())")
    ProductDTO toDTO(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true) // Handled in service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Product toEntity(CreateProductRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sku", ignore = true) // SKU should not be updated
    @Mapping(target = "category", ignore = true) // Handled in service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateProductFromRequest(UpdateProductRequest request, @MappingTarget Product product);
}
