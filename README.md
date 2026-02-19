# 📦 Product Catalog Microservice

A **full-stack microservice** for managing product inventory, categories, and real-time stock alerts. Built with **Spring Boot** (Backend) and **React + TypeScript** (Frontend), designed for high performance and scalability.

---

## 🚀 Quick Start (Docker)

Run the entire application (Frontend, Backend, Database, Redis) with a single command:

```bash
docker-compose up --build -d
```

| Service | URL | Description |
|---|---|---|
| **Frontend** | [http://localhost](http://localhost) | React Admin Dashboard |
| **Backend API** | [http://localhost/api/v1](http://localhost/api/v1) | Spring Boot REST API |
| **Database** | `localhost:5433` | PostgreSQL (User: `postgres`, Pass: `password`) |
| **Cache** | `localhost:6379` | Redis |

---

## 🛠 Tech Stack

### **Backend**
*   **Java 17** + **Spring Boot 3.2**
*   **PostgreSQL**: Primary database for products & categories.
*   **Redis**: Caching layer for high-performance reads.
*   **JPA Specifications**: Dynamic filtering (search, brand, price range).
*   **Spring Scheduler**: Periodic tasks (e.g., low stock check).
*   **AOP**: Centralized logging aspect.

### **Frontend**
*   **React 18** + **TypeScript** + **Vite**
*   **Tailwind CSS**: Modern utility-first styling.
*   **React Query (TanStack Query)**: Server state management & caching.
*   **React Hook Form** + **Zod**: Form validation.
*   **Lucide React**: Beautiful icons.
*   **Nginx**: Production-grade web server & reverse proxy.

---

## ✨ Key Features

### 1. **Single Source of Truth**
*   Centralized product database ensures consistency across all channels (Web, Mobile, External APIs).
*   **REST API** follows standard conventions for easy integration.

### 2. **Performance Optimized**
*   **Redis Caching**: Frequently accessed data (like product details) is cached to reduce DB load.
*   **Pagination & Filtering**: Efficiently handles large datasets using server-side pagination and dynamic SQL generation.

### 3. **Real-time Inventory Management**
*   **Low Stock Alerts**: Automatically detects products below threshold.
*   **Instant Notifications**: Frontend polls for changes and displays toast/badge alerts immediately.
*   **Default Thresholds**: New products automatically get a safety stock threshold of 5.

### 4. **Modern UI/UX**
*   **Dark Mode**: Fully supported system-wide dark theme.
*   **Responsive**: Works seamlessly on mobile and desktop.
*   **Interactive Dashboard**: Real-time statistics and charts.

---

## 📚 API Documentation

### Products
*   `GET /api/v1/products/filter` - Search & Filter (pagination, sort, criteria).
*   `GET /api/v1/products/{id}` - Get single product details.
*   `GET /api/v1/products/low-stock` - Get items below threshold.
*   `POST /api/v1/products` - Create new product.
*   `PUT /api/v1/products/{id}` - Update product.
*   `PATCH /api/v1/products/{id}/status` - Quick status toggle (ACTIVE/DRAFT).

### Categories
*   `GET /api/v1/categories` - List all categories.
*   `POST /api/v1/categories` - Create new category.

---

## 🚢 CI/CD & Deployment

### **CI Pipeline (GitHub Actions)**
Automatically runs on every push:
1.  **Checkout Code**
2.  **Setup Java 17**
3.  **Run Tests** (`mvn verify`)
4.  **Build Docker Image**

### **Deployment (CD)**
To deploy to production (AWS EC2 / DigitalOcean Droplet):

1.  **SSH into server**:
    ```bash
    ssh user@your-server-ip
    ```
2.  **Clone Repo**:
    ```bash
    git clone https://github.com/your-username/product-catalog.git
    cd product-catalog
    ```
3.  **Run Docker Compose**:
    ```bash
    docker-compose up --build -d
    ```
4.  **Done!** Your app is live at `http://your-server-ip`.

---

## 🔮 Future Enhancements
*   [ ] **Authentication**: Spring Security + JWT for secure admin login.
*   [ ] **Audit Logs**: Track who changed stock/price and when.
*   [ ] **Image Upload**: S3 integration for actual file hosting.
*   [ ] **Export**: CSV/Excel export for inventory reports.

---

*Verified & Documented by AI Assistant*
