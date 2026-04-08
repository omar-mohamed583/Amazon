import {cart} from '../JS/amazon.js';
import {products} from '../Data/products.js';

const productContainer = document.querySelector('.products');
const itemsCount = document.querySelector('.checkout > output');
const emptyCartDiv = document.querySelector('.empty-cart');

itemsCount.innerHTML = `${cart.length} Items`;
if (cart.length) emptyCartDiv.style.display = 'none';

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
        <img src="${obj.image}" alt="item png">
    
        <div class="card-details">
    
          <h4 class="item-name">${obj.name}</h4>
          <span class="item-price">$${(obj.priceCents / 100).toFixed(2)}</span>
          <div class="quantity">Quantity:
            <span>${cartItem.quantity}</span>
          </div>
    
          <div>
            <button class="update-quantity">Update</button>
            <button class="delete-quantity">Delete</button>
          </div>
          
        </div>
    
        <div class="date-option">
          <h4>Choose a delivery option:</h4>
    
          <div>
            <input type="radio" value="Wednesday, April 15" id="date-input1" checked name="date-input-${obj.id}">
            <label for="date-input1">
              Wednesday, April 15
              <span>FREE Shipping</span>
            </label>
          </div>
    
          <div>
            <input type="radio" value="Thursday, April 9" name="date-input-${obj.id}" id="date-input2">
            <label for="date-input2">
              Thursday, April 9
              <span>$4.99 - Shipping</span>
            </label>
          </div>
          
          <div>
            <input type="radio" value="Tuesday, April 7" name="date-input-${obj.id}" id="date-input3">
            <label for="date-input3">
              Tuesday, April 7
              <span>$9.99 - Shipping</span>
            </label>
          </div>
          
        </div>
    
      </div>
    </div>`;

  productContainer.innerHTML += html;
});
