# XOD - Financial Advisor Client Management System

`xod` is a full-stack implementation of the Financial Advisor Client Management System with secure advisor login, client/security CRUD, PostgreSQL storage, Flyway migrations, and Dockerized one-command startup.

## Tech Stack

- **Frontend**: React.js (v18+) + Vite + Material UI (MUI) + Axios + React Router DOM + Recharts
- **Backend**: Spring Boot + Spring Security + JWT + JPA
- **Database**: PostgreSQL
- **Migration**: Flyway
- **Orchestration**: Docker Compose
- **Monitoring**: Docker logs, health checks, and application metrics

## 🎨 Front-End Features

### Responsive Design
- **Desktop**: Full sidebar navigation with data grids and complex tables
- **Tablet/Mobile**: Collapsible hamburger menu with card-based layouts
- **Theme**: Professional black and yellow color scheme for fintech aesthetics

### UI Components
- **Material UI**: Pre-built accessible components (Data Grids, Cards, Modals, Charts)
- **Charts**: Interactive pie charts and bar charts using Recharts
- **Navigation**: Responsive sidebar with smooth transitions
- **Forms**: Modal dialogs for client and security management
- **Data Tables**: Sortable, filterable grids with CRUD operations

## 🖥️ Front-End Screens

### Login Page
- Secure authentication with JWT
- Default credentials: `advisor@xod.local` / `password`
- Responsive design with black and yellow theme

### Dashboard
- **Summary Cards**: Total AUM, Client Count, Day Change, Total Return
- **Asset Allocation Chart**: Pie chart showing portfolio distribution
- **Recent Activity**: Timeline of recent client and security changes
- **Quick Actions**: Fast access to add clients and run reports

### Client Management
- **Desktop View**: Data grid with search, sort, and inline actions
- **Mobile View**: Card-based layout for better touch interaction
- **CRUD Operations**: Add, edit, delete, and view portfolio for each client

### Portfolio Details
- **Client Header**: Contact information and navigation
- **Portfolio Summary**: Value metrics and performance indicators
- **Holdings Table**: Detailed securities with current prices and P&L
- **Security Management**: Add/edit/delete individual holdings

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
- Create a new Supabase project at https://supabase.com
- Go to Project Settings → Database → Connection string
- Copy the URI and convert to JDBC format:
  ```
  jdbc:postgresql://db.[project-ref].supabase.co:5432/postgres?sslmode=require
  ```
- Note the database user (`postgres`) and password

#### 2. Backend Deployment (Render)
- Create a new Web Service at https://render.com
- **Repository**: Connect your GitHub repo
- **Root Directory**: `backend`
- **Environment**: Docker
- **Environment Variables**:
  ```env
  SPRING_DATASOURCE_URL=jdbc:postgresql://db.[your-project-ref].supabase.co:5432/postgres?sslmode=require
  SPRING_DATASOURCE_USERNAME=postgres
  SPRING_DATASOURCE_PASSWORD=[your-db-password]
  APP_JWT_SECRET=[generate-32-char-secret]
  APP_JWT_EXPIRATION_MS=28800000
  APP_CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
  ```
- Deploy and copy the backend URL (e.g., `https://xod-backend.onrender.com`)

#### 3. Frontend Deployment (Vercel)
- Go to https://vercel.com and create a new project
- Import your GitHub repository
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Environment Variables**:
  ```env
  VITE_API_BASE_URL=https://your-backend-url.onrender.com
  ```
- Deploy and get your frontend URL

#### 4. Update CORS (Backend)
- In your Render backend environment variables, update:
  ```env
  APP_CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
  ```

#### 5. Test the Deployment
- Open your Vercel frontend URL
- Login with: `advisor@xod.local` / `password`
- Verify all features work (client management, portfolio viewing, etc.)

## 🚀 Quick Deployment Checklist

### Prerequisites
- [ ] GitHub account with repository access
- [ ] Supabase account (https://supabase.com)
- [ ] Render account (https://render.com)
- [ ] Vercel account (https://vercel.com)

### Step-by-Step Deployment

1. **Fork/Clone this repository to your GitHub**

2. **Set up Supabase Database:**
   ```bash
   # Create project at supabase.com
   # Get connection details from Settings > Database
   ```

3. **Deploy Backend to Render:**
   - Connect GitHub repo to Render
   - Set root directory: `backend`
   - Copy environment variables from `backend/.env.example`
   - Update with your Supabase credentials
   - Deploy and note the URL

4. **Deploy Frontend to Vercel:**
   - Import project from GitHub
   - Set root directory: `frontend`
   - Add environment variable: `VITE_API_BASE_URL=https://your-render-backend-url`
   - Deploy and note the URL

5. **Update Backend CORS:**
   - In Render dashboard, update `APP_CORS_ALLOWED_ORIGINS` with your Vercel URL

6. **Test Everything Works:**
   - Visit your Vercel URL
   - Login and test all features

## �️ Development & Deployment Tools

### Local Testing with Production Setup
```bash
# Test production-like setup locally
docker compose -f docker-compose.prod.yml up --build
```

### Deployment Helper Script
```bash
# Run deployment preparation script
./deploy.sh
```
This script will:
- Check prerequisites
- Build the frontend for production
- Provide deployment checklist

### Environment Configuration
- **Frontend**: Copy `frontend/.env.example` to `frontend/.env`
- **Backend**: Copy `backend/.env.example` to `backend/.env`

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
