/**
 * Run: node backend/utils/createAdmin.js
 * Creates an admin user for the admin panel login.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove old admin if exists
    await User.deleteOne({ email: 'admin@foodiehub.com' });

    // Create new admin (password is hashed automatically by pre-save hook)
    const admin = await User.create({
      name: 'FoodieHub Admin',
      email: 'admin@foodiehub.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('🎉 Admin user created!');
    console.log('   Email   :', admin.email);
    console.log('   Password: admin123');
    console.log('   Role    :', admin.role);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
