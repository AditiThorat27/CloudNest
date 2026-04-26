-- V2__add_products_and_metrics.sql

-- 7. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    CONSTRAINT uq_categories_name_tenant UNIQUE (name, tenant_id)
);

-- 8. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    stock_quantity INTEGER NOT NULL,
    image_url VARCHAR(255),
    category_id UUID REFERENCES categories(id)
);

-- 9. API Metrics Table
CREATE TABLE api_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(50) NOT NULL,
    response_time_ms BIGINT,
    status_code INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS setup for new tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_categories ON categories
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_products ON products
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

ALTER TABLE api_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_api_metrics ON api_metrics
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
