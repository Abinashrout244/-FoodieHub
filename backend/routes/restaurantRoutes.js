const express = require('express');
const router  = express.Router();
const {
  getRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant,
  addMenuSection, updateMenuSection, deleteMenuSection,
  addMenuItem, updateMenuItem, deleteMenuItem,
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

// ── Restaurant CRUD ──────────────────────────────────────────────
router.get('/',     getRestaurants);
router.get('/:id',  getRestaurantById);
router.post('/',          protect, admin, createRestaurant);
router.put('/:id',        protect, admin, updateRestaurant);
router.delete('/:id',     protect, admin, deleteRestaurant);

// ── Menu Section CRUD ────────────────────────────────────────────
router.post('/:id/sections',                        protect, admin, addMenuSection);
router.put('/:id/sections/:sectionId',              protect, admin, updateMenuSection);
router.delete('/:id/sections/:sectionId',           protect, admin, deleteMenuSection);

// ── Menu Item CRUD ───────────────────────────────────────────────
router.post('/:id/sections/:sectionId/items',                       protect, admin, addMenuItem);
router.put('/:id/sections/:sectionId/items/:itemId',                protect, admin, updateMenuItem);
router.delete('/:id/sections/:sectionId/items/:itemId',             protect, admin, deleteMenuItem);

module.exports = router;
