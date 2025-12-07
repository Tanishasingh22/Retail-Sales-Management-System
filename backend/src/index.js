const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/sales');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/sales', salesRoutes);

// simple health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
