const { getOrCreateCart } = require('../services/cart.service');
const { calculatePromotion } = require('../services/promotions');
const logger = require('../utils/logger');
const Cart = require('../models/Cart');

const addOrUpdateItem = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, name, price, quantity = 1 } = req.body;

    let cart = await getOrCreateCart(userId);

    // Check by productId (Primary) or name (Fallback)
    let existingIndex = cart.items.findIndex(item => 
      item.productId === productId || 
      item.name.toLowerCase() === name.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Same product found → Increment quantity
      cart.items[existingIndex].quantity += quantity;
      logger.info(`Quantity updated for product ${productId || name}`);
    } else {
      // New product → Add as new item
      cart.items.push({ 
        productId, 
        name, 
        price, 
        quantity 
      });
      logger.info(`New item added: ${name}`);
    }

    await cart.save();

    res.json({ 
      message: existingIndex !== -1 ? 'Quantity updated' : 'New item added', 
      items: cart.items 
    });
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
