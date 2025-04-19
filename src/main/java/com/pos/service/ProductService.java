package com.pos.service;

import com.pos.entity.Product;
import com.pos.entity.User;
import java.util.List;

public interface ProductService {
    Product createProduct(Product product);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsByUser(User user);
    List<Product> getProductsByCategory(Long categoryId);
    List<Product> getProductsByUserAndCategory(User user, Long categoryId);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
} 