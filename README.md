# XOD - Financial Advisor Client Management System

`xod` is a full-stack implementation of the 'Financial Advisor Client Management System' with secure advisor login, client/security CRUD, PostgreSQL storage, Flyway migrations, and Dockerized one-command startup.

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
  (The frontend will normalize this to include `/api` automatically.)
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

## 🚀 Production Launch Plan

### Phase 1: Preparation & Planning
✅ **Completed:**
- Responsive React frontend with Material UI black/yellow theme
- Spring Boot backend with JWT authentication
- PostgreSQL database with Flyway migrations
- Docker containerization with docker-compose
- Testing framework setup (Jest, Cypress, JUnit)
- Monitoring stack (Prometheus, Grafana)
- CI/CD deployment configurations

### Phase 2: Infrastructure Setup
**Tasks:**
- [ ] **Supabase Database**:
  - Create production project at https://supabase.com
  - Configure connection pooling
  - Set up automated backups
  - Enable Row Level Security (RLS)

- [ ] **Render Backend Deployment**:
  - Navigate to https://render.com
  - Connect GitHub repository
  - Configure environment variables from `backend/.env.example`
  - Set up health checks and auto-scaling

- [ ] **Vercel Frontend Deployment**:
  - Navigate to https://vercel.com
  - Import project from GitHub
  - Set root directory: `frontend`
  - Configure `VITE_API_BASE_URL` environment variable

### Phase 3: Security & Compliance
**Implementation:**
- SSL/TLS certificates (Let's Encrypt or AWS ACM)
- HTTPS redirect and security headers
- Data encryption at rest and in transit
- Audit logging and compliance monitoring
- Rate limiting and DDoS protection

### Phase 4: Testing & Validation
**Test Suites:**
- **Unit Tests**: Jest for components, JUnit for services
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Cypress for critical user workflows
- **Performance Tests**: Load testing with JMeter
- **Security Tests**: OWASP ZAP vulnerability scanning

### Phase 5: Launch & Post-Launch
**Go-Live Checklist:**
- [ ] Final smoke tests
- [ ] Database migration verification
- [ ] DNS records updated
- [ ] Monitoring alerts configured
- [ ] Incident response team ready
- [ ] User notification plan executed

**Post-Launch Activities:**
- Real-time monitoring with Grafana dashboards
- Daily performance reviews
- Quick response to critical issues
- User feedback collection
- A/B testing for UI improvements
- Regular security patches

## 📊 Key Performance Indicators

### Frontend Metrics
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds
- Lighthouse score: > 90
- Accessibility score: 100% (WCAG 2.1 AA)

### Backend Metrics
- API response time: < 100ms (p95)
- Error rate: < 0.1%
- Availability: 99.9% uptime
- Database query time: < 50ms

### System Capacity
- Concurrent users supported: 1000+
- Requests per second: 1000+
- Data transfer: < 500Mbps
- Storage utilization: < 80%

## 📈 Scaling Strategy

### Horizontal Scaling
```yaml
# Scale backend
docker service scale backend=3

# Scale frontend
docker service scale frontend=2

# Load balancing
# Use Nginx or AWS ALB
```

### Vertical Scaling
- Increase JVM heap size for backend
- Upgrade database instance type
- Add more CPU/RAM to servers

### Caching Strategy
- Redis for session management
- CloudFlare for static asset caching
- Browser caching for frontend assets

## 🔒 Security Best Practices

### Authentication & Authorization
- JWT tokens with 8-hour expiration
- Refresh token rotation
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) ready

### Data Protection
- End-to-end encryption for sensitive data
- Parameterized queries to prevent SQL injection
- Input validation and sanitization
- Output encoding for XSS prevention

### Infrastructure Security
- VPC with private subnets
- Security groups for network isolation
- Web Application Firewall (WAF)
- Regular security audits and penetration testing

## 📞 Monitoring & Alerts

### Prometheus Metrics
```yaml
# Backend metrics
- http_requests_total
- http_request_duration_seconds
- jvm_memory_used_bytes

# Database metrics
- pg_connections
- pg_transaction_duration
- pg_cache_hit_ratio
```

### Grafana Dashboards
- System Overview (CPU, Memory, Disk)
- API Performance (Response times, Error rates)
- Database Health (Connections, Queries)
- User Activity (Login trends, Feature usage)

### Alert Conditions
- High error rate (> 1%)
- Slow response times (> 500ms)
- Low disk space (< 10%)
- Database connection pool exhausted
- Memory usage critical (> 90%)

## 🛠️ Maintenance & Updates

### Regular Tasks
- Daily: Check monitoring dashboards
- Weekly: Review error logs and performance metrics
- Monthly: Database optimization and cleanup
- Quarterly: Security patches and dependency updates

### Backup Strategy
- Daily automated backups to S3
- Point-in-time recovery capability
- Backup integrity verification
- Disaster recovery drills

### Zero-Downtime Deployments
- Blue-green deployment strategy
- Database migration scripts
- Feature flags for gradual rollouts
- Automated rollback capability

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Spring Boot Guide](https://spring.io/guides/gs/spring-boot/)
- [Material UI Documentation](https://mui.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Prometheus Documentation](https://prometheus.io/docs)
- [Grafana Documentation](https://grafana.com/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
