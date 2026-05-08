require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const expensesRouter = require('./routes/expenses');
const budgetsRouter = require('./routes/budgets');
const analyticsRouter = require('./routes/analytics');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection — Singleton pattern with connection pooling
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,        // Connection pool for concurrent requests
      minPoolSize: 2,         // Keep 2 warm connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log('Connected to MongoDB (pooled)');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
connectDB();

// Passport Config
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id }).lean();
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Gzip/Brotli compression — reduces response size by ~70%
app.use(compression());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.set('trust proxy', 1);
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`ExpenseIQ server running at http://localhost:${PORT}`);
});
