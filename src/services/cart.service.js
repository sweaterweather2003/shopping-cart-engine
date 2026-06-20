// src/services/cart.service.js
const Cart = require('../models/Cart');
const { calculatePromotion } = require('./promotions');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({
      userId,
      items: [],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days TTL
    });
    await cart.save();
  }
  return cart;
};

const calculateCheckout = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const uniqueItems = cart.items.length;

  const promotion = calculatePromotion(subtotal, uniqueItems);

  return {
    cartId: cart._id,
    items: cart.items,
    subtotal: Math.round(subtotal * 100) / 100,
    ...promotion,
    totalItems: cart.items.reduce((sum, i) => sum + i.quantity, 0),
    lastUpdated: cart.updatedAt
  };
};

module.exports = {
  getOrCreateCart,
  calculateCheckout
};