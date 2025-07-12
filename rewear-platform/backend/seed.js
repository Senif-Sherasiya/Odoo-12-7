const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rewear', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyUsers = [
  {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Fashion enthusiast and sustainability advocate',
    location: 'New York, NY',
    phone: '+1234567890',
    points: 250,
    role: 'user'
  },
  {
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    bio: 'Love sustainable fashion and helping the environment',
    location: 'Los Angeles, CA',
    phone: '+1234567891',
    points: 180,
    role: 'user'
  },
  {
    name: 'Admin User',
    username: 'admin',
    email: 'admin@rewear.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    bio: 'Platform administrator',
    location: 'San Francisco, CA',
    phone: '+1234567892',
    points: 500,
    role: 'admin'
  }
];

const dummyItems = [
  {
    title: 'Blue Denim Jacket',
    description: 'Classic blue denim jacket in excellent condition. Perfect for casual outings and layering. Size M, fits true to size.',
    category: 'outerwear',
    type: 'men',
    size: 'M',
    condition: 'like-new',
    pointValue: 15,
    brand: 'Levi\'s',
    color: 'Blue',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 45,
    likes: []
  },
  {
    title: 'Black Leather Handbag',
    description: 'Elegant black leather handbag with gold hardware. Perfect for professional settings and evening events.',
    category: 'accessories',
    type: 'women',
    size: 'One Size',
    condition: 'good',
    pointValue: 25,
    brand: 'Coach',
    color: 'Black',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 32,
    likes: []
  },
  {
    title: 'White Sneakers',
    description: 'Comfortable white sneakers perfect for everyday wear. Clean and well-maintained.',
    category: 'shoes',
    type: 'unisex',
    size: 'L',
    condition: 'good',
    pointValue: 12,
    brand: 'Nike',
    color: 'White',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 28,
    likes: []
  },
  {
    title: 'Red Summer Dress',
    description: 'Beautiful red summer dress with floral pattern. Perfect for warm weather and special occasions.',
    category: 'dresses',
    type: 'women',
    size: 'S',
    condition: 'new',
    pointValue: 20,
    brand: 'Zara',
    color: 'Red',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 67,
    likes: []
  },
  {
    title: 'Gray Hoodie',
    description: 'Comfortable gray hoodie made from organic cotton. Perfect for casual wear and lounging.',
    category: 'tops',
    type: 'men',
    size: 'L',
    condition: 'like-new',
    pointValue: 10,
    brand: 'Patagonia',
    color: 'Gray',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 23,
    likes: []
  },
  {
    title: 'Silver Necklace',
    description: 'Elegant silver necklace with pendant. Perfect accessory for any outfit.',
    category: 'accessories',
    type: 'women',
    size: 'One Size',
    condition: 'like-new',
    pointValue: 18,
    brand: 'Pandora',
    color: 'Silver',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 19,
    likes: []
  },
  {
    title: 'Kids Winter Coat',
    description: 'Warm winter coat for children. Perfect for cold weather and outdoor activities.',
    category: 'outerwear',
    type: 'kids',
    size: 'M',
    condition: 'good',
    pointValue: 14,
    brand: 'Gap Kids',
    color: 'Blue',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 15,
    likes: []
  },
  {
    title: 'Black Dress Pants',
    description: 'Professional black dress pants. Perfect for office wear and formal occasions.',
    category: 'bottoms',
    type: 'men',
    size: 'L',
    condition: 'like-new',
    pointValue: 16,
    brand: 'H&M',
    color: 'Black',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop'
    ],
    status: 'available',
    isApproved: true,
    views: 34,
    likes: []
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of dummyUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create items and assign to users
    for (let i = 0; i < dummyItems.length; i++) {
      const itemData = dummyItems[i];
      const uploader = createdUsers[i % createdUsers.length]; // Distribute items among users
      
      const item = await Item.create({
        ...itemData,
        uploader: uploader._id
      });
      
      console.log(`👕 Created item: ${item.title}`);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${createdUsers.length} users and ${dummyItems.length} items`);
    
    // Display sample data
    console.log('\n📋 Sample Users:');
    createdUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - ${user.points} points`);
    });

    console.log('\n📋 Sample Items:');
    const items = await Item.find().populate('uploader', 'username');
    items.forEach(item => {
      console.log(`  - ${item.title} by ${item.uploader.username} - ${item.pointValue} points`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
seedDatabase(); 