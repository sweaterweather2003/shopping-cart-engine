const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.body.userId;
  if (!userId) return res.status(401).json({ error: 'User ID required (x-user-id header)' });
  req.userId = userId;
  next();
};

module.exports = authenticate;