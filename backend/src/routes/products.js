const express = require('express');
const Joi = require('joi');
const { query, queryOne } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all categories (must be before /:id route)
router.get('/categories', async (req, res) => {
  try {
    const categories = await query(`
      SELECT 
        c.category_id as id,
        c.name,
        c.description,
        c.image_url as imageUrl,
        c.is_active as isActive,
        c.created_at as createdAt,
        COUNT(p.product_id) as productCount
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id AND p.is_available = true
      WHERE c.is_active = true
      GROUP BY c.category_id, c.name, c.description, c.image_url, c.is_active, c.created_at
      ORDER BY c.name ASC
    `);

    const formattedCategories = categories.map(category => ({
      ...category,
      _count: {
        products: category.productCount
      }
    }));

    res.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's favorite products
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await query(`
      SELECT 
        uf.favorite_id as id,
        uf.times_ordered as timesOrdered,
        uf.last_ordered as lastOrdered,
        uf.created_at as createdAt,
        p.product_id as productId,
        p.name as productName,
        p.description as productDescription,
        p.price as productPrice,
        p.image_url as productImageUrl,
        c.category_id as categoryId,
        c.name as categoryName,
        c.description as categoryDescription
      FROM user_favorites uf
      JOIN products p ON uf.product_id = p.product_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE uf.user_id = ?
      ORDER BY uf.times_ordered DESC
    `, [req.user.id]);

    const formattedFavorites = favorites.map(fav => ({
      id: fav.id,
      timesOrdered: fav.timesOrdered,
      lastOrdered: fav.lastOrdered,
      createdAt: fav.createdAt,
      product: {
        id: fav.productId,
        name: fav.productName,
        description: fav.productDescription,
        price: fav.productPrice,
        imageUrl: fav.productImageUrl,
        category: {
          id: fav.categoryId,
          name: fav.categoryName,
          description: fav.categoryDescription
        }
      }
    }));

    res.json({ favorites: formattedFavorites });
  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, limit, offset } = req.query;
    
    let whereClause = 'WHERE p.is_available = true';
    const queryParams = [];

    if (category) {
      whereClause += ' AND c.name LIKE ?';
      queryParams.push(`%${category}%`);
    }

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    let limitClause = '';
    if (limit) {
      limitClause = ` LIMIT ${parseInt(limit)}`;
      if (offset) {
        limitClause += ` OFFSET ${parseInt(offset)}`;
      }
    }

    const products = await query(`
      SELECT 
        p.product_id as id,
        p.name,
        p.description,
        p.price,
        p.image_url as imageUrl,
        p.customization_options as customizationOptions,
        p.is_available as isAvailable,
        p.created_at as createdAt,
        c.category_id as categoryId,
        c.name as categoryName,
        c.description as categoryDescription
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ${whereClause}
      ORDER BY p.created_at DESC
      ${limitClause}
    `, queryParams);

    // Parse JSON fields
    const parsedProducts = products.map(product => ({
      ...product,
      customizationOptions: product.customizationOptions ? JSON.parse(product.customizationOptions) : null,
      category: {
        id: product.categoryId,
        name: product.categoryName,
        description: product.categoryDescription
      }
    }));

    // Get total count
    const totalResult = await query(`
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ${whereClause}
    `, queryParams);

    const total = totalResult[0].total;

    res.json({
      products: parsedProducts,
      total,
      hasMore: offset ? parseInt(offset) + parsedProducts.length < total : parsedProducts.length < total
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await queryOne(`
      SELECT 
        p.product_id as id,
        p.name,
        p.description,
        p.price,
        p.image_url as imageUrl,
        p.customization_options as customizationOptions,
        p.is_available as isAvailable,
        p.created_at as createdAt,
        c.category_id as categoryId,
        c.name as categoryName,
        c.description as categoryDescription
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `, [id]);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isAvailable) {
      return res.status(404).json({ error: 'Product not available' });
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      customizationOptions: product.customizationOptions ? JSON.parse(product.customizationOptions) : null,
      category: {
        id: product.categoryId,
        name: product.categoryName,
        description: product.categoryDescription
      }
    };

    res.json({ product: parsedProduct });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;