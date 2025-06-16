const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Environment
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI not set in .env');
  process.exit(1);
}

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // Exit app if DB connection fails
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/sessions', require('./routes/sessions'));

// Default route (optional)
app.get('/', (req, res) => {
  res.send('📚 Study Tracker API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// Error handling all at one place 

const errorHandler = require('./middleware/errorHandler');


// ⬇️ Error handler should come LAST
app.use(errorHandler);
