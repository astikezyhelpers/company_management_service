# Company Management Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-—-yellow)](#)

A modular, production-ready platform for managing company entities (companies, departments, employees, policies) with a modern observability stack. Designed for a polyglot microservices environment with a React/Angular frontend, Node.js primary backend, PostgreSQL database, optional message queues, and robust CI/CD.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Setup & Initialization](#setup--initialization)
  - [Local (Developer) Setup](#local-developer-setup)
  - [Docker Setup](#docker-setup)
  - [Kubernetes Setup](#kubernetes-setup)
- [Running the Project](#running-the-project)
- [Configuration](#configuration)
- [API Endpoints Overview](#api-endpoints-overview)
- [Testing & CI/CD](#testing--cicd)
- [Observability & Monitoring](#observability--monitoring)
  - [Metrics (Prometheus + Grafana)](#metrics-prometheus--grafana)
  - [Logs (Fluent Bit  Loki/Grafana or Elasticsearch/Kibana)](#logs-fluent-bit--lokigrafana-or-elasticsearchkibana)
  - [Tracing (OpenTelemetry + Tempo/Jaeger)](#tracing-opentelemetry--tempojaeger)
  - [Dashboards, Golden Signals, Alerts](#dashboards-golden-signals-alerts)
  - [Correlations: Logs  Traces  Metrics](#correlations-logs--traces--metrics)
- [Security](#security)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Architecture

```mermaid
flowchart LR
  subgraph Frontend
    A[Web App\n(React/Angular)]
  end

  subgraph Backends
    B[Company Management Service\n(Node.js + Express + Prisma)]
    C[Future Services\n(Java/Python - optional)]
  end

  A <-- REST/HTTPS --> B
  A <-- REST/HTTPS --> C

  subgraph Data Layer
    D[(PostgreSQL)]
    Q[(Message Queue\n(e.g., Kafka/RabbitMQ - optional))]
  end

  B <-- Prisma --> D
  B <-- Pub/Sub --> Q
  C <-- Pub/Sub --> Q

  subgraph Observability
    P[Prometheus]
    G[Grafana]
    L[Loki]
    T[Tempo]
    AM[Alertmanager]
    FB[Fluent Bit]
  end

  B -- /metrics --> P
  FB -- Docker Logs --> L
  B -- OTLP Traces --> T
  G -- Dashboards --> P & L & T
  AM -- Alerts --> Slack/Email
```

---

## Tech Stack

- Backend
  - Node.js, Express (`company_management_service`)
  - Prisma ORM, PostgreSQL
  - Optional: Additional services in Java/Python
- Frontend
  - React or Angular (assumed for the platform UI)
- Messaging (optional)
  - Kafka / RabbitMQ (if event-driven workflows are needed)
- Observability
  - Metrics: Prometheus
  - Dashboards: Grafana
  - Logs: Fluent Bit  Loki (default) or Elasticsearch
  - Tracing: OpenTelemetry SDK  Grafana Tempo (default) or Jaeger
  - Alerts: Alertmanager  Slack/Email
- CI/CD
  - GitHub Actions (example provided)

---

## Features

- Company, Department, Employee, Policy CRUD APIs
- JWT-based authentication
- Validation with Joi
- Centralized error handling
- Structured JSON logging with correlation and trace IDs
- Production-ready observability and dashboards
- Docker Compose stack; Kubernetes-ready

---

## Repository Structure

```
company_management_service/
 app.js
 server.js
 logger.js
 .env.sample
 controllers/
 routes/
   company.router.js
   company.employee.router.js
   company.policy.router.js
   company.department.router.js
 middleware/
   errorHandler.js
   metrics.js
   correlation.js
 db/
   db.js
 prisma/
 validations/
 tests/
 observability/
   otel.js
   prometheus/
     prometheus.yml
     alerting-rules.yml
   alertmanager/alertmanager.yml
   loki/config.yml
   tempo/config.yml
   fluent-bit/fluent-bit.conf
   grafana/
      datasources/datasources.yml
      dashboards/dashboards.yml
      json/golden-signals.json
 docker-compose.yml
```

---

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 13+ (local or managed)
- Optional: kubectl, Helm (for Kubernetes)
- A Slack Webhook or SMTP credentials (for alerts)

---

## Setup & Initialization

### Local (Developer) Setup

1. Clone and install dependencies:
   ```bash
   npm install
   ```

2. Copy and edit environment variables:
   ```bash
   cp .env.sample .env
   # edit .env for DATABASE_URL, JWT_*, and Observability vars if needed
   ```

3. Initialize database (example with Prisma):
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Start the service:
   ```bash
   npm run start
   # Service at http://localhost:3002
   # Metrics at http://localhost:3002/metrics
   ```

### Docker Setup

1. Ensure `.env` has all required vars (DB, JWT, Observability, Alertmanager).
2. Start the full stack:
   ```bash
   docker compose up -d
   ```
3. Access:
   - Service: http://localhost:3002
   - Metrics: http://localhost:3002/metrics
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000 (admin/admin)
   - Loki (via Grafana Explore)
   - Tempo (via Grafana Explore)
   - Alertmanager: http://localhost:9093

### Kubernetes Setup

Use if deploying to K8s instead of Docker Compose.

- Metrics/Alerts/Dashboards: Install kube-prometheus-stack via Helm
- Logs: Deploy Loki + Promtail (or Fluent Bit DaemonSet) via Helm
- Traces: Deploy Tempo (or Jaeger Operator)

Example high-level steps:
```bash
# Prometheus+Grafana+Alertmanager
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install obs prometheus-community/kube-prometheus-stack -n observability --create-namespace

# Loki
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki -n observability
helm install promtail grafana/promtail -n observability

# Tempo
helm install tempo grafana/tempo -n observability

# Company service manifests (Deployment, Service, Ingress)
kubectl apply -f k8s/company-service/
```

Provision Grafana datasources and dashboards via ConfigMaps or Helm values. Add a `ServiceMonitor` for scraping `/metrics` from the service.

---

## Running the Project

- Development (hot reload):
  ```bash
  npm run start
  ```
- Production (Docker):
  ```bash
  docker compose up -d
  ```
- Health:
  - Basic liveness: Add `/health` route if needed
  - Metrics: `/metrics` (Prometheus format)

---

## Configuration

Edit `.env` (see `.env.sample`):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/company_management_db"

# Server
PORT=3002
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
JWT_EXPIRES_IN="24h"

# Observability
OTEL_SERVICE_NAME=company-management-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://tempo:4318

# Alertmanager receivers
SLACK_WEBHOOK_URL=
ALERT_EMAIL_TO=
ALERT_EMAIL_FROM=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

---

## API Endpoints Overview

Base URL: `http://localhost:3002/api`

- Companies
  - `GET /company` – List companies
  - `POST /company` – Create company
  - `GET /company/:id` – Get company
  - `PUT /company/:id` – Update company
  - `DELETE /company/:id` – Delete company
- Employees
  - `GET /company/employ` – List employees
  - `POST /company/employ` – Create employee
  - `.../employ/:id` – Get/Update/Delete employee
- Policies
  - `GET /company/policy` – List policies
  - `POST /company/policy` – Create policy
  - `PUT /company/policy/update/:companyId/:policyId` – Update policy
- Departments
  - `GET /company/department` – List departments
  - `POST /company/department` – Create department
  - `.../department/:id` – Get/Update/Delete department

Authentication
- JWT in `Authorization: Bearer <token>`

Error Handling
- Centralized handler in `middleware/errorHandler.js`
- Standardized error format with `AppError`

---

## Testing & CI/CD

Run tests:
```bash
npm test
npm run test:watch
npm run test:coverage
```

Example GitHub Actions for observability deployment:
```yaml
name: deploy-observability
on:
  push:
    paths:
      - 'observability/**'
      - '.github/workflows/deploy-observability.yml'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SSH deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/company-service
            docker compose pull || true
            docker compose up -d
```

Recommended CI stages:
- Lint  Test  Build  Security Scan  Deploy
- Inject secrets for Alertmanager via CI variables

---

## Observability & Monitoring

This project ships with a ready-to-run stack under `observability/` and `docker-compose.yml`.

### Metrics (Prometheus + Grafana)

- App instruments metrics using `prom-client` and exposes `/metrics`:
  - Middleware: `middleware/metrics.js`
  - Default runtime metrics + custom HTTP histograms, error counters, inflight requests
- Prometheus config:
  - `observability/prometheus/prometheus.yml`
  - Scrapes `company-service:3002/metrics`
- Grafana dashboards:
  - Datasources: `observability/grafana/datasources/datasources.yml`
  - Dashboards: `observability/grafana/dashboards/dashboards.yml`
  - Golden Signals JSON: `observability/grafana/json/golden-signals.json`

Start with:
```bash
docker compose up -d
# Visit Grafana: http://localhost:3000 (admin/admin)
```

### Logs (Fluent Bit  Loki/Grafana or Elasticsearch/Kibana)

- App logs are structured JSON (Winston) with trace context:
  - `logger.js` attaches `trace_id` and `span_id`
  - Correlation ID middleware: `middleware/correlation.js` sets `x-correlation-id`
- Log shipping via Fluent Bit:
  - Config: `observability/fluent-bit/fluent-bit.conf` (tails Docker logs)
  - Default sink: Loki (`observability/loki/config.yml`)
  - View logs in Grafana Explore (datasource: Loki)
- Elasticsearch/Kibana alternative:
  - Replace the Loki output with ES output in Fluent Bit config:
    ```ini
    [OUTPUT]
        Name   es
        Match  *
        Host   elasticsearch
        Port   9200
        Index  company-logs
    ```
  - Deploy Elasticsearch + Kibana instead of Loki

### Tracing (OpenTelemetry + Tempo/Jaeger)

- OTel Bootstrap: `observability/otel.js`
  - Node auto-instrumentations (HTTP/Express/Prisma)
  - OTLP HTTP exporter  Tempo (`observability/tempo/config.yml`)
- Visualize in Grafana Explore (datasource: Tempo)
- Jaeger alternative:
  - Run Jaeger and set `OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger-collector:4318`

Enable on server start:
- `server.js` calls `startOtel()` before starting HTTP listener

### Dashboards, Golden Signals, Alerts

- Golden Signals dashboard JSON included (latency p95/p99, error rate, throughput, logs, traces)
- Prometheus alert rules:
  - `observability/prometheus/alerting-rules.yml`
  - Alerts: High error rate, high latency p95, instance down
- Alertmanager routes:
  - `observability/alertmanager/alertmanager.yml`
  - Slack (`SLACK_WEBHOOK_URL`) and Email (SMTP) supported

### Correlations: Logs  Traces  Metrics

- Logs include `trace_id` and `span_id` (from OTel context) and `x-correlation-id`
- Grafana Tempo + Loki integration:
  - From a trace, click View logs to pivot to Loki scoped by `trace_id`
  - From logs, link back to traces (derived fields in datasource config)
- Metrics-to-traces exemplars (optional):
  - Add OTel exemplars to histograms to jump from latency spikes to traces

---

## Security

- Store secrets in environment variables or secret managers (not in Git)
- Rotate JWT secrets regularly
- Use HTTPS in production with a reverse proxy (e.g., Nginx/Traefik)
- Enable RBAC for Kubernetes and restricted network policies
- Least-privilege DB roles; avoid superuser connections from app

---

## Contribution Guidelines

- Fork and create a feature branch
- Follow code style (ESLint + Prettier)
- Add/maintain tests (Jest)
- Update documentation where relevant
- Create a PR with a clear description and testing notes

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
