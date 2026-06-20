fetch('https://product-cms-api.onrender.com/api/${client}/products')
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
  });
