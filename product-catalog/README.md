# Product Catalog Microservice

A Spring Boot application for managing product catalogs, featuring custom validation, AOP logging, and PostgreSQL/Redis integration.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Docker & Docker Compose
- Maven (optional, wrapper provided)

### 1. Start Support Services (Database & Cache)
Run the following command to start PostgreSQL and Redis in Docker containers:
```bash
docker-compose up -d
```
> **Note:** PostgreSQL is configured to run on port **5433** to avoid conflicts with local installations.
> - Database: `jdbc:postgresql://localhost:5433/product_catalog`
> - User: `postgres`
> - Password: `password`

### 2. Run the Application
Start the Spring Boot application using the Maven wrapper:
```bash
./mvnw spring-boot:run
```
The application will start on port `8080`.

## 🧪 Testing the API

Once the application is running, you can test it with the following commands:

### Create a Product
```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "sku": "ELEC-PHN-IP15",
    "price": 999.00,
    "categoryId": 1
  }'
```

### Get Product by SKU
```bash
curl http://localhost:8080/api/v1/products/sku/ELEC-PHN-IP15
```

### Check Health
```bash
curl http://localhost:8080/actuator/health
```

## 📝 Features
- **Validation**: Custom `@ValidSKU` annotation enforces `XX-XXX-XXXX` format.
- **Logging**: Aspects log method execution arguments and time (warns if > 1s).
- **Caching**: Redis caching for high-performance reads on product endpoints.

## 🧪 Comprehensive API Testing

Copy and run these commands in your terminal to test all endpoints.

### 1️⃣ Categories API
```bash
# Create a Category
curl -X POST http://localhost:8080/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Electronics", "description": "Gadgets and devices"}'

# Get All Categories
curl http://localhost:8080/api/v1/categories
```

### 2️⃣ Products API
```bash
# Create a Product
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone X",
    "sku": "ELEC-PHN-X100",
    "price": 699.99,
    "categoryId": 1,
    "quantity": 50,
    "status": "ACTIVE"
  }'

# Get Product by ID (Cached)
curl http://localhost:8080/api/v1/products/1

# Get Product by SKU (Cached)
curl http://localhost:8080/api/v1/products/sku/ELEC-PHN-X100

# Get Featured Products
curl http://localhost:8080/api/v1/products/featured

# Get Low Stock Products
curl http://localhost:8080/api/v1/products/low-stock

# Update Product Status
curl -X PATCH "http://localhost:8080/api/v1/products/1/status?status=ARCHIVED"
```

### 3️⃣ Testing Validation
```bash
# Try to create product with invalid SKU (Should fail)
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Product",
    "sku": "BAD-SKU", 
    "price": 100.00,
    "categoryId": 1
  }'
```

## 🔍 Verifying Redis Caching

To see if Redis is actually working and caching your data, you can monitor the Redis commands in real-time.

1.  **Open a new terminal**.
2.  **Run the Redis Monitor command**:
    ```bash
    docker-compose exec redis redis-cli monitor
    ```
3.  **Make an API request** (e.g., `curl http://localhost:8080/api/v1/products/1`).
4.  **Watch the monitor**:
    -   **First Request**: You will see `SET` commands as the data is stored in the cache.
    -   **Subsequent Requests**: You will see `GET` commands as the data is served from the cache (and the database is not hit).

## 🗄️ Database Access

Since the database runs inside a Docker container, you can access it using the `psql` command-line tool.

### Connect to Postgres
Run the following command to open a SQL shell inside the container:
```bash
docker-compose exec postgres psql -U postgres -d product_catalog
```

### Useful Commands
Once connected (you'll see a `product_catalog=#` prompt), you can run:

- List all tables:
  ```sql
  \dt
  ```

- View all products:
  ```sql
  SELECT * FROM products;
  ```

- View all categories:
  ```sql
  SELECT * FROM categories;
  ```

- Quit:
  ```sql
  \q
  ```
