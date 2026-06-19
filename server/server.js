const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');

// ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// helper
function getFile(client) {
  return path.join(DATA_DIR, `${client}.json`);
}

// GET products
app.get('/api/:client/products', (req, res) => {
  const file = getFile(req.params.client);

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]');
  }

  const data = fs.readFileSync(file, 'utf8');
  res.json(JSON.parse(data));
});

// POST products
app.post('/api/:client/products', (req, res) => {
  const file = getFile(req.params.client);

  fs.writeFileSync(file, JSON.stringify(req.body, null, 2));

  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
