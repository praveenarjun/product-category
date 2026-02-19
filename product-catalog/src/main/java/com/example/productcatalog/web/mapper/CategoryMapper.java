package com.example.productcatalog.web.mapper;

import com.example.productcatalog.domain.Category;
import com.example.productcatalog.web.dto.CategoryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "parentId", source = "parent.id")
    CategoryDTO toDTO(Category category);

    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Category toEntity(CategoryDTO categoryDTO);
}
