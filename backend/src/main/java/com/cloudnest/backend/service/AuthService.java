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

    @Transactional
    public AuthResponse registerTenant(RegisterRequest request) {
        if (tenantRepository.findBySubdomain(request.getSubdomain()).isPresent()) {
            throw new RuntimeException("Subdomain already exists");
        }

        // 1. Create Tenant
        Tenant tenant = Tenant.builder()
                .name(request.getCompanyName())
                .subdomain(request.getSubdomain())
                .status("ACTIVE")
                .build();
        tenant = tenantRepository.save(tenant);

        // Switch context to new tenant
        TenantContext.setCurrentTenant(tenant.getId().toString());

        // 2. Create Default Admin Role
        Role adminRole = Role.builder()
                .name("TENANT_ADMIN")
                .description("Administrator for the tenant")
                .tenantId(tenant.getId())
                .build();
        roleRepository.save(adminRole);

        // 3. Create Admin User
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .tenantId(tenant.getId())
                .build();
        userRepository.save(user);

        // Generate Token
        com.cloudnest.backend.security.UserDetailsImpl userDetails = new com.cloudnest.backend.security.UserDetailsImpl(user);
        String jwtToken = jwtUtils.generateToken(userDetails, tenant.getId().toString());

        TenantContext.clear();

        return new AuthResponse(jwtToken, "Tenant registered successfully");
    }
}
