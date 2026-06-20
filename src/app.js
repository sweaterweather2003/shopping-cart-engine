// src/app.js
require('dotenv').config();

// === ADD THESE TWO LINES AT THE VERY TOP ===
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);   // Use Google DNS

const express = require('express');
const connectDB = require('./config/db');
const cartRoutes = require('./routes/cart.routes');
const logger = require('./utils/logger');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));