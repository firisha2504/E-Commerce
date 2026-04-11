# FA Restaurant - Deployment Guide

## Production Deployment

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Domain name and SSL certificate
- Cloud storage for images (AWS S3, Cloudinary, etc.)

### Environment Setup

1. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb fa_restaurant_prod
   
   # Run migrations
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Environment Variables**
   ```bash
   # Copy and configure environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Update with production values
   DATABASE_URL="postgresql://user:pass@host:5432/fa_restaurant_prod"
   JWT_SECRET="your-production-jwt-secret"
   REDIS_URL="redis://your-redis-host:6379"
   ```

### Docker Deployment

1. **Build and Run with Docker Compose**
   ```bash
   # Build all services
   docker-compose -f docker-compose.prod.yml build
   
   # Start services
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Docker Compose Configuration**
   ```yaml
   version: '3.8'
   services:
     frontend:
       build:
         context: ./frontend
         dockerfile: Dockerfile.prod
       ports:
         - "80:80"
         - "443:443"
       depends_on:
         - backend
   
     backend:
       build:
         context: ./backend
         dockerfile: Dockerfile.prod
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
       depends_on:
         - postgres
         - redis
   
     postgres:
       image: postgres:14
       environment:
         POSTGRES_DB: fa_restaurant
         POSTGRES_USER: ${DB_USER}
         POSTGRES_PASSWORD: ${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
     redis:
       image: redis:6-alpine
       volumes:
         - redis_data:/data
   
   volumes:
     postgres_data:
     redis_data:
   ```

### Cloud Deployment Options

#### 1. AWS Deployment

**Services Used:**
- EC2 for application hosting
- RDS for PostgreSQL
- ElastiCache for Redis
- S3 for file storage
- CloudFront for CDN
- Route 53 for DNS

**Steps:**
1. Launch EC2 instances
2. Set up RDS PostgreSQL instance
3. Configure ElastiCache Redis
4. Deploy application using PM2 or Docker
5. Set up load balancer and auto-scaling

#### 2. Heroku Deployment

```bash
# Install Heroku CLI and login
heroku login

# Create applications
heroku create fa-restaurant-api
heroku create fa-restaurant-web

# Add PostgreSQL and Redis
heroku addons:create heroku-postgresql:hobby-dev -a fa-restaurant-api
heroku addons:create heroku-redis:hobby-dev -a fa-restaurant-api

# Deploy backend
cd backend
git init
heroku git:remote -a fa-restaurant-api
git add .
git commit -m "Initial deployment"
git push heroku main

# Deploy frontend
cd ../frontend
# Update API URL in environment
echo "VITE_API_URL=https://fa-restaurant-api.herokuapp.com/api" > .env.production
npm run build
# Deploy to Netlify or Vercel
```

#### 3. DigitalOcean App Platform

```yaml
# app.yaml
name: fa-restaurant
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/fa-restaurant
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    scope: RUN_TIME
    value: ${db.DATABASE_URL}
  - key: JWT_SECRET
    scope: RUN_TIME
    value: ${JWT_SECRET}

- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/fa-restaurant
    branch: main
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: db
  engine: PG
  version: "14"
  size: basic-xs
```

### Performance Optimization

1. **Database Optimization**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX CONCURRENTLY idx_orders_user_date ON orders(user_id, order_date DESC);
   CREATE INDEX CONCURRENTLY idx_products_category_available ON products(category_id, is_available);
   CREATE INDEX CONCURRENTLY idx_order_items_order ON order_items(order_id);
   ```

2. **Caching Strategy**
   ```javascript
   // Redis caching for frequently accessed data
   const cacheKey = `products:category:${categoryId}`;
   const cached = await redis.get(cacheKey);
   
   if (cached) {
     return JSON.parse(cached);
   }
   
   const products = await prisma.product.findMany({...});
   await redis.setex(cacheKey, 300, JSON.stringify(products)); // 5 min cache
   ```

3. **CDN Configuration**
   - Use CloudFront or similar CDN for static assets
   - Enable gzip compression
   - Set appropriate cache headers
   - Optimize images (WebP format, responsive sizes)

### Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS protection headers
- [ ] Regular security updates

### Monitoring and Logging

1. **Application Monitoring**
   ```javascript
   // Add monitoring middleware
   app.use((req, res, next) => {
     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
     next();
   });
   ```

2. **Error Tracking**
   - Integrate Sentry for error tracking
   - Set up log aggregation (ELK stack or similar)
   - Monitor database performance
   - Set up alerts for critical errors

3. **Health Checks**
   ```javascript
   app.get('/health', async (req, res) => {
     try {
       await prisma.$queryRaw`SELECT 1`;
       await redis.ping();
       res.json({ status: 'healthy', timestamp: new Date().toISOString() });
     } catch (error) {
       res.status(503).json({ status: 'unhealthy', error: error.message });
     }
   });
   ```

### Backup Strategy

1. **Database Backups**
   ```bash
   # Automated daily backups
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   
   # Upload to cloud storage
   aws s3 cp backup_$(date +%Y%m%d).sql s3://your-backup-bucket/
   ```

2. **File Backups**
   - Regular backups of uploaded images
   - Version control for code
   - Configuration backups

### Scaling Considerations

1. **Horizontal Scaling**
   - Load balancer configuration
   - Session management with Redis
   - Database read replicas
   - Microservices architecture

2. **Vertical Scaling**
   - Monitor resource usage
   - Optimize database queries
   - Implement caching layers
   - Use connection pooling

### Post-Deployment Tasks

1. **Initial Data Setup**
   ```bash
   # Seed initial data
   npm run db:seed
   
   # Create admin user
   npm run create-admin
   ```

2. **Testing**
   - Run end-to-end tests
   - Performance testing
   - Security testing
   - User acceptance testing

3. **Documentation**
   - API documentation
   - User manuals
   - Admin guides
   - Troubleshooting guides