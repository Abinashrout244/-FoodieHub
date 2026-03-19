const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// @desc    Get all products (with optional category filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a product (admin)
// @route   POST /api/products
const addProduct = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : '';
    if (!image) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const product = await Product.create({
      name,
      image,
      description,
      category,
      price: Number(price),
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, category, price } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price ? Number(price) : product.price;

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };
