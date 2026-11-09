/**
 * Seed script — imports dummy restaurant data into MongoDB.
 * Run once: node backend/utils/seedRestaurants.js
 */
const path   = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose   = require('mongoose');
const Restaurant = require('../models/Restaurant');

const dummyRestaurants = [
  {
    name: 'Hotel Megha',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
    cuisines: ['North Indian', 'Chicken', 'Mughlai'],
    rating: 4.4, totalRatings: '2.1K', deliveryTime: '30-35',
    minOrder: 149, deliveryFee: 29, offer: '50% OFF up to ₹100',
    isOpen: true, location: 'Chandni Chowk, Delhi',
    tags: ['Bestseller', 'Trending'], priceForTwo: 450,
    menu: [
      {
        category: 'Chicken Specials',
        items: [
          { name: 'Chicken Chilli', price: 121, rating: 4.3, reviews: 851, isVeg: false, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&h=200&fit=crop', description: 'Spicy chicken chilli tossed with bell peppers and soy sauce.', isCustomizable: true, isBestseller: true, category: 'Chicken Specials' },
          { name: 'Chicken Latpat', price: 110, rating: 4.4, reviews: 275, isVeg: false, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop', description: 'Tangy tamarind-based chicken preparation with desi spices.', isCustomizable: true, isBestseller: false, category: 'Chicken Specials' },
          { name: 'Chicken Butter Masala', price: 143, rating: 4.3, reviews: 18, isVeg: false, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&h=200&fit=crop', description: 'Rich creamy tomato-butter gravy with tender chicken pieces.', isCustomizable: true, isBestseller: false, category: 'Chicken Specials' },
          { name: 'Handi Chicken', price: 215, rating: 4.3, reviews: 235, isVeg: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&h=200&fit=crop', description: 'Slow-cooked chicken in a traditional clay pot with aromatic spices.', isCustomizable: true, isBestseller: true, category: 'Chicken Specials' },
          { name: 'Put Kaleja Masala', price: 121, rating: 4.5, reviews: 182, isVeg: false, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=200&h=200&fit=crop', description: 'Chicken liver cooked in spicy masala gravy with onions.', isCustomizable: true, isBestseller: false, category: 'Chicken Specials' },
          { name: 'Chicken Tadka', price: 104, rating: 4.3, reviews: 79, isVeg: false, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop', description: 'Quick tempered chicken with mustard seeds, curry leaves, and chillies.', isCustomizable: false, isBestseller: false, category: 'Chicken Specials' },
          { name: 'Chicken Kadai', price: 215, rating: 3.8, reviews: 27, isVeg: false, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=200&h=200&fit=crop', description: 'Classic wok-tossed chicken with capsicum and whole spices.', isCustomizable: true, isBestseller: false, category: 'Chicken Specials' },
          { name: 'Chicken Mughlai', price: 200, rating: 4.6, reviews: 49, isVeg: false, image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=200&h=200&fit=crop', description: 'Royal Mughal-style chicken cooked in cream and dry fruits.', isCustomizable: true, isBestseller: true, category: 'Chicken Specials' },
          { name: 'Chicken Punjabi', price: 200, rating: 4.1, reviews: 61, isVeg: false, image: 'https://images.unsplash.com/photo-1628294895950-9805252a4994?w=200&h=200&fit=crop', description: 'Bold Punjabi-style chicken curry with robust masala.', isCustomizable: true, isBestseller: false, category: 'Chicken Specials' },
          { name: 'Chicken Masala', price: 156, rating: 3.8, reviews: 6, isVeg: false, image: 'https://images.unsplash.com/photo-1605210055810-b7fb38b6ccf9?w=200&h=200&fit=crop', description: 'Homestyle chicken masala with fresh-ground spices.', isCustomizable: true, isBestseller: false, category: 'Chicken Specials' },
          { name: 'Chicken Bharta', price: 195, rating: 4.2, reviews: 33, isVeg: false, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop', description: 'Smoked, mashed chicken bharta with Indian spices and herbs.', isCustomizable: true, isBestseller: false, category: 'Chicken Specials' },
        ],
      },
      {
        category: 'Breads & Rice',
        items: [
          { name: 'Butter Naan', price: 35, rating: 4.5, reviews: 500, isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop', description: 'Soft leavened bread baked in tandoor, brushed with butter.', isCustomizable: false, isBestseller: true, category: 'Breads & Rice' },
          { name: 'Tandoori Roti', price: 25, rating: 4.3, reviews: 310, isVeg: true, image: 'https://images.unsplash.com/photo-1628294896516-1b83b9b9a6f5?w=200&h=200&fit=crop', description: 'Whole wheat bread baked in a clay tandoor.', isCustomizable: false, isBestseller: false, category: 'Breads & Rice' },
          { name: 'Steamed Rice', price: 60, rating: 4.1, reviews: 150, isVeg: true, image: 'https://images.unsplash.com/photo-1536304993881-ff86e8000bb9?w=200&h=200&fit=crop', description: 'Plain basmati steamed rice, perfect with curries.', isCustomizable: false, isBestseller: false, category: 'Breads & Rice' },
        ],
      },
    ],
  },
  {
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop',
    cuisines: ['Pizza', 'Italian', 'Pasta'],
    rating: 4.5, totalRatings: '3.2K', deliveryTime: '25-30',
    minOrder: 199, deliveryFee: 30, offer: '50% OFF up to ₹100',
    isOpen: true, location: 'Connaught Place, Delhi',
    tags: ['Bestseller', 'Pure Veg'], priceForTwo: 600,
    menu: [
      {
        category: 'Pizzas',
        items: [
          { name: 'Margherita', price: 249, rating: 4.6, reviews: 980, isVeg: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop', description: 'Classic with tomatoes, mozzarella & fresh basil.', isCustomizable: true, isBestseller: true, category: 'Pizzas' },
          { name: 'Pepperoni Pizza', price: 349, rating: 4.4, reviews: 712, isVeg: false, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop', description: 'Loaded with pepperoni and melted cheese.', isCustomizable: true, isBestseller: true, category: 'Pizzas' },
          { name: 'BBQ Chicken Pizza', price: 399, rating: 4.3, reviews: 445, isVeg: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop', description: 'Smoky BBQ chicken with onions and cilantro.', isCustomizable: true, isBestseller: false, category: 'Pizzas' },
        ],
      },
      {
        category: 'Pasta',
        items: [
          { name: 'Penne Arrabbiata', price: 249, rating: 4.1, reviews: 210, isVeg: true, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&h=200&fit=crop', description: 'Penne in spicy tomato sauce with basil.', isCustomizable: false, isBestseller: false, category: 'Pasta' },
          { name: 'Creamy Alfredo', price: 299, rating: 4.4, reviews: 380, isVeg: true, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=200&h=200&fit=crop', description: 'Fettuccine in creamy garlic parmesan sauce.', isCustomizable: false, isBestseller: true, category: 'Pasta' },
        ],
      },
    ],
  },
  {
    name: 'Burger Barn',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop',
    cuisines: ['Burger', 'American', 'Snacks'],
    rating: 4.3, totalRatings: '1.8K', deliveryTime: '20-25',
    minOrder: 149, deliveryFee: 0, offer: 'FREE Delivery',
    isOpen: true, location: 'Lajpat Nagar, Delhi',
    tags: ['Free Delivery'], priceForTwo: 400,
    menu: [
      {
        category: 'Burgers',
        items: [
          { name: 'Classic Cheeseburger', price: 179, rating: 4.4, reviews: 620, isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', description: 'Beef patty with cheddar, lettuce, tomato and special sauce.', isCustomizable: true, isBestseller: true, category: 'Burgers' },
          { name: 'Double Smash Burger', price: 299, rating: 4.5, reviews: 412, isVeg: false, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200&h=200&fit=crop', description: 'Two smashed patties with American cheese and pickles.', isCustomizable: true, isBestseller: true, category: 'Burgers' },
          { name: 'Veggie Burger', price: 149, rating: 4.0, reviews: 180, isVeg: true, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200&h=200&fit=crop', description: 'Grilled veggie patty with fresh veggies.', isCustomizable: false, isBestseller: false, category: 'Burgers' },
        ],
      },
      {
        category: 'Sides',
        items: [
          { name: 'Loaded Fries', price: 129, rating: 4.3, reviews: 550, isVeg: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop', description: 'Crispy fries loaded with cheese and jalapeños.', isCustomizable: true, isBestseller: true, category: 'Sides' },
        ],
      },
    ],
  },
  {
    name: 'Biryani Bros',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=500&fit=crop',
    cuisines: ['Biryani', 'North Indian', 'Mughlai'],
    rating: 4.7, totalRatings: '5.4K', deliveryTime: '35-40',
    minOrder: 299, deliveryFee: 29, offer: '₹125 OFF on first order',
    isOpen: true, location: 'Chandni Chowk, Delhi',
    tags: ['Trending', 'Top Rated'], priceForTwo: 700,
    menu: [
      {
        category: 'Biryani',
        items: [
          { name: 'Chicken Biryani', price: 299, rating: 4.8, reviews: 2100, isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', description: 'Fragrant basmati rice with tender chicken, saffron and fried onions.', isCustomizable: true, isBestseller: true, category: 'Biryani' },
          { name: 'Mutton Biryani', price: 399, rating: 4.7, reviews: 890, isVeg: false, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=200&fit=crop', description: 'Slow-cooked mutton dum biryani with whole spices.', isCustomizable: true, isBestseller: true, category: 'Biryani' },
          { name: 'Paneer Biryani', price: 249, rating: 4.5, reviews: 540, isVeg: true, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop', description: 'Aromatic rice with spiced paneer and caramelized onions.', isCustomizable: false, isBestseller: false, category: 'Biryani' },
        ],
      },
      {
        category: 'Sides',
        items: [
          { name: 'Raita', price: 49, rating: 4.3, reviews: 320, isVeg: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop', description: 'Chilled cucumber yogurt dip.', isCustomizable: false, isBestseller: false, category: 'Sides' },
          { name: 'Mirchi Ka Salan', price: 79, rating: 4.4, reviews: 210, isVeg: true, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=200&h=200&fit=crop', description: 'Hyderabadi chili curry, perfect with biryani.', isCustomizable: false, isBestseller: true, category: 'Sides' },
        ],
      },
    ],
  },
  {
    name: 'The Salad Studio',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop',
    cuisines: ['Salad', 'Healthy', 'Wraps'],
    rating: 4.1, totalRatings: '980', deliveryTime: '15-20',
    minOrder: 179, deliveryFee: 0, offer: 'FREE Delivery',
    isOpen: true, location: 'Vasant Vihar, Delhi',
    tags: ['Healthy', 'Pure Veg', 'Free Delivery'], priceForTwo: 350,
    menu: [
      {
        category: 'Salads',
        items: [
          { name: 'Caesar Salad', price: 199, rating: 4.4, reviews: 430, isVeg: true, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop', description: 'Romaine lettuce, croutons, parmesan with Caesar dressing.', isCustomizable: true, isBestseller: true, category: 'Salads' },
          { name: 'Greek Salad', price: 179, rating: 4.2, reviews: 280, isVeg: true, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop', description: 'Cucumbers, olives, feta with olive oil dressing.', isCustomizable: false, isBestseller: false, category: 'Salads' },
        ],
      },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Restaurant.deleteMany({});
    console.log('🗑️  Cleared existing restaurants');

    const inserted = await Restaurant.insertMany(dummyRestaurants);
    console.log(`🍽️  Seeded ${inserted.length} restaurants successfully!`);
    inserted.forEach(r => console.log(`   → ${r.name} (${r._id})`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
