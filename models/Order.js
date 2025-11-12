const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number
    }
  ],
  userId: String,
  createdAt: { type: Date, default: Date.now },
  status: String,
  total: Number,
  transactionId: String
});

module.exports = mongoose.model('Order', orderSchema);
