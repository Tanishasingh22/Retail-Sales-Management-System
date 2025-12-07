const service = require('../services/salesService');

async function getSales(req, res) {
  try {
    const result = await service.querySales(req.query);  // <-- FIXED
    res.json(result);
  } catch (err) {
    console.error("Sales API Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getSales };
