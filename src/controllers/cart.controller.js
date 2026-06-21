const { getOrCreateCart } = require('../services/cart.service');
const { calculatePromotion } = require('../services/promotions');
const logger = require('../utils/logger');
const Cart = require('../models/Cart');

const addOrUpdateItem = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, name, price, quantity } = req.body;

    let cart = await getOrCreateCart(userId);

    const existing = cart.items.findIndex(i => i.productId === productId);
    if (existing !== -1) {
      cart.items[existing].quantity += quantity;
      if (cart.items[existing].quantity <= 0) cart.items.splice(existing, 1);
    } else if (quantity > 0) {
      cart.items.push({ productId, name, price, quantity });
    }

    await cart.save();
    logger.info(`Cart updated for user ${userId}`);
    res.json({ message: 'Cart updated', items: cart.items });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCheckout = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await getOrCreateCart(userId);
    
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const uniqueItems = cart.items.length;
    const promotion = calculatePromotion(subtotal, uniqueItems);

    const discountAmount = subtotal * promotion.discount;
    const total = subtotal - discountAmount;

    // Clean response - remove internal MongoDB fields
    const cleanItems = cart.items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      itemTotal: Math.round(item.price * item.quantity * 100) / 100
    }));

    res.json({
      success: true,
      items: cleanItems,                    
      summary: {
        subtotal: Math.round(subtotal * 100) / 100,
        discountTier: promotion.tier,
        discountRate: (promotion.discount * 100) + "%",
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalTotal: Math.round(total * 100) / 100,
        totalItems: cart.items.reduce((sum, i) => sum + i.quantity, 0)
      }
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const removeItem = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    cart.items = cart.items.filter(i => i.productId !== req.params.productId);
    await cart.save();
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


const clearCart = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await getOrCreateCart(userId);
    
    cart.items = [];                    // Clear items only
    await cart.save();

    logger.info(`Cart cleared for user: ${userId}`);
    res.json({ message: 'Cart cleared successfully', items: [] });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  addOrUpdateItem, 
  getCheckout, 
  removeItem, 
  clearCart 
};
