# XOD - Financial Advisor Client Management System

`xod` is a full-stack implementation of the Financial Advisor Client Management System with secure advisor login, client/security CRUD, PostgreSQL storage, Flyway migrations, and Dockerized one-command startup.

## Tech Stack

- Frontend: React + Vite + Nginx
- Backend: Spring Boot + Spring Security + JWT + JPA
- Database: PostgreSQL
- Migration: Flyway
- Orchestration: Docker Compose

## Features Implemented

- Advisor authentication with JWT
- Authorization scoped to advisor-owned clients and securities
- Client CRUD including update form
- Security CRUD including update form
- Automatic one-to-one portfolio creation when a client is created
- Business-hours guard on write APIs (Mon-Fri, 09:00-17:00)
- Foreign keys + indexes aligned with ERD
- Flyway migration-based schema management

## Default Login

- Email: `advisor@xod.local`
- Password: `password`

## Run (One Command)

From the `xod` directory:

- `docker compose up --build`

Then open: `http://localhost:5173`

## Deploy With Supabase + Render + Vercel

Use this flow to connect your own Supabase account and host quickly.

### 1) Create Supabase Postgres connection

- In Supabase: open `Project Settings -> Database -> Connection string`
- Copy the URI and convert it to JDBC format:
  - `jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require`
- Keep:
  - DB user (`postgres` by default)
  - DB password

### 2) Deploy backend to Render

- Create a new Web Service from this repo
- Service root: `backend`
- Environment: Docker
- Set env vars from `backend/.env.example`:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `APP_JWT_SECRET`
  - `APP_JWT_EXPIRATION_MS`
  - `APP_CORS_ALLOWED_ORIGINS` (set to your Vercel frontend URL)
- Deploy and copy backend URL, e.g. `https://xod-backend.onrender.com`

### 3) Deploy frontend to Vercel

- Import `frontend` as a Vercel project
- Set env var:
  - `VITE_API_BASE_URL=https://xod-backend.onrender.com/api`
- Deploy and open the frontend URL

### 4) Login and preview

- Open your Vercel URL
- Login with:
  - `advisor@xod.local`
  - `password`
- You can now preview the hosted design and full workflow.

## Local Non-Docker Run

### Backend

- `cd backend`
- Ensure PostgreSQL is running and accessible
- `mvn spring-boot:run`

### Frontend

- `cd frontend`
- `npm install`
- `npm run dev`

## API Summary

- Auth:
  - `POST /api/auth/login`

- Clients:
  - `GET /api/clients`
  - `POST /api/clients`
  - `PUT /api/clients/{clientId}`
  - `DELETE /api/clients/{clientId}`

- Securities:
  - `GET /api/clients/{clientId}/securities`
  - `POST /api/clients/{clientId}/securities`
  - `PUT /api/clients/securities/{securityId}`
  - `DELETE /api/clients/securities/{securityId}`
