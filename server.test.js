const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    return res.json({ token: "mock_jwt_token" });
  }
  res.status(400).json({ message: "Invalid credentials" });
});

describe('Hotel Chain API Automated Unit Tests', () => {
  it('should authenticate hotel staff successfully', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'wrong', password: 'user' });
    expect(res.statusCode).toEqual(400);
  });
});