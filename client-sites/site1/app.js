const API_URL = 'https://product-cms-api.onrender.com';
const client = 'site1';

fetch(`${API_URL}/api/${client}/products`)
  .then((res) => res.json())
  .then((products) => {
    const container = document.getElementById('products');

    container.innerHTML = products
      .map(
        (p) => `
        <div style="border:1px solid #ddd;padding:10px;margin:10px;">
          <h3>${p.name}</h3>
          <p>${p.price} $</p>
        </div>
      `,
      )
      .join('');
  })
  .catch((err) => console.error(err));
