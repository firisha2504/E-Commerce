-- Customer Management Enhancement Migration
-- Add customer status and VIP management fields

-- Add customer management fields to users table
ALTER TABLE users 
ADD COLUMN customer_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
ADD COLUMN customer_type ENUM('regular', 'vip', 'premium') DEFAULT 'regular',
ADD COLUMN total_orders INT DEFAULT 0,
ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN last_order_date TIMESTAMP NULL,
ADD COLUMN loyalty_points INT DEFAULT 0,
ADD COLUMN registration_source VARCHAR(50) DEFAULT 'website',
ADD COLUMN notes TEXT NULL;

-- Create customer activity log table
CREATE TABLE customer_activity_log (
    log_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    performed_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (performed_by) REFERENCES users(user_id)
);

-- Create customer rewards table
CREATE TABLE customer_rewards (
    reward_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    reward_type VARCHAR(50) NOT NULL,
    points_earned INT DEFAULT 0,
    points_used INT DEFAULT 0,
    order_id VARCHAR(36) NULL,
    description TEXT,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Create VIP benefits table
CREATE TABLE vip_benefits (
    benefit_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_type ENUM('regular', 'vip', 'premium') NOT NULL,
    benefit_name VARCHAR(100) NOT NULL,
    benefit_description TEXT,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    free_delivery BOOLEAN DEFAULT FALSE,
    priority_support BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default VIP benefits
INSERT INTO vip_benefits (customer_type, benefit_name, benefit_description, discount_percentage, free_delivery, priority_support) VALUES
('regular', 'Standard Service', 'Regular customer benefits', 0.00, FALSE, FALSE),
('vip', 'VIP Discount', '10% discount on all orders', 10.00, TRUE, TRUE),
('premium', 'Premium Benefits', '15% discount + exclusive menu items', 15.00, TRUE, TRUE);

-- Create indexes for better performance
CREATE INDEX idx_users_customer_status ON users(customer_status);
CREATE INDEX idx_users_customer_type ON users(customer_type);
CREATE INDEX idx_users_total_spent ON users(total_spent);
CREATE INDEX idx_customer_activity_user ON customer_activity_log(user_id);
CREATE INDEX idx_customer_rewards_user ON customer_rewards(user_id);

-- Create trigger to update customer stats when order is completed
DELIMITER //
CREATE TRIGGER update_customer_stats_after_order
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status = 'delivered' AND OLD.order_status != 'delivered' THEN
        UPDATE users 
        SET 
            total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount,
            last_order_date = NOW(),
            loyalty_points = loyalty_points + FLOOR(NEW.total_amount / 10)
        WHERE user_id = NEW.user_id;
        
        -- Auto-promote to VIP if spent over $500
        UPDATE users 
        SET customer_type = 'vip'
        WHERE user_id = NEW.user_id 
        AND total_spent >= 500 
        AND customer_type = 'regular';
        
        -- Auto-promote to Premium if spent over $1000
        UPDATE users 
        SET customer_type = 'premium'
        WHERE user_id = NEW.user_id 
        AND total_spent >= 1000 
        AND customer_type IN ('regular', 'vip');
    END IF;
END//
DELIMITER ;