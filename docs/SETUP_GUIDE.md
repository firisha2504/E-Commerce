# FA Restaurant - Setup Guide

## Prerequisites

Before setting up the FA Restaurant e-commerce platform, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fa-restaurant.git
cd fa-restaurant
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 3. Environment Setup

#### Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fa_restaurant"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Email Configuration (optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

#### Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Create MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE fa_restaurant;

# Create user (optional)
CREATE USER 'fa_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON fa_restaurant.* TO 'fa_user'@'localhost';

# Exit MySQL
\q
```

#### Run Database Migrations

```bash
cd backend

# Generate database schema
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 5. Start Development Servers

#### Option 1: Start All Services Together

```bash
# From the root directory
npm run dev
```

#### Option 2: Start Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## Default Credentials

After seeding the database, you can use these credentials:

### Admin Account
- **Email:** admin@farestaurant.com
- **Password:** admin123

### Customer Account
- **Email:** customer@example.com
- **Password:** customer123

## Project Structure

```
fa-restaurant/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── server.ts       # Main server file
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main app component
│   └── package.json
├── database/               # Database documentation
│   └── schema.sql          # Raw SQL schema
├── docs/                   # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT.md
│   └── SETUP_GUIDE.md
└── package.json            # Root package.json
```

## Development Workflow

### Database Changes

When making database schema changes:

1. Update `backend/prisma/schema.prisma`
2. Create and apply migration:
   ```bash
   cd backend
   npx prisma migrate dev --name your_migration_name
   ```
3. Generate new Prisma client:
   ```bash
   npx prisma generate
   ```

### Adding New Features

1. **Backend API:**
   - Add routes in `backend/src/routes/`
   - Add middleware if needed
   - Update API documentation

2. **Frontend:**
   - Add components in `frontend/src/components/`
   - Add pages in `frontend/src/pages/`
   - Update API services in `frontend/src/services/`

### Testing

#### Backend Testing

```bash
cd backend
npm test
```

#### Frontend Testing

```bash
cd frontend
npm test
```

#### End-to-End Testing

```bash
npm run test:e2e
```

## Common Issues and Solutions

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL
**Solution:**
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists
4. Check firewall settings

### Port Already in Use

**Problem:** Port 3000 or 5000 already in use
**Solution:**
1. Kill existing processes:
   ```bash
   # Find process using port
   lsof -i :3000
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```
2. Or change ports in configuration files

### Redis Connection Issues

**Problem:** Cannot connect to Redis
**Solution:**
1. Install and start Redis:
   ```bash
   # macOS with Homebrew
   brew install redis
   brew services start redis
   
   # Ubuntu/Debian
   sudo apt install redis-server
   sudo systemctl start redis-server
   
   # Windows
   # Download and install Redis from official website
   ```

### Prisma Issues

**Problem:** Prisma client out of sync
**Solution:**
```bash
cd backend
npx prisma generate
npx prisma db push
```

**Problem:** Migration conflicts
**Solution:**
```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

## Environment-Specific Setup

### Development Environment

- Use local PostgreSQL and Redis
- Enable detailed logging
- Hot reloading enabled
- CORS configured for localhost

### Production Environment

- Use managed database services
- Enable compression and caching
- Configure proper CORS origins
- Set up monitoring and logging
- Use environment variables for secrets

## Additional Tools

### Database Management

**Prisma Studio** - Visual database browser:
```bash
cd backend
npx prisma studio
```

**pgAdmin** - PostgreSQL administration tool
- Download from https://www.pgadmin.org/

### API Testing

**Postman Collection:**
- Import the API collection from `docs/postman_collection.json`

**curl Examples:**
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+251911234567","password":"password123"}'

# Get products
curl http://localhost:5000/api/products
```

## Performance Optimization

### Development

- Use React DevTools for component debugging
- Enable Redux DevTools for state management
- Use browser performance tools

### Production

- Enable gzip compression
- Use CDN for static assets
- Implement database query optimization
- Set up caching strategies

## Security Considerations

### Development

- Use HTTPS in production
- Validate all inputs
- Implement rate limiting
- Use secure JWT secrets
- Regular dependency updates

### Production

- Environment variable security
- Database connection security
- API authentication and authorization
- Regular security audits

## Getting Help

### Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Database Schema](../database/schema.sql)

### Community

- GitHub Issues: Report bugs and feature requests
- Discussions: Ask questions and share ideas

### Support

For technical support, please:
1. Check this documentation
2. Search existing GitHub issues
3. Create a new issue with detailed information

## Next Steps

After successful setup:

1. **Explore the Application:**
   - Browse the menu
   - Create test orders
   - Try the admin panel

2. **Customize for Your Needs:**
   - Update branding and colors
   - Modify menu categories
   - Configure payment methods

3. **Deploy to Production:**
   - Follow the [Deployment Guide](./DEPLOYMENT.md)
   - Set up monitoring and backups
   - Configure domain and SSL

4. **Add Advanced Features:**
   - Real-time order tracking
   - Push notifications
   - Advanced analytics
   - Multi-language support