# 🔗 URL Shortener with Monitoring & Analytics

A full-stack containerized URL shortening service with real-time metrics, built as part of our DevOps journey at DEPI. This project demonstrates modern web development practices, containerization, and monitoring implementation.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Team](#-team)

---

## Project Overview

This is a URL shortener service that takes long URLs and converts them into short, shareable links. Think of it like bit.ly, but we built it from scratch to learn containerization, monitoring, and modern web architecture.

**What makes this project special:**
-  Docker
- Real-time metrics and monitoring dashboard
- responsive UI built with React and Tailwind
- PostgreSQL database
- Prometheus-ready metrics for production monitoring
- Live updates every 10-15 seconds

---

## Architecture

The project follows a **3-tier architecture** with complete separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         User's Browser                       │
│                    (localhost:3001)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP Requests (REST API)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Frontend Container                        │
│  • React 18 (UI Framework)                                   │
│  • TypeScript (Type Safety)                                  │
│  • Tailwind CSS (Styling)                                    │
│  • Axios (HTTP Client)                                       │
│  • React Router (Navigation)                                 │
│                                                              │
│  Nginx serves the built static files (production-ready)     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ API Calls to Backend
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Backend Container                         │
│  • Node.js 18 (Runtime)                                      │
│  • Express.js (Web Framework)                                │
│  • TypeScript (Type Safety)                                  │
│  • prom-client (Prometheus Metrics)                          │
│  • pg (PostgreSQL Client)                                    │
│  • nanoid (Short Code Generator)                             │
│                                                              │
│  Exposes REST API on port 3000                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ SQL Queries via pg driver
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  PostgreSQL Container                        │
│  • PostgreSQL 15 Alpine (Database)                           │
│  • Persistent Volume (Data survives restarts)                │
│  • Health checks ensure DB is ready before backend starts    │
│                                                              │
│  Stores: URLs, clicks, timestamps                           │
└──────────────────────────────────────────────────────────────┘
```

**Key Architecture Decisions:**

1. **Containerization**: Each service runs in its own Docker container, making deployment consistent across any environment (your laptop, my laptop, or production server).

2. **Service Communication**: All containers are on the same Docker network (`app-network`), so they can talk to each other using container names instead of IPs.

3. **Data Persistence**: PostgreSQL data is stored in a Docker volume, so even if you stop/restart containers, your data remains safe.

4. **Health Checks**: Backend waits for Postgres to be healthy before starting, preventing connection errors.

---

## Tech Stack

### Frontend (`/frontend`)

Built with modern web technologies for a smooth user experience:

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 18.2.0 | UI library - handles rendering and state management |
| **TypeScript** | 4.9.5 | Adds type safety to JavaScript, catches bugs before runtime |
| **React Router Dom** | 6.20.0 | Client-side routing (switch between pages without reload) |
| **Axios** | 1.6.0 | HTTP client for API calls (cleaner than fetch) |
| **Tailwind CSS** | 3.3.6 | Utility-first CSS framework (no writing CSS files!) |
| **React Scripts** | 5.0.1 | Build tooling from Create React App (Webpack, Babel, etc.) |

**How Frontend Works:**
1. User enters a long URL
2. Axios sends POST request to backend `/api/shorten`
3. Backend responds with short code
4. Frontend displays the shortened URL
5. Dashboard polls `/api/metrics` every 10 seconds for live updates
6. Table polls `/api/urls` every 15 seconds to show all URLs

### Backend (`/backend`)

RESTful API built with Node.js ecosystem:

| Package | Version | Purpose |
|---------|---------|---------|
| **Express.js** | 4.18.2 | Web framework - handles routing, middleware, requests |
| **TypeScript** | 5.3.2 | Type-safe backend code |
| **pg** | 8.11.3 | PostgreSQL client - database connection and queries |
| **prom-client** | 15.1.0 | Prometheus metrics collector (for monitoring) |
| **nanoid** | 3.3.7 | Generates random short codes (cryptographically secure) |
| **cors** | 2.8.5 | Enables frontend to call backend from different port |

**Backend Architecture Pattern:**

```
Request Flow:
User → Express Router → Controller → Model → PostgreSQL
                     ↓
                Middleware (metrics tracking, CORS)
```

**Code Organization (MVC-ish):**
- **Routes** (`/routes`): Define API endpoints
- **Controllers** (`/controllers`): Handle request/response logic
- **Models** (`/models`): Database queries (like repository pattern)
- **Services** (`/services`): Business logic (shortener, metrics)
- **Middleware** (`/middleware`): Request preprocessing (CORS, metrics)
- **Utils** (`/utils`): Helper functions (validators)

### Database

**PostgreSQL 15 Alpine** - Lightweight, production-ready relational database

**Why PostgreSQL over SQLite?**
- Better for multi-container setups
- ACID compliance (transactions are safe)
- Handles concurrent requests better
- Industry standard for production apps

**Schema:**
```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  clicks INTEGER DEFAULT 0
);
```

---

## How It Works

### 1. URL Shortening Flow

```
User enters: https://www.example.com/very/long/url/that/we/want/to/shorten

