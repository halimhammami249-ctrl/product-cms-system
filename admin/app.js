const API_URL = 'https://product-cms-api.onrender.com';

let products = [];
let client = '';

async function load() {
  client = document.getElementById('client').value;

  if (!client) {
    alert('Please select a client');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/${client}/products`);
    products = await res.json();

    render();
  } catch (err) {
    console.error('Load error:', err);
    alert('Failed to load products');
  }
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  products.forEach((p, i) => {
    app.innerHTML += `
      <div style="margin-bottom:10px;">
        <input value="${p.name}" onchange="products[${i}].name=this.value" />
        <input value="${p.price}" onchange="products[${i}].price=this.value" />
        <button onclick="deleteProduct(${i})">Delete</button>
      </div>
    `;
  });

  app.innerHTML += `<button onclick="add()">Add</button>`;
}

function add() {
  products.push({
    name: '',
    price: 0,
    image: '',
    description: '',
  });

  render();
}

function deleteProduct(i) {
  products.splice(i, 1);
  render();
}

async function save() {
  if (!client) {
    alert('Select client first');
    return;
  }

  await fetch(`${API_URL}/api/${client}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products),
  });

  alert('Saved!');
}
