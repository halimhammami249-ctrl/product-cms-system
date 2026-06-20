const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// =====================
// SIMPLE AUTH (NO DB)
// =====================
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '1234';
const ADMIN_TOKEN = 'secure-token-123';

// =====================
// LOGIN
// =====================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

// =====================
// AUTH MIDDLEWARE
// =====================
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (token === ADMIN_TOKEN) {
    return next();
  }

  return res.status(403).json({ error: 'Unauthorized' });
}

// =====================
// GET PRODUCTS (PUBLIC)
// =====================
app.get('/api/:site/products', (req, res) => {
  const site = req.params.site;

  try {
    const data = fs.readFileSync(`data/${site}.json`);
    res.json(JSON.parse(data));
  } catch (err) {
    res.json([]);
  }
});

// =====================
// SAVE PRODUCTS (PROTECTED)
// =====================
app.post('/api/:site/products', auth, (req, res) => {
  const site = req.params.site;
  const data = req.body;

  fs.writeFileSync(`data/${site}.json`, JSON.stringify(data, null, 2));

  res.json({ success: true });
});

// =====================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on', PORT));
