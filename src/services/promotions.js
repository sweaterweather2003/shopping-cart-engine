// src/services/promotions.js
const calculatePromotion = (subtotal, uniqueItems) => {
  if (subtotal >= 500 || uniqueItems >= 8) {
    return { tier: 'Premium', discount: 0.25, description: 'High value cart' };
  }
  if (subtotal >= 200 || uniqueItems >= 4) {
    return { tier: 'Standard', discount: 0.15, description: 'Good variety cart' };
  }
  if (subtotal >= 50) {
    return { tier: 'Basic', discount: 0.05, description: 'Starter discount' };
  }
  return { tier: 'None', discount: 0, description: 'No promotion' };
};

module.exports = { calculatePromotion };