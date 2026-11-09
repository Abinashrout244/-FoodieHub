/**
 * Admin Restaurant Controller — full CRUD for restaurants AND menu items/sections
 */
const Restaurant = require('../models/Restaurant');

// ─────────────────────────────────────────────
//  RESTAURANT CRUD
// ─────────────────────────────────────────────

const getRestaurants = async (req, res) => {
  try {
    const { cuisine, search } = req.query;
    let query = {};
    if (cuisine && cuisine !== 'All') query.cuisines = { $in: [new RegExp(cuisine, 'i')] };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $in: [new RegExp(search, 'i')] } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    const restaurants = await Restaurant.find(query).select('-menu');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
//  MENU SECTION CRUD  (within a restaurant)
// ─────────────────────────────────────────────

// POST /api/restaurants/:id/sections
const addMenuSection = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const { category } = req.body;
    if (!category) return res.status(400).json({ message: 'Category name is required' });

    restaurant.menu.push({ category, items: [] });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/restaurants/:id/sections/:sectionId
const updateMenuSection = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const section = restaurant.menu.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    if (req.body.category) section.category = req.body.category;
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/restaurants/:id/sections/:sectionId
const deleteMenuSection = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.menu = restaurant.menu.filter(s => s._id.toString() !== req.params.sectionId);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
//  MENU ITEM CRUD  (within a section)
// ─────────────────────────────────────────────

// POST /api/restaurants/:id/sections/:sectionId/items
const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const section = restaurant.menu.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    section.items.push({ ...req.body, category: section.category });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/restaurants/:id/sections/:sectionId/items/:itemId
const updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const section = restaurant.menu.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const item = section.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    Object.assign(item, req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/restaurants/:id/sections/:sectionId/items/:itemId
const deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const section = restaurant.menu.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    section.items = section.items.filter(i => i._id.toString() !== req.params.itemId);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addMenuSection,
  updateMenuSection,
  deleteMenuSection,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
