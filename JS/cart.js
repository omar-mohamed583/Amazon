import {calcPrice, cart, products, saveToStorage} from '../Data/data.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, updateDeliveryOption} from '../Data/deliveryOption.js';
import {submittedOrders, saveSubmit} from '../Data/submitedOrders.js';

const productContainer = document.querySelector('.products');
const itemsCount = document.querySelector('.checkout > output');
const emptyCartDiv = document.querySelector('.empty-cart');
const updateQuantity = document.querySelector('#updateQuantity');
let totalPriceCents = 0;

function updateInfo(action = '') {
  // Update The Display Of Empty Cart  
  if (cart.length) {
    emptyCartDiv.style.display = 'none';
  } else {
    emptyCartDiv.style.display = 'flex';
  }

  // Updates Items Count In Header
  const itemsCountSpan = document.querySelector('.items-count');
  const updateItemsQuantity = () => {
    let count = 0;
    cart.forEach(item => count += item.quantity);
    
    itemsCountSpan.innerHTML = `${count}`;
    itemsCount.innerHTML = `${count} Items`;
  }
  updateItemsQuantity();
  updatePrices();

  // Update After Submit quantity

  if (action === 'dialog') {
    const id = document.querySelector('dialog .product-name').dataset.productId;
    const quantitySpan = document.querySelector(`.quantity .id-${id}`);
    const quantityInputValue = Number(document.querySelector('dialog #quantity').value);

    cart.forEach(item => {
      if (item.productId === id) {
        item.quantity = quantityInputValue;
        quantitySpan.innerHTML = item.quantity;
      }
    })
    updateItemsQuantity();
    updatePrices();
    saveToStorage();
  }
};


function createDom() {
  productContainer.innerHTML = '';

  cart.forEach(cartItem => {
    let obj;
    const productId = cartItem.productId;

    products.forEach(product => {
      if (product.id === productId) obj = product; 
    });

    const deliveryOptionId = cartItem.deliveryOptionId;
    let matchingObj;

    deliveryOptions.forEach(option => {
      if (option.id === deliveryOptionId) matchingObj = option;
    });
    const today = dayjs();

    const deliveryDate = today.add(
      matchingObj.deliveryDays,
      'days'
    );

    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    let html = `
      <div class="card appear">
        <h3>Delivery Date: <span class="delivery-date" data-id="${obj.id}">${dateString}</span></h3>
      
        <div class="card-content">
          <img src="https://supersimple.dev/projects/amazon/${obj.image}" alt="item png">
      
          <div class="card-details">
      
            <h4 class="item-name" title="${obj.name}">${obj.name}</h4>
            <span class="item-price">$${calcPrice(obj.priceCents)}</span>
            <div class="quantity">Quantity:
              <span class="id-${obj.id}">${cartItem.quantity}</span>
            </div>
      
            <div>
              <button class="update-quantity" data-product-id="${obj.id}">Update</button>
              <button class="delete-quantity" data-product-id="${obj.id}">Delete</button>
            </div>
            
          </div>
      
          <div class="date-option">
            <h4>Choose a delivery option:</h4>

            ${deliveryOptionsHTML(obj,cartItem)}

          </div>
      
        </div>
      </div>`;

    productContainer.innerHTML += html;
  });
  
  const updateBtn = document.querySelectorAll('.update-quantity');
  updateBtn.forEach( btn => {
    const productId = btn.dataset.productId;

    btn.addEventListener('click', () => {
      updateForm(productId);
    })
  });

  const deleteBtn = document.querySelectorAll('.delete-quantity');

  deleteBtn.forEach(btn => {
    const productId = btn.dataset.productId;
  
    btn.addEventListener('click', () => {
    deleteItems(productId);
    })
  })
}

createDom();
updateInfo();

function deliveryOptionsHTML(obj,cartItem) {
  let html = '';
  let count = 1;

  deliveryOptions.forEach(option => {
    const today = dayjs();

    const deliveryDate = today.add(
      option.deliveryDays,
      'days'
    );

    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    const priceString = option.priceCents === 0 
    ? 'FREE'  
    : `$${calcPrice(option.priceCents)} -`;

    const isChecked = option.id === cartItem.deliveryOptionId;

    html+= `
            <div>
              <input type="radio" value="Wednesday, April 15" id="date-input-${obj.id}-${count}" ${isChecked ? 'checked' : ''} data-count="${count}" data-product-id="${obj.id}"
              name="date-input-${obj.id}">
              <label for="date-input-${obj.id}-${count}">
                ${dateString}
                <span>${priceString} Shipping</span>
              </label>
            </div>
            `;
    count++;
  });

  return html;
}

