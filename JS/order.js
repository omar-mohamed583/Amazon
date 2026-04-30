import {submittedOrders} from '../Data/submittedOrders.js';
import {products} from '../Data/products.js';
import {cart, saveToStorage} from '../Data/data.js';
import {deliveryOptions, calcDate} from '../Data/deliveryOption.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const cardContainer = document.querySelector('.orders-container');
const cartCount = document.querySelector('.cart span');
const openMenuBtn = document.querySelector('.burger-menu');
const menu = document.querySelector('.links');

openMenuBtn.addEventListener('click', () => {
  if (menu.classList.contains('open')) {  
    menu.classList.remove('open');
    menu.style.translate = '120%';
  } else {
    menu.classList.add('open');
    menu.style.translate = '0';
  }
});

let count = 0;
cart.forEach(item => count += item.quantity);

cartCount.textContent = `${count}`;

function generateHtml() {
  cardContainer.innerHTML = ''; 
  let fullHtml = '';

  if (submittedOrders.length) {

  submittedOrders.forEach(order => {

    function createProduct() {
      let htmlForProducts = '';
      
      order.cart.forEach( cartProduct => {

        const dateString = calcDate('MMMM D', deliveryOptions.find(option => option.id === (cartProduct.deliveryOptionId)).deliveryDays, dayjs(order.orderPutDate)); 
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

                <button class="track-package" data-order-id="${order.orderId}" data-product-id="${cartProduct.productId}">Track Package</button>
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

          fullHtml += html;
        }); 
    cardContainer.innerHTML = fullHtml; 

  } else {

    cardContainer.innerHTML = `
    <div style="text-align: center; font-size: 1.2rem; font-weight: 600;">No Orders Yet</div>
    `;
  }
};
generateHtml();

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const bodies =  document.querySelectorAll('.card-body');
    bodies.forEach(body => {
      body.style.height = '0px';
    });
  })
});

let resizeTimer;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.querySelectorAll('.card-body').forEach(body => {
      if (body.style.height !== '0px') {
        body.style.transition = 'none';
        body.style.height = 'auto';
        const newHeight = body.scrollHeight;
        body.style.height = newHeight + 'px';
        requestAnimationFrame(() => {
          body.style.transition = '';
        });
      }
    });
  }, 100);
});

const cards = document.querySelectorAll('.card');
const closeInput = document.querySelector('h2 p input');
const cardHeader = document.querySelectorAll('.card-header');

closeInput.addEventListener('click', () => {

  requestAnimationFrame(() => {
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
  })
});


cards.forEach(card => {
  const nextBody = card.querySelector('.card-body');
  const cardHeader = card.querySelector('.card-header');
  cardHeader.addEventListener('click', () => {
    requestAnimationFrame(() => {
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
});

const buyBtns = document.querySelectorAll('.buy-again');

let time;

buyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const productId = btn.dataset.productId;
    let inCart = false;

    cart.forEach(item => {
      if (item.productId === productId) {

        count++;
        inCart = true;
        item.quantity++;
        saveToStorage();
      };
    });

    if (!inCart) {

      count++;

      cart.unshift({
        productId,
        quantity: 1,
        deliveryOptionId: '1'
      });
      saveToStorage();
    }

    window.innerWidth > 400 ? btn.style.width = '134.9px' : btn.style.width = '100%';
    btn.style.justifyContent = 'center';
    cartCount.textContent = `${count}`;
    btn.innerHTML = 'Added ✔️';


    if (time) {
      clearTimeout(time);
    }

    time = setTimeout(() => {
      btn.innerHTML = `
      <img src="https://supersimple.dev/projects/amazon/images/icons/buy-again.png" aria-hidden="true">
      Buy it again`;

      if (window.innerWidth > 400) {
        btn.style.width = 'fit-content';
        btn.style.justifyContent = 'unset';
      }
    },1000);
  });
});

const trackBtns = document.querySelectorAll('.track-package');

trackBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const {orderId , productId} = btn.dataset;

    window.location.href = `../tracking.html?orderId=${orderId}&productId=${productId}`;
  });
});

const search = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');

search
  .addEventListener('click', () => {
    window.location.href = `./index.html?search=${searchInput.value?.toLowerCase().split(' ').join('+')}`;
  });

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') window.location.href = `./index.html?search=${searchInput.value?.toLowerCase().split(' ').join('+')}`;
});