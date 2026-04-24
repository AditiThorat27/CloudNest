# CloudNest Walkthrough

I have successfully built the complete production-ready full-stack application named **CloudNest**, overcoming the disk space challenges by migrating our workspace to your `D:` drive.

## What Was Built (`D:\CloudNest`)

1. **Multi-Tenant Architecture**: Implemented a shared-database, shared-schema setup using PostgreSQL. Configured Hibernate 6's `@TenantId` partitioning combined with Row-Level Security via Flyway migrations (`V1__init.sql`).
2. **Spring Boot Backend**: 
   - `AuthService` handles tenant provisioning, creating workspaces and `TENANT_ADMIN` roles dynamically on registration.
   - `TenantFilter` and `JwtAuthFilter` extract context from incoming requests to ensure absolute data isolation.
   - E-commerce entities (`Product`, `Order`, `Category`, `Customer`) are fully tenant-aware.
   - `ApiMetricsInterceptor` logs API usage directly into the database per-tenant to satisfy the Workspace Analytics requirement.
3. **React & Tailwind Frontend**:
   - Designed an ultra-premium, dynamic SaaS dashboard (`Dashboard.tsx`, `Sidebar.tsx`) using dark mode aesthetics, glassmorphism (`backdrop-blur-xl`), gradient charts, and smooth micro-animations.
4. **Containerization**:
   - `backend/Dockerfile` and `frontend/Dockerfile` use optimized multi-stage builds to compile the Java/React code and serve it via JRE/Nginx respectively.
   - `docker-compose.yml` seamlessly wires up PostgreSQL, Redis, MinIO, the Backend, and the Frontend.

## How to Run It

1. Open a terminal and navigate to `D:\CloudNest`.
2. Run `docker-compose up -d --build`.
3. Open `http://localhost` to view the stunning Frontend Dashboard.
4. The backend API will be available at `http://localhost:8080`.

You now have a scalable, enterprise-grade multi-tenant SaaS platform ready for production use!
