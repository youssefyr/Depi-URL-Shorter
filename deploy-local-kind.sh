#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE} Deploying URL Shortener with proper ordering...${NC}"

# Check/create Kind cluster
if ! kind get clusters | grep -q "url-shortener"; then
    echo -e "${BLUE} Creating Kind cluster...${NC}"
    kind create cluster --name url-shortener
else
    echo -e "${GREEN}✅ Kind cluster exists${NC}"
fi

# Build images
echo -e "${CYAN} Building Docker images...${NC}"
docker build --no-cache -t url-shortener-backend:local ./backend
docker build --no-cache -t url-shortener-frontend:local ./frontend

# Load into Kind
echo -e "${CYAN} Loading images into Kind...${NC}"
kind load docker-image url-shortener-backend:local --name url-shortener
kind load docker-image url-shortener-frontend:local --name url-shortener

# Create namespace
echo -e "${BLUE} Creating namespace...${NC}"
kubectl create namespace url-shortener --dry-run=client -o yaml | kubectl apply -f -

# Create ConfigMap
echo -e "${BLUE}  Creating backend ConfigMap...${NC}"
kubectl create configmap backend-config \
  --from-literal=NODE_ENV=production \
  --from-literal=DB_HOST=postgres \
  --from-literal=DB_PORT=5432 \
  --from-literal=DB_NAME=urlshortener \
  --namespace=url-shortener \
  --dry-run=client -o yaml | kubectl apply -f -

# Step 1: Deploy PostgreSQL and WAIT
echo -e "${BLUE}  [1/4] Deploying PostgreSQL...${NC}"
kubectl apply -f kubernetes/postgres.yml
echo -e "${YELLOW} Waiting for PostgreSQL to be ready...${NC}"
kubectl wait --for=condition=ready --timeout=300s pod -l app=postgres -n url-shortener
echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
sleep 3

# Step 2: Deploy Backend and WAIT
echo -e "${BLUE} [2/4] Deploying Backend...${NC}"
kubectl apply -f kubernetes/backend-local.yml
echo -e "${YELLOW} Waiting for backend to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/backend -n url-shortener
echo -e "${GREEN}✅ Backend is ready!${NC}"
sleep 3

# Step 3: Deploy Frontend (it will wait for backend via init container)
echo -e "${BLUE}🌐 [3/4] Deploying Frontend...${NC}"
kubectl apply -f kubernetes/frontend-local.yml
echo -e "${YELLOW} Waiting for frontend to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n url-shortener
echo -e "${GREEN}✅ Frontend is ready!${NC}"

# Step 4: Deploy Monitoring
echo -e "${BLUE} [4/4] Deploying Monitoring...${NC}"
kubectl apply -f kubernetes/monitoring.yml

# Wait for everything
sleep 5

echo ""
echo -e "${GREEN}✅ All deployments complete!${NC}"
echo ""
echo -e "${CYAN} Final Status:${NC}"
kubectl get pods -n url-shortener
echo ""
kubectl get svc -n url-shortener
echo ""

echo -e "${PURPLE} Services:${NC}"
echo -e "  ${GREEN}Frontend:${NC}   http://localhost:3001 (nginx → backend)"
echo -e "  ${GREEN}Backend:${NC}    http://localhost:3000"
echo -e "  ${GREEN}Grafana:${NC}    http://localhost:3002"
echo -e "  ${GREEN}Prometheus:${NC} http://localhost:9090"
echo ""

echo -e "${YELLOW} Start port-forwards with:${NC}"
echo -e "  ./tmux-port-forward.sh"
echo ""

echo -e "${YELLOW} Check logs:${NC}"
echo -e "  kubectl logs -n url-shortener -l app=frontend -f"
echo -e "  kubectl logs -n url-shortener -l app=backend -f"
echo ""

echo -e "${RED}🗑️  Clean up:${NC} kind delete cluster --name url-shortener"