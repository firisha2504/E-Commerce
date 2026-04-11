const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query, queryOne } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(20).required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().optional()
}).options({ stripUnknown: true }); // Strip unknown fields

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(detail => detail.message).join(', ')
      });
    }

    const { name, email, phone, password, address } = value;
    
    // Check if user already exists
    const existingUser = await queryOne(
      'SELECT user_id FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or phone already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    await query(
      `INSERT INTO users (user_id, name, email, phone, password_hash, address) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, email, phone, passwordHash, address || null]
    );

    // Get created user
    const user = await queryOne(
      `SELECT user_id as id, name, email, phone, address, is_admin as isAdmin, created_at as createdAt 
       FROM users WHERE user_id = ?`,
      [userId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(detail => detail.message).join(', ')
      });
    }

    const { email, password } = value;

    // Find user by email
    const user = await queryOne(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profileImage: user.profile_image,
      isAdmin: user.is_admin,
      createdAt: user.created_at
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await queryOne(
      `SELECT user_id as id, name, email, phone, address, profile_image as profileImage, is_admin as isAdmin, created_at as createdAt 
       FROM users WHERE user_id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updateSchema = Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      phone: Joi.string().min(10).max(20).optional(),
      address: Joi.string().optional()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(detail => detail.message).join(', ')
      });
    }

    const updates = [];
    const values = [];
    
    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value[key]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(req.user.id);
    
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    const updatedUser = await queryOne(
      `SELECT user_id as id, name, email, phone, address, is_admin as isAdmin, updated_at as updatedAt 
       FROM users WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const changePasswordSchema = Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required()
    });

    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(detail => detail.message).join(', ')
      });
    }

    const { currentPassword, newPassword } = value;

    // Get current user with password
    const user = await queryOne(
      'SELECT password_hash FROM users WHERE user_id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload profile image
router.post('/profile/image', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get the old profile image to delete it
    const user = await queryOne(
      'SELECT profile_image FROM users WHERE user_id = ?',
      [req.user.id]
    );

    // Delete old profile image if exists
    if (user && user.profile_image) {
      const oldImagePath = path.join(__dirname, '../../', user.profile_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new image path to database
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    await query(
      'UPDATE users SET profile_image = ? WHERE user_id = ?',
      [imagePath, req.user.id]
    );

    res.json({
      message: 'Profile image uploaded successfully',
      profileImage: imagePath
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete profile image
router.delete('/profile/image', authenticateToken, async (req, res) => {
  try {
    // Get the current profile image
    const user = await queryOne(
      'SELECT profile_image FROM users WHERE user_id = ?',
      [req.user.id]
    );

    if (!user || !user.profile_image) {
      return res.status(404).json({ error: 'No profile image found' });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, '../../', user.profile_image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove image path from database
    await query(
      'UPDATE users SET profile_image = NULL WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile image deleted successfully' });
  } catch (error) {
    console.error('Profile image delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;