# URL Shortener - DevOps Implementation Guide

## 🚀 Project Overview

A production-ready URL shortening service built with modern DevOps practices, featuring full containerization, comprehensive monitoring, and automated deployment pipelines. This project demonstrates enterprise-grade infrastructure management, observability, and CI/CD workflows.

**DEPI Program 2025 - Team 3**

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [DevOps Stack](#devops-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development Workflow](#development-workflow)
- [Docker Configuration](#docker-configuration)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring & Observability](#monitoring--observability)
- [CI/CD Pipeline](#cicd-pipeline)
- [Security Best Practices](#security-best-practices)
- [Performance & Scaling](#performance--scaling)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         User Layer                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Nginx)                      │
│  Port: 3001 (Docker) / 80 (K8s LoadBalancer)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express + TypeScript)                   │
│  Port: 3000                                                  │
│  Features:                                                   │
│  - URL Shortening Logic                                      │
│  - Redirect Service                                          │
│  - Prometheus Metrics Endpoint                               │
│  - Health Checks                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   PostgreSQL     │  │   Prometheus     │
        │   Port: 5432     │  │   Port: 9090     │
        │   - urls table   │  │   - Metrics DB   │
        │   - clicks table │  │   - Scrape Jobs  │
        └──────────────────┘  └──────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │     Grafana      │
                              │   Port: 3002     │
                              │   - Dashboards   │
                              │   - Alerts       │
                              └──────────────────┘
```

### Network Architecture

**Docker Compose:**
- `app-network` (bridge): Frontend ↔ Backend ↔ PostgreSQL
- `monitoring` (bridge): Backend ↔ Prometheus ↔ Grafana

**Kubernetes:**
- `url-shortener` namespace
- Services with ClusterIP (internal) and LoadBalancer (external)
- Network Policies for pod-to-pod communication

---

## 🛠️ DevOps Stack

### Containerization
- **Docker**: Multi-stage builds for optimized images
- **Docker Compose**: Local development orchestration
- **Alpine Linux**: Base images for minimal footprint

### Orchestration
- **Kubernetes**: Production deployment
- **kubectl**: Cluster management
- **StatefulSets**: For PostgreSQL persistence
- **Deployments**: For stateless services

### Monitoring & Observability
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and alerting
- **Custom Metrics**: Application-level instrumentation
- **Health Checks**: Liveness and readiness probes

### CI/CD
- **GitHub Actions**: Automated build and deploy
- **Docker Hub**: Container registry
- **Automated Testing**: Pre-deployment validation

### Infrastructure as Code
- **docker-compose.yml**: Development environment
- **Kubernetes Manifests**: Production deployment
- **Prometheus Config**: Monitoring setup
- **Grafana Provisioning**: Dashboard automation

---

## 📁 Project Structure

```
Depi-url-short/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
│
├── backend/
│   ├── Dockerfile                  # Multi-stage backend build
│   ├── src/
│   │   ├── app.ts                  # Express application
│   │   ├── server.ts               # Server entry point
│   │   ├── controllers/
│   │   │   └── urlController.ts    # URL CRUD operations
│   │   ├── middleware/
│   │   │   └── metrics.ts          # Prometheus middleware
│   │   ├── services/
│   │   │   ├── metrics.ts          # Metrics service
│   │   │   └── shortener.ts        # URL shortening logic
│   │   ├── models/
│   │   │   └── url.ts              # Database models
│   │   ├── db/
│   │   │   └── index.ts            # PostgreSQL connection pool
│   │   └── routes/
│   │       └── index.ts            # API routes
│   ├── migrations/
│   │   ├── init.sql                # Database schema
│   │   └── add_clicks_table.sql    # Click tracking
│   └── tests/
│       └── url.test.ts             # Unit tests
│
├── frontend/
│   ├── Dockerfile                  # Multi-stage frontend build
│   ├── nginx.conf                  # Production server config
│   ├── src/
│   │   ├── App.tsx                 # Main React component
│   │   ├── components/
│   │   │   ├── UrlShortener.tsx    # URL creation form
│   │   │   ├── Dashboard.tsx       # Metrics dashboard
│   │   │   ├── MetricsCard.tsx     # Metric display
│   │   │   ├── QRCodeModal.tsx     # QR code generator
│   │   │   └── Statistics.tsx      # Stats visualization
│   │   └── services/
│   │       └── api.ts              # Backend API client
│   └── public/
│       └── favicon.ico
│
├── kubernetes/
│   ├── url-shortener.yml           # Namespace definition
│   ├── postgres.yml                # StatefulSet + PVC + Service
│   ├── backend.yml                 # Backend Deployment + Service
│   ├── frontend.yml                # Frontend Deployment + LoadBalancer
│   └── monitoring.yml              # Prometheus + Grafana stack
│
├── monitoring/
│   ├── prometheus.yml              # Prometheus configuration
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/
│       │   │   └── datasource.yml  # Prometheus datasource
│       │   ├── dashboards/
│       │   │   └── dashboards.yml  # Dashboard provisioning
│       │   └── alerting/
│       │       └── alerts.yml      # Alert rules
│       └── dashboards/
│           └── url_shortener_dashboard.json
│
├── docker-compose.yml              # Local development stack
├── README.md                       # User documentation
└── DEV_README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required tools
docker --version          # Docker 20.10+
docker-compose --version  # Docker Compose 2.0+
kubectl version          # Kubernetes 1.24+
node --version           # Node.js 18+
npm --version            # npm 9+
```

### Local Development with Docker Compose

```bash
# 1. Clone the repository
git clone <repository-url>
cd Depi-url-short

# 2. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Configure backend/.env
cat > backend/.env << EOF
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=urlshortener
DB_USER=urlshortener
DB_PASSWORD=urlshortener123
BASE_URL=http://localhost:3000
EOF

# 4. Configure frontend/.env
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3000
EOF

# 5. Start all services
docker-compose up --build

# 6. Verify services are healthy
docker-compose ps

# Expected output:
# NAME                    STATUS              PORTS
# url-shortener-postgres  Up (healthy)        0.0.0.0:5432->5432/tcp
# url-shortener-backend   Up (healthy)        0.0.0.0:3000->3000/tcp
# url-shortener-frontend  Up                  0.0.0.0:3001->80/tcp
# prometheus              Up                  0.0.0.0:9090->9090/tcp
# grafana                 Up                  0.0.0.0:3002->3000/tcp
```

### Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3001 | - |
| Backend API | http://localhost:3000 | - |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3002 | admin / admin |
| PostgreSQL | localhost:5432 | urlshortener / urlshortener123 |

### Run Database Migrations

```bash
# Access the PostgreSQL container
docker exec -it url-shortener-postgres psql -U urlshortener -d urlshortener

# Manually run migrations (if not auto-applied)
docker exec -i url-shortener-postgres psql -U urlshortener -d urlshortener < backend/migrations/init.sql
docker exec -i url-shortener-postgres psql -U urlshortener -d urlshortener < backend/migrations/add_clicks_table.sql
```

---

## 💻 Development Workflow

### Backend Development

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Run tests
npm test

# Build TypeScript
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

### Frontend Development

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Docker Development

```bash
# Build specific service
docker-compose build backend

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Execute commands in running container
docker exec -it url-shortener-backend sh

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## 🐳 Docker Configuration

### Multi-Stage Backend Dockerfile

```dockerfile
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
RUN apk add --no-cache wget
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

**Benefits:**
- **90% size reduction**: Build dependencies not in production image
- **Security**: No build tools in final image
- **Performance**: Optimized layers for caching

### Multi-Stage Frontend Dockerfile

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- **Tiny image**: ~80MB vs ~1.2GB with Node.js
- **Production-ready**: Nginx serves static files efficiently
- **SPA support**: Configured for React Router

### Docker Compose Services

#### PostgreSQL with Health Checks

```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_USER: urlshortener
    POSTGRES_PASSWORD: urlshortener123
    POSTGRES_DB: urlshortener
    PGDATA: /var/lib/postgresql/data/pgdata
  volumes:
    - postgres_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U urlshortener -d urlshortener"]
    interval: 10s
    timeout: 5s
    retries: 5
  restart: unless-stopped
```

#### Backend with Dependencies

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  depends_on:
    postgres:
      condition: service_healthy  # Wait for DB to be ready
  environment:
    NODE_ENV: production
    DB_HOST: postgres  # Docker DNS resolution
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
  networks:
    - app-network
    - monitoring  # Access to Prometheus
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

```bash
# Verify Kubernetes cluster is running
kubectl cluster-info

# Create namespace
kubectl apply -f kubernetes/url-shortener.yml

# Verify namespace
kubectl get namespaces
```

### Deploy All Services

```bash
# Apply all manifests
kubectl apply -f kubernetes/

# Verify deployments
kubectl get all -n url-shortener

# Expected output:
# NAME                            READY   STATUS    RESTARTS   AGE
# pod/backend-xxx                 1/1     Running   0          2m
# pod/frontend-xxx                1/1     Running   0          2m
# pod/postgres-0                  1/1     Running   0          2m
# pod/prometheus-xxx              1/1     Running   0          2m
# pod/grafana-xxx                 1/1     Running   0          2m
```

### PostgreSQL StatefulSet

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: url-shortener
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: urlshortener
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

### Backend Deployment with Resources

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: url-shortener
spec:
  replicas: 3  # Horizontal scaling
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-dockerhub/url-shortener-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: postgres
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Frontend LoadBalancer Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: url-shortener
spec:
  type: LoadBalancer  # External access
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

### Useful Kubernetes Commands

```bash
# Get all resources in namespace
kubectl get all -n url-shortener

# Describe a pod
kubectl describe pod <pod-name> -n url-shortener

# View logs
kubectl logs -f <pod-name> -n url-shortener

# Execute command in pod
kubectl exec -it <pod-name> -n url-shortener -- sh

# Scale deployment
kubectl scale deployment backend --replicas=5 -n url-shortener

# Get service external IP
kubectl get svc frontend -n url-shortener

# Port forward for local access
kubectl port-forward svc/backend 3000:3000 -n url-shortener

# Delete all resources in namespace
kubectl delete namespace url-shortener
```

---

## 📊 Monitoring & Observability

### Custom Prometheus Metrics

#### Metrics Service Implementation

```typescript
// backend/src/services/metrics.ts
import { Counter, Histogram, Gauge, register } from 'prom-client';

class MetricsService {
  private urlsCreatedCounter: Counter;
  private redirectsCounter: Counter;
  private failedLookupsCounter: Counter;
  private requestLatencyHistogram: Histogram;
  private totalUrlsGauge: Gauge;

  constructor() {
    // Counter: URLs shortened
    this.urlsCreatedCounter = new Counter({
      name: 'urls_shortened_total',
      help: 'Total number of URLs shortened',
    });

    // Counter: Successful redirects
    this.redirectsCounter = new Counter({
      name: 'successful_redirects_total',
      help: 'Total number of successful URL redirects',
    });

    // Counter: Failed lookups (404s)
    this.failedLookupsCounter = new Counter({
      name: 'failed_lookups_total',
      help: 'Total number of failed URL lookups',
    });

    // Histogram: Request latency
    this.requestLatencyHistogram = new Histogram({
      name: 'request_latency_ms',
      help: 'Request latency in milliseconds',
      buckets: [10, 50, 100, 200, 500, 1000],
    });

    // Gauge: Total URLs in database
    this.totalUrlsGauge = new Gauge({
      name: 'total_urls',
      help: 'Total number of URLs in the database',
    });
  }

  recordUrlCreated(): void {
    this.urlsCreatedCounter.inc();
  }

  recordRedirect(): void {
    this.redirectsCounter.inc();
  }

  recordFailedLookup(): void {
    this.failedLookupsCounter.inc();
  }

  recordLatency(latencyMs: number): void {
    this.requestLatencyHistogram.observe(latencyMs);
  }

  setTotalUrls(count: number): void {
    this.totalUrlsGauge.set(count);
  }

  getMetrics(): Promise<string> {
    return register.metrics();
  }
}

export const metricsService = new MetricsService();
```

#### Metrics Middleware

```typescript
// backend/src/middleware/metrics.ts
import { Request, Response, NextFunction } from 'express';
import { metricsService } from '../services/metrics';

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    metricsService.recordLatency(duration);
  });

  next();
};
```

### Prometheus Configuration

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 5s
  evaluation_interval: 5s

scrape_configs:
  - job_name: 'url-shortener-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 5s
```

### Grafana Dashboard

The dashboard is auto-provisioned and includes:

**Panels:**
1. **URL Creations per Second** - Rate of new URLs
   - Query: `rate(urls_shortened_total[1m])`
   
2. **Total URLs** - Single stat
   - Query: `total_urls`

3. **Successful Redirects** - Time series
   - Query: `rate(successful_redirects_total[5m])`

4. **404 Error Rate** - Failed lookups
   - Query: `rate(failed_lookups_total[1m])`

5. **P95 Latency** - 95th percentile response time
   - Query: `histogram_quantile(0.95, rate(request_latency_ms_bucket[5m]))`

6. **Average Latency** - Mean response time
   - Query: `rate(request_latency_ms_sum[5m]) / rate(request_latency_ms_count[5m])`

**Alert Rules** (monitoring/grafana/provisioning/alerting/alerts.yml):

```yaml
groups:
  - name: url_shortener_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(failed_lookups_total[5m]) > 10
        for: 2m
        annotations:
          summary: "High 404 error rate detected"
          description: "Error rate is {{ $value }} errors/sec"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(request_latency_ms_bucket[5m])) > 200
        for: 5m
        annotations:
          summary: "High P95 latency detected"
          description: "P95 latency is {{ $value }}ms"

      - alert: ServiceDown
        expr: up{job="url-shortener-backend"} == 0
        for: 1m
        annotations:
          summary: "Backend service is down"
          description: "Backend has been down for 1 minute"
```

### Accessing Monitoring Stack

```bash
# Docker Compose
http://localhost:9090  # Prometheus
http://localhost:3002  # Grafana (admin/admin)

# Kubernetes
kubectl port-forward svc/prometheus 9090:9090 -n url-shortener
kubectl port-forward svc/grafana 3002:3000 -n url-shortener
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/url-shortener-backend:latest
            ${{ secrets.DOCKER_USERNAME }}/url-shortener-backend:${{ github.sha }}
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/url-shortener-backend:latest
          cache-to: type=inline

      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/url-shortener-frontend:latest
            ${{ secrets.DOCKER_USERNAME }}/url-shortener-frontend:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f kubernetes/
          kubectl rollout status deployment/backend -n url-shortener
          kubectl rollout status deployment/frontend -n url-shortener

      - name: Verify deployment
        run: |
          kubectl get pods -n url-shortener
          kubectl get svc -n url-shortener
```

### Required GitHub Secrets

```bash
DOCKER_USERNAME      # Docker Hub username
DOCKER_PASSWORD      # Docker Hub password/token
KUBE_CONFIG          # Kubernetes cluster config (base64 encoded)
```

### Pipeline Stages

1. **Checkout**: Clone repository
2. **Build**: Build Docker images with caching
3. **Push**: Push to Docker Hub with tags (latest + commit SHA)
4. **Deploy**: Apply Kubernetes manifests
5. **Verify**: Check deployment status

---

## 🔒 Security Best Practices

### Environment Variables

```bash
# Never commit these files
backend/.env
frontend/.env
.env.local
.env.production
```

### Kubernetes Secrets

```bash
# Create PostgreSQL secret
kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_USER=urlshortener \
  --from-literal=POSTGRES_PASSWORD=secure-password-here \
  -n url-shortener

# Create backend secrets
kubectl create secret generic backend-secret \
  --from-literal=DB_PASSWORD=secure-password-here \
  --from-literal=JWT_SECRET=your-jwt-secret \
  -n url-shortener
```

### Docker Security

```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Scan for vulnerabilities
docker scan your-image:latest
```

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: url-shortener
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 3000
```

---

## 🚀 Performance & Scaling

### Resource Optimization

**Backend Resource Requests:**
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

**Database Connection Pooling:**
```typescript
// backend/src/db/index.ts
const pool = new Pool({
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 2000,
});
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: url-shortener
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Performance Benchmarks

| Metric | Value |
|--------|-------|
| Average Response Time | < 50ms |
| P95 Latency | < 100ms |
| P99 Latency | < 200ms |
| Throughput | 1000+ req/sec (single pod) |
| Container Startup | ~5 seconds |
| Database Query Time | < 10ms (indexed) |

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend Can't Connect to Database

```bash
# Check database is healthy
docker-compose ps postgres

# Check health check logs
docker-compose logs postgres | grep "ready"

# Verify network connectivity
docker-compose exec backend ping postgres

# Check environment variables
docker-compose exec backend env | grep DB_
```

#### 2. Frontend CORS Errors

```typescript
// backend/src/app.ts - Verify CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
```

#### 3. Prometheus Not Scraping Metrics

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify backend metrics endpoint
curl http://localhost:3000/api/metrics

# Check Prometheus logs
docker-compose logs prometheus | grep "error"
```

#### 4. Kubernetes Pod CrashLoopBackOff

```bash
# Check pod logs
kubectl logs <pod-name> -n url-shortener

# Describe pod for events
kubectl describe pod <pod-name> -n url-shortener

# Check resource limits
kubectl top pods -n url-shortener
```

#### 5. Grafana Dashboard Not Loading

```bash
# Verify datasource connection
kubectl port-forward svc/grafana 3002:3000 -n url-shortener
# Navigate to: http://localhost:3002/datasources

# Check provisioning
kubectl exec -it <grafana-pod> -n url-shortener -- ls /etc/grafana/provisioning/datasources/
```

### Debugging Commands

```bash
# Docker Compose
docker-compose logs -f <service>
docker-compose exec <service> sh
docker-compose restart <service>
docker-compose down -v  # Clean slate

# Kubernetes
kubectl get events -n url-shortener --sort-by='.lastTimestamp'
kubectl logs <pod> -n url-shortener --previous  # Previous container logs
kubectl exec -it <pod> -n url-shortener -- sh
kubectl describe pod <pod> -n url-shortener
kubectl get pod <pod> -n url-shortener -o yaml

# Database
docker exec -it url-shortener-postgres psql -U urlshortener -d urlshortener
# Then: \dt (list tables), \d urls (describe table)
```

---

## 📚 Additional Resources

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

### Project Links
- Main README: [README.md](README.md)
- Backend README: [backend/README.md](backend/README.md)
- Frontend README: [frontend/README.md](frontend/README.md)

### Team
- **Youssef Reda Mohamed** - Team Leader
- **Hager Salah El-Din Youssef** - Monitoring & Grafana
- **Ahmad Nasser Abdel Latif** - Frontend & Docker
- **Sarah Ibrahim Abdallah** - CI/CD & Documentation

**DEPI Program 2025**

---

## 📝 License

This project is part of the DEPI educational program.

---

**Last Updated:** November 2025