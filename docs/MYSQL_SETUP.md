# MySQL Setup Guide for FA Restaurant

## Prerequisites

- **MySQL Server** (v8.0 or higher recommended)
- **Node.js** (v18 or higher)
- **npm** or **yarn**

## MySQL Installation

### Windows

1. **Download MySQL Installer:**
   - Visit https://dev.mysql.com/downloads/installer/
   - Download MySQL Installer for Windows

2. **Install MySQL:**
   - Run the installer
   - Choose "Developer Default" setup type
   - Set root password (remember this!)
   - Complete the installation

3. **Verify Installation:**
   ```cmd
   mysql --version
   ```

### macOS

1. **Using Homebrew:**
   ```bash
   brew install mysql
   brew services start mysql
   ```

2. **Secure Installation:**
   ```bash
   mysql_secure_installation
   ```

### Ubuntu/Linux

1. **Install MySQL:**
   ```bash
   sudo apt update
   sudo apt install mysql-server
   ```

2. **Secure Installation:**
   ```bash
   sudo mysql_secure_installation
   ```

## Database Setup

### 1. Create Database

```bash
# Connect to MySQL as root
mysql -u root -p

# Create database
CREATE DATABASE fa_restaurant;

# Create user (optional but recommended)
CREATE USER 'fa_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON fa_restaurant.* TO 'fa_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### 2. Configure Environment Variables

Create `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=fa_user
DB_PASSWORD=your_secure_password
DB_NAME=fa_restaurant
DB_PORT=3306

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Other configurations...
```

### 3. Run Migrations

```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

## Database Schema Overview

### Core Tables

1. **users** - User accounts and authentication
2. **categories** - Product categories (Food, Beverages)
3. **products** - Menu items with customization options
4. **orders** - Customer orders with status tracking
5. **order_items** - Individual items within orders
6. **payments** - Payment records and status
7. **feedback** - Customer reviews and ratings
8. **user_favorites** - Favorite products tracking
9. **cart_items** - Persistent shopping cart
10. **delivery_personnel** - Delivery staff management
11. **order_deliveries** - Delivery assignments

### Key Features

- **UUID Primary Keys** - Using VARCHAR(36) for better compatibility
- **JSON Support** - For customization options and flexible data
- **Proper Indexing** - Optimized for common queries
- **Foreign Key Constraints** - Data integrity enforcement
- **Auto-updating Timestamps** - MySQL ON UPDATE CURRENT_TIMESTAMP

## Common MySQL Commands

### Database Management

```sql
-- Show all databases
SHOW DATABASES;

-- Use specific database
USE fa_restaurant;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- Show table creation SQL
SHOW CREATE TABLE products;
```

### Data Queries

```sql
-- View all users
SELECT * FROM users;

-- View products with categories
SELECT p.name, p.price, c.name as category 
FROM products p 
JOIN categories c ON p.category_id = c.category_id;

-- View recent orders
SELECT o.order_id, u.name, o.total_amount, o.order_status 
FROM orders o 
JOIN users u ON o.user_id = u.user_id 
ORDER BY o.created_at DESC 
LIMIT 10;
```

### Maintenance

```sql
-- Check table sizes
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'fa_restaurant'
ORDER BY (data_length + index_length) DESC;

-- Optimize tables
OPTIMIZE TABLE users, products, orders;

-- Check for unused indexes
SELECT * FROM sys.schema_unused_indexes WHERE object_schema = 'fa_restaurant';
```

## Backup and Restore

### Create Backup

```bash
# Full database backup
mysqldump -u fa_user -p fa_restaurant > fa_restaurant_backup.sql

# Backup with compression
mysqldump -u fa_user -p fa_restaurant | gzip > fa_restaurant_backup.sql.gz

# Backup specific tables
mysqldump -u fa_user -p fa_restaurant users products orders > partial_backup.sql
```

### Restore Backup

```bash
# Restore from backup
mysql -u fa_user -p fa_restaurant < fa_restaurant_backup.sql

# Restore from compressed backup
gunzip < fa_restaurant_backup.sql.gz | mysql -u fa_user -p fa_restaurant
```

## Performance Optimization

### 1. Index Optimization

```sql
-- Check index usage
SELECT * FROM sys.schema_index_statistics WHERE table_schema = 'fa_restaurant';

-- Add custom indexes if needed
CREATE INDEX idx_orders_date_status ON orders(order_date, order_status);
CREATE INDEX idx_products_name_search ON products(name);
```

### 2. Query Optimization

```sql
-- Enable query profiling
SET profiling = 1;

-- Run your queries
SELECT * FROM products WHERE name LIKE '%doro%';

-- View query performance
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;
```

### 3. Configuration Tuning

Add to MySQL configuration file (`my.cnf` or `my.ini`):

```ini
[mysqld]
# Buffer pool size (set to 70-80% of available RAM)
innodb_buffer_pool_size = 1G

# Query cache
query_cache_type = 1
query_cache_size = 256M

# Connection settings
max_connections = 200
wait_timeout = 600

# Logging
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if MySQL is running
   sudo systemctl status mysql
   
   # Start MySQL service
   sudo systemctl start mysql
   ```

2. **Access Denied**
   ```bash
   # Reset root password
   sudo mysql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
   FLUSH PRIVILEGES;
   ```

3. **Table Doesn't Exist**
   ```bash
   # Run migrations again
   npm run db:migrate
   ```

4. **JSON Column Issues**
   - Ensure MySQL version 5.7+ for JSON support
   - Use proper JSON syntax in queries

### Monitoring

```sql
-- Check current connections
SHOW PROCESSLIST;

-- View database status
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Queries';

-- Check for locked tables
SHOW OPEN TABLES WHERE In_use > 0;
```

## Security Best Practices

1. **User Management**
   ```sql
   -- Create application-specific user
   CREATE USER 'fa_app'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON fa_restaurant.* TO 'fa_app'@'localhost';
   
   -- Remove unnecessary privileges
   REVOKE ALL PRIVILEGES ON *.* FROM 'fa_app'@'localhost';
   ```

2. **Network Security**
   - Use SSL connections in production
   - Restrict MySQL to localhost if possible
   - Use firewall rules to limit access

3. **Data Protection**
   - Regular backups
   - Encrypt sensitive data
   - Use prepared statements (already implemented in our code)

## Development vs Production

### Development Setup
- Use root user for simplicity
- Enable query logging
- Smaller buffer sizes

### Production Setup
- Dedicated MySQL user with minimal privileges
- Optimized configuration
- Regular monitoring and backups
- SSL encryption
- Connection pooling (already implemented)

This setup provides a robust MySQL foundation for the FA Restaurant e-commerce platform with proper security, performance, and maintainability considerations.