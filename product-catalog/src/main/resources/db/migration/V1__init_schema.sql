CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    image_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    parent_id BIGINT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES categories (id)
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(19, 2) NOT NULL,
    compare_at_price DECIMAL(19, 2),
    cost_price DECIMAL(19, 2),
    status VARCHAR(50) NOT NULL,
    quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    brand VARCHAR(255),
    weight_grams DOUBLE PRECISION,
    category_id BIGINT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE product_tags (
    product_id BIGINT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    CONSTRAINT fk_product_tags_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE product_images (
    product_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Indexes
CREATE INDEX idx_category_name ON categories (name);
CREATE INDEX idx_product_name ON products (name);
CREATE INDEX idx_product_status ON products (status);
CREATE INDEX idx_product_price ON products (price);
CREATE INDEX idx_product_category ON products (category_id);
CREATE INDEX idx_product_brand ON products (brand);
