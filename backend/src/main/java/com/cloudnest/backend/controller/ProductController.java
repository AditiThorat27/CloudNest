package com.cloudnest.backend.controller;

import com.cloudnest.backend.entity.Product;
import com.cloudnest.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<Product> createProduct(@org.springframework.web.bind.annotation.RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @org.springframework.web.bind.annotation.PathVariable java.util.UUID id,
            @org.springframework.web.bind.annotation.RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }
}
