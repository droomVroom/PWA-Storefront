const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

// GET: Products list (with optional search & category filter + pagination)
router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const q = req.query.q || '';
  const category = req.query.category || '';

  let query = {};
  if (q) query.name = { $regex: q, $options: 'i' };
  if (category) query.category = category;

  const products = await Product.find(query).skip((page - 1) * limit).limit(limit);
  res.json(products);
});

// GET: Product search (legacy endpoint if old code references it)
router.get('/products/search', async (req, res) => {
  const q = req.query.q || '';
  const products = await Product.find({ name: { $regex: q, $options: 'i' } });
  res.json(products);
});

// GET: All categories
router.get('/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// POST: Create (idempotent) order
router.post('/orders', async (req, res) => {
  const { items, userId, status, total, transactionId } = req.body;
  let order = await Order.findOne({ transactionId });
  if (!order) {
    order = await Order.create({
      items, userId, status, total, transactionId
    });
  }
  res.json(order);
});

// GET: Orders list
router.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

module.exports = router;
