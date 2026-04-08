import {calcPrice, cart, products} from '../Data/data.js';

const productContainer = document.querySelector('.products');
const itemsCount = document.querySelector('.checkout > output');
const emptyCartDiv = document.querySelector('.empty-cart');
const updateQuantity = document.querySelector('#updateQuantity');
const itemsCountSpan = document.querySelector('.items-count');

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
  }
};


function createDom() {
  productContainer.innerHTML = '';
  cart.forEach(cartItem => {
    let obj;
    let deliveryDate = 'Wednesday, April 15';
    const productId = cartItem.productId;

    products.forEach(product => {
      if (product.id === productId) obj = product; 
    });

    let html = `
      <div class="card">
        <h3>Delivery Date: <span class="delivery-date">${deliveryDate}</span></h3>
      
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
      
            <div>
              <input type="radio" value="Wednesday, April 15" id="date-input-${obj.id}-1" checked name="date-input-${obj.id}">
              <label for="date-input-${obj.id}-1">
                Wednesday, April 15
                <span>FREE Shipping</span>
              </label>
            </div>
      
            <div>
              <input type="radio" value="Thursday, April 9" name="date-input-${obj.id}" id="date-input-${obj.id}-2">
              <label for="date-input-${obj.id}-2">
                Thursday, April 9
                <span>$4.99 - Shipping</span>
              </label>
            </div>
            
            <div>
              <input type="radio" value="Tuesday, April 7" name="date-input-${obj.id}" id="date-input-${obj.id}-3">
              <label for="date-input-${obj.id}-3">
                Tuesday, April 7
                <span>$9.99 - Shipping</span>
              </label>
            </div>
            
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
  if (quantityInput.value) {
    updateInfo('dialog')
  }
});

function deleteItems(id) {
  const index = cart.findIndex(item => item.productId === id);
  if (index > -1) {
    cart.splice(index, 1);
  }
  updateInfo();
  createDom()
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
}