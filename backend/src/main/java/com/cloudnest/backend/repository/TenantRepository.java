package com.cloudnest.backend.repository;

import com.cloudnest.backend.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findBySubdomain(String subdomain);
}
