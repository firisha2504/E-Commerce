import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const foodCategory = await prisma.category.upsert({
    where: { name: 'Food' },
    update: {},
    create: {
      name: 'Food',
      description: 'Traditional Ethiopian dishes and main courses',
      imageUrl: '/images/categories/food.jpg',
      isActive: true,
    },
  });

  const beverageCategory = await prisma.category.upsert({
    where: { name: 'Beverages' },
    update: {},
    create: {
      name: 'Beverages',
      description: 'Refreshing drinks, coffee, and traditional beverages',
      imageUrl: '/images/categories/beverages.jpg',
      isActive: true,
    },
  });

  console.log('✅ Categories created');

  // Create sample products
  const products = [
    // Food items
    {
      name: 'Doro Wot',
      description: 'Traditional Ethiopian chicken stew with hard-boiled eggs, served with injera bread. A spicy and flavorful dish that represents the heart of Ethiopian cuisine.',
      categoryId: foodCategory.id,
      price: 25.00,
      imageUrl: '/images/products/doro-wot.jpg',
      customizationOptions: {
        spice: ['mild', 'medium', 'hot'],
        size: ['regular', 'large'],
        extras: ['extra_egg', 'extra_chicken']
      },
      isAvailable: true,
    },
    {
      name: 'Kitfo',
      description: 'Ethiopian steak tartare seasoned with mitmita spice and served with ayib (Ethiopian cottage cheese) and gomen (collard greens).',
      categoryId: foodCategory.id,
      price: 30.00,
      imageUrl: '/images/products/kitfo.jpg',
      customizationOptions: {
        preparation: ['raw', 'lightly_cooked', 'well_cooked'],
        sides: ['ayib', 'gomen', 'both']
      },
      isAvailable: true,
    },
    {
      name: 'Vegetarian Combo',
      description: 'A variety of vegetarian dishes including shiro, gomen, misir wot, and cabbage served on injera. Perfect for vegetarians and vegans.',
      categoryId: foodCategory.id,
      price: 20.00,
      imageUrl: '/images/products/veg-combo.jpg',
      customizationOptions: {
        spice: ['mild', 'medium', 'hot'],
        size: ['regular', 'large']
      },
      isAvailable: true,
    },
    {
      name: 'Tibs',
      description: 'Sautéed beef or lamb with onions, peppers, and Ethiopian spices. Served with injera or rice.',
      categoryId: foodCategory.id,
      price: 28.00,
      imageUrl: '/images/products/tibs.jpg',
      customizationOptions: {
        meat: ['beef', 'lamb'],
        spice: ['mild', 'medium', 'hot'],
        side: ['injera', 'rice']
      },
      isAvailable: true,
    },
    {
      name: 'Injera',
      description: 'Traditional Ethiopian sourdough flatbread made from teff flour. The foundation of Ethiopian cuisine.',
      categoryId: foodCategory.id,
      price: 5.00,
      imageUrl: '/images/products/injera.jpg',
      customizationOptions: {
        quantity: ['1_piece', '3_pieces', '5_pieces']
      },
      isAvailable: true,
    },
    
    // Beverage items
    {
      name: 'Ethiopian Coffee',
      description: 'Freshly roasted and brewed Ethiopian coffee, served in traditional style. The birthplace of coffee offers the finest beans.',
      categoryId: beverageCategory.id,
      price: 8.00,
      imageUrl: '/images/products/ethiopian-coffee.jpg',
      customizationOptions: {
        size: ['small', 'medium', 'large'],
        sugar: ['no_sugar', 'little_sugar', 'sweet'],
        milk: ['black', 'with_milk']
      },
      isAvailable: true,
    },
    {
      name: 'Fresh Mango Juice',
      description: 'Freshly squeezed mango juice made from ripe, sweet mangoes. Refreshing and naturally sweet.',
      categoryId: beverageCategory.id,
      price: 6.00,
      imageUrl: '/images/products/mango-juice.jpg',
      customizationOptions: {
        size: ['small', 'medium', 'large'],
        ice: ['no_ice', 'little_ice', 'lots_of_ice']
      },
      isAvailable: true,
    },
    {
      name: 'Tej (Honey Wine)',
      description: 'Traditional Ethiopian honey wine, mildly alcoholic and sweet. A cultural beverage perfect for special occasions.',
      categoryId: beverageCategory.id,
      price: 12.00,
      imageUrl: '/images/products/tej.jpg',
      customizationOptions: {
        sweetness: ['dry', 'semi_sweet', 'sweet']
      },
      isAvailable: true,
    },
    {
      name: 'Soft Drinks',
      description: 'Selection of popular soft drinks including Coca-Cola, Pepsi, Sprite, and local Ethiopian sodas.',
      categoryId: beverageCategory.id,
      price: 3.00,
      imageUrl: '/images/products/soft-drinks.jpg',
      customizationOptions: {
        type: ['coca_cola', 'pepsi', 'sprite', 'fanta', 'local_soda'],
        size: ['small', 'medium', 'large']
      },
      isAvailable: true,
    },
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, rich in vitamin C and natural sweetness.',
      categoryId: beverageCategory.id,
      price: 5.50,
      imageUrl: '/images/products/orange-juice.jpg',
      customizationOptions: {
        size: ['small', 'medium', 'large'],
        pulp: ['no_pulp', 'some_pulp', 'lots_of_pulp']
      },
      isAvailable: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('✅ Products created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@farestaurant.com' },
    update: {},
    create: {
      name: 'FA Restaurant Admin',
      email: 'admin@farestaurant.com',
      phone: '+251911000000',
      passwordHash: adminPassword,
      address: 'FA Restaurant Headquarters, Addis Ababa',
      isAdmin: true,
    },
  });

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Sample Customer',
      email: 'customer@example.com',
      phone: '+251911111111',
      passwordHash: customerPassword,
      address: '123 Sample Street, Addis Ababa, Ethiopia',
      isAdmin: false,
    },
  });

  console.log('✅ Users created');

  // Create sample delivery personnel
  await prisma.deliveryPersonnel.createMany({
    data: [
      {
        name: 'Abebe Kebede',
        phone: '+251911222222',
        isAvailable: true,
      },
      {
        name: 'Almaz Tadesse',
        phone: '+251911333333',
        isAvailable: true,
      },
      {
        name: 'Dawit Haile',
        phone: '+251911444444',
        isAvailable: false,
      },
    ],
    skipDuplicates: true,
  });

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
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });