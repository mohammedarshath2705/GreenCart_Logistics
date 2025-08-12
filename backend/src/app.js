const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/drivers');
const routeRoutes = require('./routes/routes');
const orderRoutes = require('./routes/orders');
const simulationRoutes = require('./routes/simulation');

const app = express();
app.use(cors());
app.use(express.json());

// Public
app.use('/api/auth', authRoutes);

// Protected
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/simulation', simulationRoutes);

app.get('/', (req, res) => res.send('Backend running'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
