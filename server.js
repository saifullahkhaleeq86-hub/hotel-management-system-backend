// server.js - Hotel Chain Core API Server
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const JWT_SECRET = "hotel_secret_key_123";

// Mock Database for Hotel Room Bookings
let hotelBookings = [
  { id: 1, guestName: "John Doe", roomType: "Deluxe Suite", roomNumber: "101", status: "Reserved" },
  { id: 2, guestName: "Jane Smith", roomType: "Executive King", roomNumber: "205", status: "Occupied" }
];

// Auth Middleware for Staff Security
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// 1. Hotel Staff / Admin Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, message: "Login successful!" });
  }
  res.status(400).json({ message: "Invalid credentials" });
});

// 2. GET All Hotel Bookings
app.get('/api/bookings', authenticateToken, (req, res) => {
  res.json(hotelBookings);
});

// 3. POST New Guest Booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  const newBooking = { id: hotelBookings.length + 1, ...req.body };
  hotelBookings.push(newBooking);
  res.status(201).json(newBooking);
});

// 4. DELETE / Cancel Booking
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  hotelBookings = hotelBookings.filter(b => b.id !== id);
  res.json({ message: "Booking cancelled successfully" });
});

app.listen(PORT, () => console.log(`Hotel Backend running on http://localhost:${PORT}`));