↓ Frontend sends POST request

{
  "url": "https://www.example.com/very/long/url/that/we/want/to/shorten"
}

↓ Backend receives request

→ Validates URL (must be http/https)
→ Generates random 8-character code using nanoid: "a1B2c3D4"
→ Inserts into PostgreSQL database
→ Returns response

{
  "originalUrl": "https://www.example.com/very/long/url/that/we/want/to/shorten",
  "shortCode": "a1B2c3D4",
  "shortUrl": "http://localhost:3000/a1B2c3D4",
  "createdAt": "2025-10-17T16:30:00.000Z"
}

↓ Frontend displays result

Short URL: http://localhost:3000/a1B2c3D4
[Copy Button] [Visit Button]
```

### 2. URL Redirection Flow

```
User clicks: http://localhost:3000/a1B2c3D4

↓ Backend receives GET /:shortCode

→ Queries database: SELECT * FROM urls WHERE short_code = 'a1B2c3D4'
→ If found:
  → Increments clicks counter
  → Records metrics (successful redirect)
  → Returns HTTP 302 redirect to original URL
→ If not found:
  → Records metrics (failed lookup)
  → Returns HTTP 404

↓ Browser automatically redirects

User lands on: https://www.example.com/very/long/url/that/we/want/to/shorten
```

### 3. Metrics & Monitoring

**Prometheus Metrics (Text Format)** - `/metrics`
```
# HELP urls_shortened_total Total number of URLs shortened
# TYPE urls_shortened_total counter
urls_shortened_total 42

# HELP successful_redirects_total Total number of successful redirects
# TYPE successful_redirects_total counter
successful_redirects_total 156

