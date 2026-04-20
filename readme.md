# WEB Elevators

Мінімальний запуск через Docker.

## Quick Start

```bash
copy .env.example .env
copy backend\.env.example backend\.env
docker compose up --build -d
```

## URLs

- Frontend: http://localhost:8080
- Backend API: http://localhost:4000/api/status

## Stop

```bash
docker compose down
```

## Local Dev (optional)

```bash
npm install
cd backend && npm install
```