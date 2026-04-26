# CloudNest 🚀
**A Multi-Tenant SaaS E-Commerce Platform with Integrated Cloud Workspace Analytics.**

CloudNest is a powerful, production-ready full-stack application. It allows multiple businesses to register, create their own online stores, and manage products, orders, and customers independently—all while sharing the same underlying infrastructure securely.

## 🏗️ Architecture & Multi-Tenancy

This platform uses a **Shared Database, Shared Schema** architecture. Strict data isolation is guaranteed using:
1. **PostgreSQL Row-Level Security (RLS)**: Database-level enforcement of tenant boundaries.
2. **Hibernate Partitioning (`@TenantId`)**: Application-level enforcement via the `CurrentTenantIdentifierResolver` and custom interceptors.
3. **JWT Context Extraction**: Tenant context is determined on every request via the JWT token or the `X-Tenant-ID` header.

## 💻 Tech Stack
- **Frontend**: React.js, Tailwind CSS, TypeScript, Vite
- **Backend**: Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate 6
- **Database**: PostgreSQL 15, Flyway for migrations
- **Caching & Storage**: Redis, MinIO (S3 compatible)
- **Containerization**: Docker & Docker Compose

## 🚀 Quickstart Setup

Ensure you have Docker and Docker Compose installed.

1. **Clone or navigate to the repository:**
   ```bash
   cd CloudNest
   ```

2. **Start the infrastructure and applications:**
   ```bash
   docker-compose up -d --build
   ```

   This command will spin up:
   - `cloudnest_postgres`: PostgreSQL Database (Port 5432)
   - `cloudnest_redis`: Redis Cache (Port 6379)
   - `cloudnest_minio`: Object Storage (Ports 9000, 9001)
   - `cloudnest_backend`: Spring Boot API (Port 8080)
   - `cloudnest_frontend`: React SaaS Dashboard (Port 80)

3. **Access the application:**
   - **Frontend UI**: Open `http://localhost` in your browser to view the highly aesthetic, Tailwind-powered SaaS Dashboard.
   - **Backend API**: `http://localhost:8080/api/v1/...`

4. **Testing the connection:**
   - When you access the frontend at `http://localhost`, click on "Sign up".
   - Register a new tenant with a custom `subdomain` (e.g. `mycompany`).
   - Log in using your email, password, and the same `subdomain`.
   - Access the "Products" tab to see real-time data fetched from the backend.

## 🔑 Core Features Implemented

- **Multi-Tenant Auth**: `/api/v1/auth/register` automatically provisions a new workspace, creates a `TENANT_ADMIN` role, and generates a scoped JWT token.
- **E-Commerce Modules**: Base entities for Products, Categories, Orders, and Customers with automated tenant assignment.
- **Analytics Middleware**: `ApiMetricsInterceptor` captures response times, status codes, and HTTP methods per tenant and stores them in `api_metrics`.
- **Aesthetic UI**: A beautifully crafted dark-mode Dashboard with glassmorphism effects, gradient charts, and micro-animations.

## 🛠️ API Documentation (Sneak Peek)

### `POST /api/v1/auth/register`
Registers a new tenant business and provisions their admin user.
**Body:**
```json
{
  "companyName": "Acme Corp",
  "subdomain": "acme",
  "email": "admin@acme.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": "Tenant registered successfully"
}
```

*Note: In a full production setup, the JWT secret, database credentials, and MinIO keys should be managed via `.env` files or a secret manager.*