# HELP request_latency_ms Request latency in milliseconds
# TYPE request_latency_ms histogram
request_latency_ms_bucket{le="50"} 120
request_latency_ms_bucket{le="100"} 180
...
```

**Dashboard Metrics (JSON Format)** - `/api/metrics`
```json
{
  "urlsShortened": 42,
  "successfulRedirects": 156,
  "failedLookups": 3,
  "averageLatency": 45.2,
  "p95Latency": 67.8
}
```

**How Metrics Work:**
1. Every request passes through `metricsMiddleware`
2. Middleware records start time
3. On response finish, calculates latency
4. Increments counters (successful/failed)
5. Stores in Prometheus registry (in-memory)
6. Dashboard polls every 10 seconds and displays

---

## 📁 Project Structure

```
Depi-url-short/
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── app.ts              # Express app setup (middleware, routes)
│   │   ├── server.ts           # Entry point (starts server)
│   │   ├── controllers/
│   │   │   └── urlController.ts    # Request handlers (shortenUrl, redirectUrl)
│   │   ├── db/
│   │   │   └── index.ts           # PostgreSQL connection & init
│   │   ├── middleware/
│   │   │   └── metrics.ts         # Latency tracking middleware
│   │   ├── models/
│   │   │   └── url.ts             # Database queries (CRUD operations)
│   │   ├── routes/
│   │   │   └── index.ts           # API route definitions
│   │   ├── services/
│   │   │   ├── metrics.ts         # Prometheus metrics service
│   │   │   └── shortener.ts       # Short code generation
│   │   └── utils/
│   │       └── validators.ts      # Input validation helpers
│   ├── Dockerfile              # Backend container config
│   ├── package.json            # Dependencies & scripts
│   └── tsconfig.json           # TypeScript config
│
├── frontend/                    # React + TypeScript UI
│   ├── public/
│   │   ├── index.html          # HTML template
│   │   └── favicon.ico
│   ├── src/
│   │   ├── App.tsx             # Main app component (routing)
│   │   ├── index.tsx           # React entry point
│   │   ├── components/
│   │   │   ├── UrlShortener.tsx   # URL input form
│   │   │   ├── Dashboard.tsx      # Metrics dashboard
│   │   │   ├── MetricsCard.tsx    # Reusable metric display
│   │   │   └── UrlsTable.tsx      # All URLs table
│   │   ├── services/
│   │   │   └── api.ts             # Axios API client
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript interfaces
│   │   └── styles/
│   │       └── index.css          # Tailwind CSS imports
│   ├── Dockerfile              # Frontend container (multi-stage build)
│   ├── package.json            # Dependencies & scripts
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── tsconfig.json           # TypeScript config
│
├── docker-compose.yml          # Multi-container orchestration
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- **Docker** (20.10+) & **Docker Compose** (2.0+)
- **Node.js** (18+) - for local development only
- **Git** - to clone the repo

### Installation & Running

1. **Clone the repository**
```bash
git clone https://github.com/your-username/Depi-url-short.git
cd Depi-url-short
```

2. **Start all services with Docker Compose**
```bash
# This will build images and start all containers
docker-compose up --build
```

Wait for these messages:
```
✅ url-shortener-postgres  | database system is ready to accept connections
✅ url-shortener-backend   | Server is running on http://localhost:3000
✅ url-shortener-frontend  | webpack compiled successfully
```

3. **Access the application**
- **Frontend UI**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Prometheus Metrics**: http://localhost:3000/metrics
- **Health Check**: http://localhost:3000/health

4. **Stop everything**
```bash
docker-compose down
```

5. **Stop and remove volumes (clean slate)**
```bash
docker-compose down -v
```

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev        # Starts on port 3000 with hot reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start          # Starts on port 3000 with hot reload
```

**Note**: You'll need PostgreSQL running locally for backend.

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Shorten URL
**POST** `/api/shorten`

Creates a new shortened URL.

**Request Body:**
```json
{
  "url": "https://www.example.com/very/long/url"
}
```

**Success Response (201):**
```json
{
  "originalUrl": "https://www.example.com/very/long/url",
  "shortCode": "a1B2c3D4",
  "shortUrl": "http://localhost:3000/a1B2c3D4",
  "createdAt": "2025-10-17T16:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid URL provided"
}
```

---

#### 2. Redirect to Original URL
**GET** `/:shortCode`

Redirects to the original URL.

**Example:**
```
GET http://localhost:3000/a1B2c3D4
```

**Success Response (302):**
- Redirects to original URL
- Increments click counter

**Error Response (404):**
```json
{
  "error": "Short URL not found"
}
```

---

#### 3. Get All URLs
**GET** `/api/urls`

Returns all shortened URLs with stats.

**Success Response (200):**
```json
[
  {
    "id": 1,
    "original_url": "https://www.example.com/page1",
    "short_code": "a1B2c3D4",
    "created_at": "2025-10-17T16:30:00.000Z",
    "clicks": 42
  },
  {
    "id": 2,
    "original_url": "https://www.example.com/page2",
    "short_code": "x5Y6z7W8",
    "created_at": "2025-10-17T17:00:00.000Z",
    "clicks": 15
  }
]
```

---

#### 4. Get Metrics (JSON)
**GET** `/api/metrics`

Returns metrics in JSON format for dashboard.

**Success Response (200):**
```json
{
  "urlsShortened": 42,
  "successfulRedirects": 156,
  "failedLookups": 3,
  "averageLatency": 45.2,
  "p95Latency": 67.8
}
```

---

#### 5. Get Prometheus Metrics
**GET** `/metrics`

Returns metrics in Prometheus text format for scraping.

**Success Response (200):**
```
# HELP urls_shortened_total Total number of URLs shortened
# TYPE urls_shortened_total counter
urls_shortened_total 42

