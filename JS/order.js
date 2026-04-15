import {submittedOrders} from '../Data/submitedOrders.js';
import {products} from '../Data/products.js';
import {cart, saveToStorage} from '../Data/data.js';
import {deliveryOptions} from '../Data/deliveryOption.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const cardContainer = document.querySelector('.orders-container');
const cartCount = document.querySelector('.cart span');


cartCount.textContent = `${cart.length}`;

function generateHtml() {
  cardContainer.innerHTML = ''; 

  if (submittedOrders.length) {

  submittedOrders.forEach(order => {

    function createProduct() {
      let htmlForProducts = '';
      
      order.cart.forEach( cartProduct => {
        const today = dayjs();
        const day = today.add(
          deliveryOptions[(cartProduct.deliveryOptionId) - 1].deliveryDays , 'days'
        );

        const dateString = day.format('MMMM d'); 
        products.forEach( product => {
  
          if (product.id === cartProduct.productId) {

            htmlForProducts += `
              <div class="product animate">
                <img src="https://supersimple.dev/projects/amazon/${product.image}" alt="${product.name} image" class="product-preview">
                <div class="details">

                  <h3 class="name">${product.name}</h3>

                  <p class="arriving-date">
                    Arriving On: ${dateString}
                  </p>

                  <p>Quantity: ${cartProduct.quantity}</p>

                  <button class="buy-again" data-product-id="${cartProduct.productId}">
                    <img src="https://supersimple.dev/projects/amazon/images/icons/buy-again.png" aria-hidden="true">
                    Buy it again
                    </button>
                </div>

                <button class="track-package" data-order-id="${order.orderId}">Track Package</button>
              </div>`;
            }
          });
          
        });
        return htmlForProducts;
    }

    const html = `
          <div class="card">
            <div class="card-header">
              <p>
                Order Placed: <span>${order.placeDate}</span>
              </p>

              <p>
                Total: <span>$${(order.totalPriceCents / 100).toFixed(2)}</span>
              </p>

              <p>
                Order ID: <span>${order.orderId}</span>
              </p>
            </div>

            <div class="card-body">

            ${createProduct()}

            </div>
          </div>`;

    cardContainer.innerHTML += html; 
  }); 


  } else {

    cardContainer.innerHTML = `
    <div style="text-align: center; font-size: 1.2rem; font-weight: 600;">No Orders Yet</div>
    `;
  }
};


generateHtml();

const bodies =  document.querySelectorAll('.card-body');

bodies.forEach(body => {
  const totalHeight = body.scrollHeight;
  body.style.height = totalHeight + 'px';
})

const cards = document.querySelectorAll('.card');
const closeInput = document.querySelector('h2 p input');
const cardHeader = document.querySelectorAll('.card-header');

closeInput.addEventListener('click', () => {
  const cardBody = document.querySelectorAll('.card-body');

  cardBody.forEach( ele => {
    const totalHeight = ele.scrollHeight;

    if (closeInput.checked) {

      cardHeader.forEach(header => header.classList.remove('animated-header'));

      ele.style.height = totalHeight + 'px';

    } else {
      ele.style.height = '0';

      cardHeader.forEach(header => header.classList.add('animated-header'));
    }
  })
});

cards.forEach(card => {
  const nextBody = card.querySelector('.card-body');
  const cardHeader = card.querySelector('.card-header');
  cardHeader.addEventListener('click', () => {

    if (nextBody.style.height !== '0px') {
      nextBody.style.height = '0';
      cardHeader.classList.add('animated-header');

    } else {
    const totalHeight = nextBody.scrollHeight;
      nextBody.style.height = totalHeight + 'px';
      cardHeader.classList.remove('animated-header');
    }
  });
});

const buyBtns = document.querySelectorAll('.buy-again');

let time;

buyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const productId = btn.dataset.productId;
    let inCart = false;

    cart.forEach(item => {
      if (item.productId === productId) {
        inCart = true;
        item.quantity++;
        saveToStorage();
      };
    });

    if (!inCart) {

      cart.unshift({
        productId,
        quantity: 1,
        deliveryOptionId: '1'
      });
      saveToStorage();
    }

    btn.style.width = '134.9px';
    btn.style.justifyContent = 'center';
    cartCount.textContent = `${cart.length}`;
    btn.innerHTML = 'Added ✔️';


    if (time) {
      clearTimeout(time);
    }

    time = setTimeout(() => {
      btn.innerHTML = `
      <img src="https://supersimple.dev/projects/amazon/images/icons/buy-again.png" aria-hidden="true">
      Buy it again`;
      btn.style.width = 'fit-content';
      btn.style.justifyContent = 'unset';
    },1000);
  });
});