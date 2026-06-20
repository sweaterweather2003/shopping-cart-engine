// src/services/promotions.js
/**
 * Tiered Promotional Campaign Engine
 * 
 * This module handles all discount logic.
 * Easy to extend with new campaigns, rules, or even database-driven promotions.
 */

const calculatePromotion = (subtotal, uniqueItemCount) => {
  // Define tiers (configurable)
  const tiers = [
    {
      name: 'Premium',
      minSubtotal: 500,
      minUniqueItems: 8,
      discountRate: 0.25,        // 25%
      description: 'High value + diverse cart'
    },
    {
      name: 'Standard',
      minSubtotal: 200,
      minUniqueItems: 4,
      discountRate: 0.15,        // 15%
      description: 'Good cart value or variety'
    },
    {
      name: 'Basic',
      minSubtotal: 50,
      minUniqueItems: 0,
      discountRate: 0.05,        // 5%
      description: 'Starter discount'
    }
  ];

  // Find best applicable tier
  let bestTier = { name: 'None', discountRate: 0, description: 'No discount' };

  for (const tier of tiers) {
    if (
      (subtotal >= tier.minSubtotal || uniqueItemCount >= tier.minUniqueItems) &&
      tier.discountRate > bestTier.discountRate
    ) {
      bestTier = tier;
    }
  }

  const discountAmount = subtotal * bestTier.discountRate;

  return {
    tier: bestTier.name,
    discountRate: bestTier.discountRate,
    discountAmount: Math.round(discountAmount * 100) / 100, // 2 decimal places
    finalTotal: Math.max(0, subtotal - discountAmount),
    description: bestTier.description,
    appliedCriteria: {
      subtotal,
      uniqueItems: uniqueItemCount
    }
  };
};

module.exports = {
  calculatePromotion
};