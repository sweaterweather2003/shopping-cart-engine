const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticate = require('../middleware/auth');
const { validateAddItem } = require('../middleware/validate');
const rateLimit = require('../middleware/rateLimit');

router.use(authenticate);
router.use(rateLimit);

router.post('/items', validateAddItem, cartController.addOrUpdateItem);
router.get('/checkout', cartController.getCheckout);
router.delete('/', cartController.clearCart);
router.delete('/items/:productId', cartController.removeItem); // Bonus

module.exports = router;