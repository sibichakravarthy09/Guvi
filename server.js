require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require("./routes/messageRoutes");


const app = express();

// Middleware
app.use(express.json());

// Update CORS to allow Netlify frontend
app.use(cors({
  origin: ['http://localhost:3000', 'https://crmestate-frontend.netlify.app'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/messages", messageRoutes);


// Database Connection
mongoose.connect(process.env.MONGO_URI, {
 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
