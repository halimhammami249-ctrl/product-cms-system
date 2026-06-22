fetch('products.json')
  .then((response) => response.json())
  .then((products) => {
    const container = document.getElementById('products');

    products.forEach((product) => {
      container.innerHTML += `
        <div>
          <h2>${product.name}</h2>
          <img src="${product.image}" width="150">
          <p>${product.price}$</p>
          <p>${product.description}</p>
        </div>
      `;
    });
  });