const submitUpdate = document.querySelector('dialog button[type="submit"]')
const quantityInput = document.querySelector('dialog #quantity');


function updateForm(id) {
  const nameInput = document.querySelector('dialog .product-name');
  const priceInput = document.querySelector('dialog .price');
  const quantityInput = document.querySelector('dialog #quantity');
  let quantity = cart.find(item => item.productId === id).quantity;

  let productsObject;
  products.forEach(product => {
    if (product.id === id) productsObject = product; 
  });

  nameInput.value = productsObject.name;
  nameInput.dataset.productId = id;
  priceInput.value = calcPrice(productsObject.priceCents);
  quantityInput.value = quantity;

  updateQuantity.showModal();
}

submitUpdate.addEventListener('click' , () => {
  if (quantityInput.value > 0 && quantityInput.value < 100) {
    updateInfo('dialog');
  }
});

function deleteItems(id) {
  const index = cart.findIndex(item => item.productId === id);
  if (index > -1) {
    cart.splice(index, 1);
  }
  updateInfo();
  document.querySelector(`.card:has([data-id="${id}"])`).remove();
  saveToStorage();
}

function updatePrices() {
  // Querying Prices Dom Elements 
  const itemsPriceSpan = document.querySelector('.items-price');
  const itemsShippingSpan = document.querySelector('.items-shipping'); 
  const totalPriceNoTaxSpan = document.querySelector('.total-no-tax'); 
  const taxPriceSpan = document.querySelector('.tax-price'); 
  const totalPriceSpan = document.querySelector('.total-price');

  // Calculate price of each field
  let itemsPrice = 0;
  cart.forEach(item => {
    products.forEach(product => {
      if (product.id === item.productId) itemsPrice += (item.quantity * product.priceCents);
    });
  });
  itemsPriceSpan.innerHTML = `$${calcPrice(itemsPrice)}`;

  let totalTaxCents = 0;
  cart.forEach(item => {
    totalTaxCents += deliveryOptions[Number(item.deliveryOptionId) - 1].priceCents;
  });

  itemsShippingSpan.innerHTML = `$${calcPrice(totalTaxCents)}`;

  totalPriceNoTaxSpan.innerHTML = `$${calcPrice(itemsPrice + totalTaxCents)}`;

  let pricePercentage = (itemsPrice + totalTaxCents) * (10 / 100)
  taxPriceSpan.innerHTML = `$${calcPrice(pricePercentage)}`;

  totalPriceSpan.innerHTML = `$${calcPrice(pricePercentage + (itemsPrice + totalTaxCents))}`;

  totalPriceCents = pricePercentage + (itemsPrice + totalTaxCents);
}

updatePrices();

const errorDiv = document.querySelector('.cart-error');
let time;

const ids = [];

function generateId() {
  let id = '';
  let idMatches = false;

  for (let i = 0; i < 4; i++) {
    id += `${Math.floor(Math.random() * 100 * Math.random() * 100 + Math.random() * 100)}${i === 3 ? '' : '-'}`;
  }

  ids.forEach(idPar => idPar === id ? idMatches = true : false);
  if (!idMatches) ids.push(id);
  return id;
}


document.querySelector('.place-order').addEventListener('click', () => {
  if (cart.length) {
    window.location.href = './orders.html';
    submittedOrders.unshift({
      orderId: `${generateId()}`,
      cart,
      placeDate: dayjs().format('MMMM D'),
      totalPriceCents
    });
    saveSubmit();

    cart.length = 0;
    saveToStorage();
    return;
  }

  if (time) {
    clearTimeout(time);
  }

  // Show the error message
  errorDiv.style.translate = '0 0';
  const innerDiv = errorDiv.querySelector('div');
  innerDiv.style.scale = '0 1';

  time = setTimeout(() => {
    errorDiv.style.translate = '102% 0';
    innerDiv.style.transition = 'scale 0ms 30ms';
    innerDiv.style.scale = '1 1';
    setTimeout( () => {
      innerDiv.style.transition = 'scale 1.4s linear';
    }, 100)
  }, 1400);
});

document.querySelectorAll('.date-option div')
  .forEach(element => {
    element.addEventListener('click', () => {

      const {count, productId} = element.querySelector('input').dataset;

      updateDeliveryOption(productId,count);

      cart.forEach(item => {
        document.querySelectorAll('.delivery-date').forEach( one => {

          if ( item.productId === one.dataset.id ) {

            const date = (dayjs().add(
              (deliveryOptions.find(option => option.id === item.deliveryOptionId).deliveryDays)  ,
              'days'
            )).format('dddd, MMMM D');

            one.innerHTML = date;
            updatePrices();
        };
      });
    });
  })
});