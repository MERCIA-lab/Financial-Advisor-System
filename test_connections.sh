#!/bin/bash
# XOD System - Database Connection Test
# Run this after setting up Render PostgreSQL

echo "=== XOD Database Connection Test ==="
echo ""

# Test Render PostgreSQL connection (if you have psql installed)
echo "1. Testing Render PostgreSQL connection..."
echo "   Command: psql 'postgresql://xod_user:[password]@[host]:5432/xod_prod'"
echo ""

# Test backend health (after deployment)
echo "2. Testing backend health..."
echo "   curl https://your-backend-service.onrender.com/actuator/health"
echo "   Expected: {\"status\":\"UP\",\"components\":{\"db\":{\"status\":\"UP\"}}}"
echo ""

# Test API endpoints (after full deployment)
echo "3. Testing API endpoints..."
echo "   curl -H 'Authorization: Bearer [your-jwt-token]' \\"
echo "        https://your-backend-service.onrender.com/api/clients"
echo ""

echo "=== Connection Details to Collect ==="
echo "• Render PostgreSQL External URL: postgresql://xod_user:..."
echo "• Render Backend URL: https://your-service.onrender.com"
echo "• Netlify Frontend URL: https://your-site.netlify.app"
echo ""
echo "=== Next Steps ==="
echo "1. Create Render PostgreSQL database"
echo "2. Get External Database URL"
echo "3. Update render_postgres_env.txt with your values"
echo "4. Deploy/update Render backend with new env vars"
echo "5. Deploy frontend to Netlify"
echo "6. Update CORS with Netlify URL"