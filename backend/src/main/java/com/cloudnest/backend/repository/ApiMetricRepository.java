package com.cloudnest.backend.repository;

import com.cloudnest.backend.entity.ApiMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ApiMetricRepository extends JpaRepository<ApiMetric, UUID> {
}
