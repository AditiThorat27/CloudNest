package com.cloudnest.backend.service;

import com.cloudnest.backend.dto.AuthResponse;
import com.cloudnest.backend.dto.RegisterRequest;
import com.cloudnest.backend.entity.Role;
import com.cloudnest.backend.entity.Tenant;
import com.cloudnest.backend.entity.User;
import com.cloudnest.backend.multitenancy.TenantContext;
import com.cloudnest.backend.repository.RoleRepository;
import com.cloudnest.backend.repository.TenantRepository;
import com.cloudnest.backend.repository.UserRepository;
import com.cloudnest.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;
    private final org.springframework.context.ApplicationContext applicationContext;

    public AuthResponse login(com.cloudnest.backend.dto.LoginRequest request) {
        if (request.getSubdomain() == null || request.getSubdomain().isEmpty()) {
            throw new RuntimeException("Subdomain is required for login");
        }
        
        Tenant tenant = tenantRepository.findBySubdomain(request.getSubdomain())
                .orElseThrow(() -> new RuntimeException("Tenant not found for subdomain: " + request.getSubdomain()));
                
        TenantContext.setCurrentTenant(tenant.getId().toString());

        try {
            authenticationManager.authenticate(
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            com.cloudnest.backend.security.UserDetailsImpl userDetails = new com.cloudnest.backend.security.UserDetailsImpl(user);
            String jwtToken = jwtUtils.generateToken(userDetails, user.getTenantId().toString());
            return new AuthResponse(jwtToken, "Login successful");
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            TenantContext.clear();
        }
    }

    // Remove @Transactional from the main method to allow multiple transactions
    public AuthResponse registerTenant(RegisterRequest request) {
        AuthService proxy = org.springframework.beans.factory.BeanFactoryUtils.beanOfType(
            applicationContext, AuthService.class
        );

        // 1. Create Tenant (commits immediately)
        Tenant tenant = proxy.createTenant(request);

        // Switch context to new tenant
        TenantContext.setCurrentTenant(tenant.getId().toString());

        // 2. Create User and Role in a new transaction
        User user;
        try {
            user = proxy.createTenantSetup(request);
        } finally {
            TenantContext.clear();
        }

        // Generate Token
        com.cloudnest.backend.security.UserDetailsImpl userDetails = new com.cloudnest.backend.security.UserDetailsImpl(user);
        String jwtToken = jwtUtils.generateToken(userDetails, tenant.getId().toString());

        return new AuthResponse(jwtToken, "Tenant registered successfully");
    }

    @Transactional
    public Tenant createTenant(RegisterRequest request) {
        if (tenantRepository.findBySubdomain(request.getSubdomain()).isPresent()) {
            throw new RuntimeException("Subdomain already exists");
        }
        Tenant tenant = Tenant.builder()
                .name(request.getCompanyName())
                .subdomain(request.getSubdomain())
                .status("ACTIVE")
                .build();
        return tenantRepository.save(tenant);
    }

    @Transactional
    public User createTenantSetup(RegisterRequest request) {
        // 2. Create Default Admin Role
        Role adminRole = Role.builder()
                .name("TENANT_ADMIN")
                .description("Administrator for the tenant")
                .build();
        roleRepository.save(adminRole);

        // 3. Create Admin User
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
        return userRepository.save(user);
    }
}
