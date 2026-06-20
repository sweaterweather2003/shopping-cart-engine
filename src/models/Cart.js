const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: [cartItemSchema],
  expiresAt: { type: Date, expires: 0 } // TTL for Feature X
}, { timestamps: true });

// Soft delete support
cartSchema.methods.softDelete = function() {
  this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // keep 30 days
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);