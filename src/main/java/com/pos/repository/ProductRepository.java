package com.pos.repository;

import com.pos.entity.Product;
import com.pos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUser(User user);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByUserAndCategoryId(User user, Long categoryId);
} 