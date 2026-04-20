const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// ─── Dashboard Analytics ────────────────────────────────────────────────────
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const [productCount] = await query('SELECT COUNT(*) as count FROM products WHERE is_available = true');
    const [customerCount] = await query('SELECT COUNT(*) as count FROM users WHERE is_admin = false');
    const [orderCount] = await query('SELECT COUNT(*) as count FROM orders');
    const [revenue] = await query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE order_status = "delivered"');

    res.json({
      stats: {
        totalProducts: productCount.count,
        totalCustomers: customerCount.count,
        totalOrders: orderCount.count,
        totalRevenue: revenue.total,
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Products ────────────────────────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category && category !== 'all') {
      whereClause += ' AND c.name = ?';
      params.push(category);
    }

    const products = await query(`
      SELECT
        p.product_id as id,
        p.name,
        p.description,
        p.price,
        p.image_url as imageUrl,
        p.is_available as isAvailable,
        p.created_at as createdAt,
        c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ${whereClause}
      ORDER BY p.created_at DESC
    `, params);

    res.json({ products });
  } catch (error) {
    console.error('Admin products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, isAvailable = true } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Resolve category id
    let categoryId = null;
    if (category) {
      const cat = await queryOne('SELECT category_id FROM categories WHERE name = ?', [category]);
      if (cat) categoryId = cat.category_id;
    }

    const productId = uuidv4();
    await query(
      `INSERT INTO products (product_id, name, description, price, image_url, category_id, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [productId, name, description || '', parseFloat(price), imageUrl || null, categoryId, isAvailable ? 1 : 0]
    );

    const product = await queryOne(
      `SELECT p.product_id as id, p.name, p.description, p.price, p.image_url as imageUrl,
              p.is_available as isAvailable, c.name as category
       FROM products p LEFT JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [productId]
    );

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, isAvailable } = req.body;

    const existing = await queryOne('SELECT * FROM products WHERE product_id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    // Use existing values as fallback for partial updates
    const updatedName = name ?? existing.name;
    const updatedDesc = description ?? existing.description;
    const updatedPrice = price ?? existing.price;
    const updatedImage = imageUrl ?? existing.image_url;
    const updatedAvailable = isAvailable ?? existing.is_available;

    let categoryId = existing.category_id;
    if (category) {
      const cat = await queryOne('SELECT category_id FROM categories WHERE name = ?', [category]);
      if (cat) categoryId = cat.category_id;
    }

    await query(
      `UPDATE products SET name = ?, description = ?, price = ?, image_url = ?,
       category_id = ?, is_available = ? WHERE product_id = ?`,
      [updatedName, updatedDesc || '', parseFloat(updatedPrice), updatedImage || null, categoryId, updatedAvailable ? 1 : 0, id]
    );

    const product = await queryOne(
      `SELECT p.product_id as id, p.name, p.description, p.price, p.image_url as imageUrl,
              p.is_available as isAvailable, c.name as category
       FROM products p LEFT JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );

    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT product_id FROM products WHERE product_id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    // Soft delete — mark as unavailable
    await query('UPDATE products SET is_available = false WHERE product_id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Orders ──────────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const orders = await query(`
      SELECT o.order_id as id, o.order_status as status, o.total_amount as totalAmount,
             o.order_date as createdAt, u.name as customerName, u.email as customerEmail
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);
    res.json({ orders });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await query('UPDATE orders SET order_status = ? WHERE order_id = ?', [status, id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Customers ───────────────────────────────────────────────────────────────
router.get('/customers', async (req, res) => {
  try {
    const customers = await query(`
      SELECT user_id as id, name, email, phone, address, created_at as createdAt
      FROM users WHERE is_admin = false
      ORDER BY created_at DESC
    `);
    res.json({ customers });
  } catch (error) {
    console.error('Admin customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
