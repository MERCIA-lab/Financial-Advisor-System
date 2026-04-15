# XOD - Financial Advisor Client Management System

`xod` is a full-stack implementation of the Financial Advisor Client Management System with secure advisor login, client/security CRUD, PostgreSQL storage, Flyway migrations, and Dockerized one-command startup.

## Tech Stack

- **Frontend**: React + Vite + Nginx
- **Backend**: Spring Boot + Spring Security + JWT + JPA
- **Database**: PostgreSQL
- **Migration**: Flyway
- **Orchestration**: Docker Compose
- **Monitoring**: Docker logs, health checks, and application metrics

## Features Implemented

- ✅ Advisor authentication with JWT
- ✅ Authorization scoped to advisor-owned clients and securities
- ✅ Client CRUD including update form
- ✅ Security CRUD including update form
- ✅ Automatic one-to-one portfolio creation when a client is created
- ✅ Business-hours guard on write APIs (Mon-Fri, 09:00-17:00)
- ✅ Foreign keys + indexes aligned with ERD
- ✅ Flyway migration-based schema management

## Quick Start

### Default Login Credentials
- **Email**: `advisor@xod.local`
- **Password**: `password`

### One-Command Run
From the `xod` directory:
```bash
docker compose up --build
```

Then open: `http://localhost:5173`

## Monitoring & Health Checks

### Application Health
Check if all services are running:
```bash
docker compose ps
```

### Service Health Endpoints
- **Backend Health**: `http://localhost:8080/actuator/health`
- **Frontend Health**: `http://localhost:5173` (check if page loads)

### Logs Monitoring
View real-time logs for all services:
```bash
docker compose logs -f
```

View logs for specific service:
```bash
# Backend logs
docker compose logs -f backend

# Frontend logs
docker compose logs -f frontend

# Database logs
docker compose logs -f db
```

### Resource Usage Monitoring
Monitor container resource usage:
```bash
docker stats
```

### Database Monitoring
Connect to PostgreSQL database:
```bash
docker compose exec db psql -U xod_user -d xod_db
```

Check database size and connections:
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('xod_db'));

-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Deployment Options

### Local Development
1. **Docker (Recommended)**:
   ```bash
   docker compose up --build
   ```

2. **Manual Setup**:
   - **Backend**: `cd backend && mvn spring-boot:run`
   - **Frontend**: `cd frontend && npm install && npm run dev`
   - **Database**: Ensure PostgreSQL is running locally

### Production Deployment (Supabase + Render + Vercel)

#### 1. Database Setup (Supabase)
- Create Supabase project
- Get connection string: `Project Settings -> Database -> Connection string`
- Convert to JDBC: `jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require`

#### 2. Backend Deployment (Render)
- Create Web Service from this repo
- **Root directory**: `backend`
- **Environment**: Docker
- **Environment Variables**:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `APP_JWT_SECRET`
  - `APP_JWT_EXPIRATION_MS`
  - `APP_CORS_ALLOWED_ORIGINS`

#### 3. Frontend Deployment (Vercel)
- Import `frontend` directory
- **Environment Variable**: `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

## API Documentation

### Authentication
- `POST /api/auth/login` - Advisor login

### Clients Management
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/{clientId}` - Update client
- `DELETE /api/clients/{clientId}` - Delete client

### Securities Management
- `GET /api/clients/{clientId}/securities` - List client securities
- `POST /api/clients/{clientId}/securities` - Add security to client
- `PUT /api/clients/securities/{securityId}` - Update security
- `DELETE /api/clients/securities/{securityId}` - Delete security

## Troubleshooting

### Common Issues

**Port Conflicts**:
```bash
# Check what's using ports 8080, 5432, 5173
lsof -i :8080
lsof -i :5432
lsof -i :5173
```

**Database Connection Issues**:
```bash
# Restart database
docker compose restart db

# Check database logs
docker compose logs db
```

**Build Failures**:
```bash
# Clean and rebuild
docker compose down -v
docker compose up --build --force-recreate
```

**Memory Issues**:
```bash
# Increase Docker memory limit or check system resources
docker system df
```

### Performance Monitoring

**Application Metrics** (Spring Boot Actuator):
- `http://localhost:8080/actuator/metrics`
- `http://localhost:8080/actuator/info`

**Database Performance**:
```sql
-- Slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Development

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local backend development)
- Node.js 18+ (for local frontend development)
- Maven (for backend builds)

### Project Structure
```
xod/
├── backend/          # Spring Boot application
├── frontend/         # React application
├── docker-compose.yml # Multi-service orchestration
└── README.md         # This file
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
