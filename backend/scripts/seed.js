const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { query, pool } = require('../src/config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Create categories
    const foodCategoryId = uuidv4();
    const beverageCategoryId = uuidv4();

    await query(`
      INSERT IGNORE INTO categories (category_id, name, description, image_url, is_active) 
      VALUES (?, 'Food', 'Traditional Ethiopian dishes and main courses', '/images/categories/food.jpg', true)
    `, [foodCategoryId]);

    await query(`
      INSERT IGNORE INTO categories (category_id, name, description, image_url, is_active) 
      VALUES (?, 'Beverages', 'Refreshing drinks, coffee, and traditional beverages', '/images/categories/beverages.jpg', true)
    `, [beverageCategoryId]);

    console.log('✅ Categories created');

    // Create sample products
    const products = [
      // Food items
      {
        id: uuidv4(),
        name: 'Doro Wot',
        description: 'Traditional Ethiopian chicken stew with hard-boiled eggs, served with injera bread. A spicy and flavorful dish that represents the heart of Ethiopian cuisine.',
        categoryId: foodCategoryId,
        price: 25.00,
        imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          spice: ['mild', 'medium', 'hot'],
          size: ['regular', 'large'],
          extras: ['extra_egg', 'extra_chicken']
        })
      },
      {
        id: uuidv4(),
        name: 'Kitfo',
        description: 'Ethiopian steak tartare seasoned with mitmita spice and served with ayib (Ethiopian cottage cheese) and gomen (collard greens).',
        categoryId: foodCategoryId,
        price: 30.00,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          preparation: ['raw', 'lightly_cooked', 'well_cooked'],
          sides: ['ayib', 'gomen', 'both']
        })
      },
      {
        id: uuidv4(),
        name: 'Vegetarian Combo',
        description: 'A variety of vegetarian dishes including shiro, gomen, misir wot, and cabbage served on injera. Perfect for vegetarians and vegans.',
        categoryId: foodCategoryId,
        price: 20.00,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          spice: ['mild', 'medium', 'hot'],
          size: ['regular', 'large']
        })
      },
      {
        id: uuidv4(),
        name: 'Tibs',
        description: 'Sautéed beef or lamb with onions, peppers, and Ethiopian spices. Served with injera or rice.',
        categoryId: foodCategoryId,
        price: 28.00,
        imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          meat: ['beef', 'lamb'],
          spice: ['mild', 'medium', 'hot'],
          side: ['injera', 'rice']
        })
      },
      {
        id: uuidv4(),
        name: 'Injera',
        description: 'Traditional Ethiopian sourdough flatbread made from teff flour. The foundation of Ethiopian cuisine.',
        categoryId: foodCategoryId,
        price: 5.00,
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          quantity: ['1_piece', '3_pieces', '5_pieces']
        })
      },
      
      // Beverage items
      {
        id: uuidv4(),
        name: 'Ethiopian Coffee',
        description: 'Freshly roasted and brewed Ethiopian coffee, served in traditional style. The birthplace of coffee offers the finest beans.',
        categoryId: beverageCategoryId,
        price: 8.00,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          size: ['small', 'medium', 'large'],
          sugar: ['no_sugar', 'little_sugar', 'sweet'],
          milk: ['black', 'with_milk']
        })
      },
      {
        id: uuidv4(),
        name: 'Fresh Mango Juice',
        description: 'Freshly squeezed mango juice made from ripe, sweet mangoes. Refreshing and naturally sweet.',
        categoryId: beverageCategoryId,
        price: 6.00,
        imageUrl: 'https://images.unsplash.com/photo-1605027990121-3b2c6c7cb4c2?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          size: ['small', 'medium', 'large'],
          ice: ['no_ice', 'little_ice', 'lots_of_ice']
        })
      },
      {
        id: uuidv4(),
        name: 'Tej (Honey Wine)',
        description: 'Traditional Ethiopian honey wine, mildly alcoholic and sweet. A cultural beverage perfect for special occasions.',
        categoryId: beverageCategoryId,
        price: 12.00,
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          sweetness: ['dry', 'semi_sweet', 'sweet']
        })
      },
      {
        id: uuidv4(),
        name: 'Soft Drinks',
        description: 'Selection of popular soft drinks including Coca-Cola, Pepsi, Sprite, and local Ethiopian sodas.',
        categoryId: beverageCategoryId,
        price: 3.00,
        imageUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          type: ['coca_cola', 'pepsi', 'sprite', 'fanta', 'local_soda'],
          size: ['small', 'medium', 'large']
        })
      },
      {
        id: uuidv4(),
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice, rich in vitamin C and natural sweetness.',
        categoryId: beverageCategoryId,
        price: 5.50,
        imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
        customizationOptions: JSON.stringify({
          size: ['small', 'medium', 'large'],
          pulp: ['no_pulp', 'some_pulp', 'lots_of_pulp']
        })
      }
    ];

    for (const product of products) {
      await query(`
        INSERT IGNORE INTO products (product_id, name, description, category_id, price, image_url, customization_options, is_available) 
        VALUES (?, ?, ?, ?, ?, ?, ?, true)
      `, [product.id, product.name, product.description, product.categoryId, product.price, product.imageUrl, product.customizationOptions]);
    }

    console.log('✅ Products created');

    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    await query(`
      INSERT IGNORE INTO users (user_id, name, email, phone, password_hash, address, is_admin) 
      VALUES (?, 'FA Restaurant Admin', 'admin@farestaurant.com', '+251911000000', ?, 'FA Restaurant Headquarters, Addis Ababa', true)
    `, [adminId, adminPassword]);

    // Create sample customer
    const customerId = uuidv4();
    const customerPassword = await bcrypt.hash('customer123', 12);
    
    await query(`
      INSERT IGNORE INTO users (user_id, name, email, phone, password_hash, address, is_admin) 
      VALUES (?, 'Sample Customer', 'customer@example.com', '+251911111111', ?, '123 Sample Street, Addis Ababa, Ethiopia', false)
    `, [customerId, customerPassword]);

    console.log('✅ Users created');

    // Create sample delivery personnel
    const deliveryPersonnel = [
      { id: uuidv4(), name: 'Abebe Kebede', phone: '+251911222222' },
      { id: uuidv4(), name: 'Almaz Tadesse', phone: '+251911333333' },
      { id: uuidv4(), name: 'Dawit Haile', phone: '+251911444444' }
    ];

    for (const person of deliveryPersonnel) {
      await query(`
        INSERT IGNORE INTO delivery_personnel (delivery_id, name, phone, is_available) 
        VALUES (?, ?, ?, true)
      `, [person.id, person.name, person.phone]);
    }

    console.log('✅ Delivery personnel created');

    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📧 Admin credentials:');
    console.log('   Email: admin@farestaurant.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('📧 Customer credentials:');
    console.log('   Email: customer@example.com');
    console.log('   Password: customer123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };