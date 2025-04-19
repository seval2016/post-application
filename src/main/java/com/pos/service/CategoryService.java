package com.pos.service;

import com.pos.entity.Category;
import com.pos.entity.User;
import java.util.List;

public interface CategoryService {
    Category createCategory(Category category);
    Category getCategoryById(Long id);
    List<Category> getAllCategories();
    List<Category> getCategoriesByUser(User user);
    Category updateCategory(Long id, Category category);
    void deleteCategory(Long id);
} 