const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// ✅ CORS options
const corsOptions = {
  origin: 'https://study-sync-ismn.vercel.app', // your deployed frontend on Vercel
  credentials: true, // allow cookies and headers like Authorization
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // required if using cookies

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

// Error handler (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
