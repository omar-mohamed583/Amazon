import {products, cart, calcPrice, saveToStorage} from '../Data/data.js';

const cartItemsSpan = document.querySelector('.cart span');
let cartItemsCount = 0;

cart.forEach(item => cartItemsCount += item.quantity);

if (cartItemsSpan) cartItemsSpan.innerHTML = cartItemsCount;

const addItem = document.querySelector('.add');
const cardContainer = document.querySelector('.card-container');
const openMenuBtn = document.querySelector('.burger-menu');
const menu = document.querySelector('.links');

const searchParams = new URL(window.location.href).searchParams?.get('search');

openMenuBtn.addEventListener('click', () => {
  if (menu.classList.contains('open')) {  
    menu.classList.remove('open');
    menu.style.translate = '120%';
  } else {
    menu.classList.add('open');
    menu.style.translate = '0';
  }
});

function initializeShop() {
  let fullHtml = '';
  products.forEach(product => {
    const html = `
  <div class="card appear">
    <img src="https://supersimple.dev/projects/amazon/${product.image}" alt="${product.name}">
    <p title="${product.name}">${product.name}</p>
    <div class="rate">
      <img src="https://supersimple.dev/projects/amazon/images/ratings/rating-${product.rating.stars === 4.5 ? 45 : product.rating.stars}.png" alt="stars-img">
      <span>${product.rating.count}</span>
    </div>
    <span>$${calcPrice(product.priceCents)}</span>
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
      fullHtml += html;
  });
  cardContainer.innerHTML += fullHtml;

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
          saveToStorage();

        } else {
          cart.push({
            productId,
            quantity,
            deliveryOptionId: '1'
          });
          saveToStorage();

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

const search = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');


function searchItems(searchValues) {
  const matchingItems = [];

  if (searchValues) {

    searchValues.forEach( value => {
      products.forEach(product => {
        if (product.name.toLowerCase().includes(value) && !matchingItems.find(item => item.id === product.id)) matchingItems.push(product);
      });
    })
  }

  renderSearchedItems(matchingItems);
}

function renderSearchedItems(itemsArray) {
  searchInput.value = searchParams.split('+').join(' ');
  let fullHtml = '';

  if (itemsArray.length) {

    
      itemsArray.forEach(item => {
        const html = `
        <div class="card">
          <img src="https://supersimple.dev/projects/amazon/${item.image}" alt="${item.name}">
          <p title="${item.name}">${item.name}</p>
          <div class="rate">
            <img src="https://supersimple.dev/projects/amazon/images/ratings/rating-${item.rating.stars === 4.5 ? 45 : item.rating.stars}.png" alt="stars-img">
            <span>${item.rating.count}</span>
          </div>
          <span>$${calcPrice(item.priceCents)}</span>
          <select class="js-${item.id}">
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
          <div class="added-to-cart-${item.id}">✅ Added</div>
          <button data-product-id="${item.id}">Add To Cart</button>
        </div>`;
    
        fullHtml += html;
      });
  } else {
    fullHtml = `<p style="text-align:center;padding-top:5rem;font-size: 1.1rem;font-weight:600">No results found for "${searchParams.split('+').join(' ')}"</p>`;
  }

  cardContainer.innerHTML = fullHtml;

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
          saveToStorage();

        } else {
          cart.push({
            productId,
            quantity,
            deliveryOptionId: '1'
          });
          saveToStorage();

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

search
  .addEventListener('click', () => {
    const trimmed = searchInput.value.toLowerCase().trim();
    window.location.href = `./?search=${trimmed.split(' ')}`;
  });

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') window.location.href = `./index.html?search=${searchInput.value?.toLowerCase().split(' ').join('+')}`;
});

if (searchParams) {
  searchItems(searchParams.toLowerCase().split(' ').filter(value => value !== ''));
} else {
  initializeShop();
}