# HELP successful_redirects_total Total number of successful redirects
# TYPE successful_redirects_total counter
successful_redirects_total 156
...
```

---

#### 6. Health Check
**GET** `/health`

Checks if backend is running.

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

## 🔧 Development Guide

### Environment Variables

**Backend** (`.env` file in `/backend`):
```env
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=urlshortener
DB_USER=urlshortener
DB_PASSWORD=urlshortener123
```

**Frontend** (build-time):
```env
REACT_APP_API_URL=http://localhost:3000
```

### Docker Configuration

**docker-compose.yml Breakdown:**

```yaml
services:
  postgres:                    # Database service
    image: postgres:15-alpine  # Lightweight Postgres image
    environment:
      POSTGRES_USER: urlshortener
      POSTGRES_PASSWORD: urlshortener123
      POSTGRES_DB: urlshortener
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persistent storage
    healthcheck:               # Ensures DB is ready before backend starts
      test: ["CMD-SHELL", "pg_isready -U urlshortener"]
      interval: 10s
      
  backend:                     # API service
    build: ./backend           # Builds from backend/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy  # Waits for Postgres
    environment:
      DB_HOST: postgres        # Uses container name as hostname
      
  frontend:                    # UI service
    build: ./frontend          # Multi-stage build (Node → Nginx)
    depends_on:
      - backend                # Starts after backend
    environment:
      REACT_APP_API_URL: http://localhost:3000
```



### Common Issues & Solutions

**1. Port already in use**
```bash
# Find process using port 3000
lsof -ti:3000
# Kill it
kill -9 <PID>
```

**2. Database connection refused**
```bash
# Check if Postgres is healthy
docker ps
# Check logs
docker logs url-shortener-postgres
```

**3. Frontend can't reach backend**
- Check `REACT_APP_API_URL` in docker-compose.yml
- Verify backend is running: http://localhost:3000/health
- Check CORS is enabled in backend

**4. Changes not reflecting**
```bash
# Rebuild containers
docker-compose up --build

# If still not working, clean everything
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Youssef Reda Mohamed** | Team Lead & Backend Dev | Coordination, API development, Documentation |
| **Hager Salah El-Din Youssef** | Frontend & Visualization | Grafana, Dashboard, UI/UX |
| **Ahmad Nasser Abdel Latif** | DevOps & Containerization | Docker setup, docker-compose, CI/CD |
| **Sarah Ibrahim Abdallah** | Monitoring & Persistence | Prometheus integration, Data persistence |

---

## 📈 Future Improvements

- [ ] Add Grafana for advanced visualization
- [ ] Implement rate limiting (prevent abuse)
- [ ] Add URL expiration feature
- [ ] Custom short codes (user-defined)
- [ ] QR code generation
- [ ] Analytics (geographic data, referrers)
- [ ] User authentication & personal dashboards
- [ ] API key system for external usage
- [ ] Kubernetes deployment manifests

---

## 📝 License

This project is part of the DEPI program and is for educational purposes.

---

## 🙏 Acknowledgments

- DEPI program
- Our instructor: Ahmad Gamil


---


