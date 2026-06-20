const { getOrCreateCart, calculateCheckout } = require('../services/cart.service');
const Cart = require('../models/Cart');
const logger = require('../utils/logger');

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
    res.json({ message: 'Cart updated', cart: cart.items });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCheckout = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: "x-user-id header is required" });

    const cart = await getOrCreateCart(userId);
    
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const uniqueItems = cart.items.length;
    const promotion = require('../services/promotions').calculatePromotion(subtotal, uniqueItems);

    const discountAmount = subtotal * promotion.discount;
    const total = subtotal - discountAmount;

    const response = {
      success: true,
      cartId: cart._id,
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        itemTotal: Math.round(item.price * item.quantity * 100) / 100
      })),
      summary: {
        subtotal: Math.round(subtotal * 100) / 100,
        discountTier: promotion.tier,
        discountRate: (promotion.discount * 100) + "%",
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalTotal: Math.round(total * 100) / 100,
        totalItems: cart.items.reduce((sum, i) => sum + i.quantity, 0)
      }
    };

    res.json(response);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const removeItem = async (req, res) => {
  const cart = await getOrCreateCart(req.userId);
  cart.items = cart.items.filter(i => i.productId !== req.params.productId);
  await cart.save();
  res.json({ message: 'Item removed' });
};

const clearCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: "x-user-id header is required" });

    const Cart = require('../models/Cart');
    await Cart.deleteOne({ userId });

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { 
  addOrUpdateItem, 
  getCheckout, 
  clearCart,
  removeItem: async (req, res) => { }
};

