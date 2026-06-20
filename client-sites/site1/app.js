const API_URL = 'https://product-cms-api.onrender.com';
const client = 'site1';

fetch(`${API_URL}/api/${client}/products`)
  .then((r) => r.json())
  .then((products) => {
    const container = document.getElementById('products');

    container.innerHTML = products
      .map(
        (p) => `
        <div>
          <h3>${p.name}</h3>
          <p>${p.price}</p>
        </div>
      `,
      )
      .join('');
  })
  .catch((err) => {
    console.error('Fetch error:', err);
  });
