FROM node:20-alpine AS builder
<<<<<<< HEAD
=======
# Install curl for debugging and health checks
RUN apk add --no-cache curl

>>>>>>> 00bdbc0 (Advanced Visualization with Grafana)

# build stage
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./

# Use npm install so a package-lock.json is not required during image build
RUN npm install
COPY . .

RUN mkdir -p /usr/src/app/data && \
    chmod 755 /usr/src/app/data


RUN npm run build

FROM node:20-alpine AS runner
<<<<<<< HEAD
=======
RUN apk add --no-cache curl
>>>>>>> 00bdbc0 (Advanced Visualization with Grafana)
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
# Install production dependencies without requiring a lockfile
RUN npm install --omit=dev --no-audit --no-fund
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]