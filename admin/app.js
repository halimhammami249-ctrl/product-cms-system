let products = [];
let client = '';

async function load() {
  client = document.getElementById('client').value;

  const res = await fetch(
    `const API_URL = "https://product-cms-api.onrender.com";`,
  );
  products = await res.json();

  render();
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  products.forEach((p, i) => {
    app.innerHTML += `
            <div>
                <input value="${p.name}" onchange="products[${i}].name=this.value">
                <input value="${p.price}" onchange="products[${i}].price=this.value">
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
  await fetch(`https://product-cms-api.onrender.com/api/${client}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products),
  });

  alert('Saved!');
}
