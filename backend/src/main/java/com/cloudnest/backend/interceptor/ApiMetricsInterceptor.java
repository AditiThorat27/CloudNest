package com.cloudnest.backend.interceptor;

import com.cloudnest.backend.entity.ApiMetric;
import com.cloudnest.backend.multitenancy.TenantContext;
import com.cloudnest.backend.repository.ApiMetricRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ApiMetricsInterceptor implements HandlerInterceptor {

    private final ApiMetricRepository apiMetricRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute("startTime", System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String tenantIdStr = TenantContext.getCurrentTenant();
        
        // Only track if tenant is known
        if (tenantIdStr != null && !tenantIdStr.equals("PUBLIC")) {
            long startTime = (Long) request.getAttribute("startTime");
            long endTime = System.currentTimeMillis();
            long executeTime = endTime - startTime;

            try {
                ApiMetric metric = ApiMetric.builder()
                        .tenantId(UUID.fromString(tenantIdStr))
                        .endpoint(request.getRequestURI())
                        .method(request.getMethod())
                        .responseTimeMs(executeTime)
                        .statusCode(response.getStatus())
                        .build();
                
                // In a production system, push to an async queue or use a dedicated executor
                apiMetricRepository.save(metric);
            } catch (IllegalArgumentException e) {
                // Ignore invalid UUIDs
            }
        }
    }
}
