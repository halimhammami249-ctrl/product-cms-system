const API_URL = 'https://product-cms-api.onrender.com';

let token = '';
let products = [];
let client = '';

// =====================
// LOGIN
// =====================
async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    alert('Login success');
  } else {
    alert('Login failed');
  }
}

// =====================
// LOAD PRODUCTS
// =====================
async function load() {
  client = document.getElementById('client').value;

  if (!client) return alert('Select client');

  const res = await fetch(`${API_URL}/api/${client}/products`);
  products = await res.json();

  render();
}

// =====================
// RENDER UI
// =====================
function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  products.forEach((p, i) => {
    app.innerHTML += `
      <div style="margin-bottom:10px;">
        <input value="${p.name}" onchange="products[${i}].name=this.value" />
        <input value="${p.price}" onchange="products[${i}].price=this.value" />
      </div>
    `;
  });

  app.innerHTML += `
    <button onclick="add()">Add</button>
  `;
}

// =====================
// ADD PRODUCT
// =====================
function add() {
  products.push({
    name: '',
    price: 0,
    image: '',
    description: '',
  });

  render();
}

// =====================
// SAVE (PROTECTED)
// =====================
async function save() {
  if (!token) return alert('Login required');

  await fetch(`${API_URL}/api/${client}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(products),
  });

  alert('Saved!');
}
