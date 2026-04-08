import {products} from '../Data/products.js';
export const cart = [];
const cartItemsSpan = document.querySelector('.cart span');
let cartItemsCount = 0;
const addItem = document.querySelector('.add');
const cardContainer = document.querySelector('.card-container');

function initializeShop() {
  products.forEach((product) => {
    const html = `
<div class="card">
    <img src="https://supersimple.dev/projects/amazon/${product.image}" alt="${product.name}">
    <p>${product.name}</p>
    <div class="rate">
      <img src="https://supersimple.dev/projects/amazon/images/ratings/rating-${product.rating.stars === 4.5 ? 45 : product.rating.stars}.png" alt="stars-img">
      <span>${product.rating.count}</span>
    </div>
    <span>$${(product.priceCents / 100).toFixed(2)}</span>
    <select class="js-${product.id}">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
    </select>
    <div class="added-to-cart-${product.id}">✅ Added</div>
    <button data-product-id="${product.id}">Add To Cart</button>
    </div>`;
      
      cardContainer.innerHTML += html;
    });

  cardContainer.innerHTML += '<button class="add-item" aria-label="Add Product">+</button>';

  cardContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-item')) {
      dialog.showModal();
    }
  });

  function addItemToContainer() {
    const image = document.querySelector('#link-input').value;
    const name = document.querySelector('#product-desc').value;
    const stars = Number(document.querySelector('#star-nums').value);
    const count = Number(document.querySelector('#star-count').value) || 0;
    const priceCents = (Number(document.querySelector('#price').value).toFixed(2)) * 100;
    const html = `
    <div class="card">
    <img src="https://supersimple.dev/projects/amazon/${image}" alt="${name}">
    <p>${name}</p>
    <div class="rate">
    <img src="https://supersimple.dev/projects/amazon/images/ratings/rating-${stars === 4.5 ? 45 : stars}.png" alt="stars-img">
    <span>${count}</span>
    </div>
    <span>$${priceCents / 100}</span>
    <select>
    <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
      </select>
      <div class="added-to-cart-${id}">✅ Added</div>
      <button>Add To Cart</button>
  </div>`;

    cardContainer.innerHTML += html;
    // ID Still Not Added
    products.push({
      image,
      name,
      rating: {
        stars,
        count
      },
      priceCents
    });

    const button = document.querySelector('.add-item');
    if (button) button.remove();
    cardContainer.innerHTML += '<button class="add-item" aria-label="Add Product">+</button>';
    console.log(products)
  }

  // Add To Cart Behavior 
  const cardBtns = document.querySelectorAll('.card > button');
  let time;

  cardBtns
    .forEach((button) => {
    button.addEventListener('click', () => {
      const {productId} = button.dataset;
      let itemMatches;
      const quantity = Number(document.querySelector(`.js-${productId}`).value);

        cart.forEach(item => {
          if (productId === item.productId) {
            itemMatches = item;
          }
        });

        if (itemMatches) {
          itemMatches.quantity += quantity;

        } else {
          cart.push({
            productId,
            quantity
          });

        }

        cartItemsCount = 0;
        // Calculate Items Quantity
        cart.forEach(item => {
          cartItemsCount += item.quantity;
        });

        // Add The Quantity To the Cart Element
        cartItemsSpan.textContent = cartItemsCount;


        // Added Message Behavior
        const addedMsg = document.querySelector(`.added-to-cart-${productId}`);
        addedMsg.style.visibility = 'visible';
        addedMsg.style.opacity = '1';
        if (time) {
          clearTimeout(time)
          time = setTimeout(() => {
            addedMsg.style.visibility = 'hidden';
            addedMsg.style.opacity = '0';
          }, 1000);
        } else {
          time = setTimeout(() => {
            addedMsg.style.visibility = 'hidden';
            addedMsg.style.opacity = '0';
          }, 1000);
        }
      });
    });
}

console.log('cardContainer element:', cardContainer);
if (cardContainer) {
  console.log('Initializing shop...');
  initializeShop();
} else {
  console.log('Cart page detected - shop NOT initialized');
}