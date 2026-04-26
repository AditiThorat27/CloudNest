package com.cloudnest.backend.controller;

import com.cloudnest.backend.dto.AuthResponse;
import com.cloudnest.backend.dto.RegisterRequest;
import com.cloudnest.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerTenant(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody com.cloudnest.backend.dto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
