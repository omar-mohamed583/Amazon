import { submittedOrders } from "../Data/submittedOrders.js";
import { products } from '../Data/products.js';
import { calcDate , deliveryOptions} from "../Data/deliveryOption.js";
import { calcPrice } from "../Data/priceCalcution.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';



const errMsg = document.querySelector('.order-not-found');
const packContainer = document.querySelector('.package-container'); 
const openMenuBtn = document.querySelector('.burger-menu');
const menu = document.querySelector('.links');
const productId = new URL(window.location.href).searchParams.get('productId');
const orderId = new URL(window.location.href).searchParams.get('orderId');
const orderStatusKey = `orderStatus-${productId}-${orderId}`;

openMenuBtn.addEventListener('click', () => {
  if (menu.classList.contains('open')) {  
    menu.classList.remove('open');
    menu.style.translate = '120%';
  } else {
    menu.classList.add('open');
    menu.style.translate = '0';
  }
});

let orderStatus = JSON.parse(localStorage.getItem(orderStatusKey)) || 'Ordered';

function generateHtml() {
  const order = submittedOrders.find(order => order.orderId === orderId );
  if (order) {
    
    const orderProduct = products.find(product => product.id === productId);
    const days = deliveryOptions.find(option => option.id === (order.cart.find(i => i.productId === productId).deliveryOptionId)).deliveryDays;
    const orderProductDate = calcDate('dddd, MMMM D', days, dayjs(order.orderPutDate));
    const quantity = order.cart.find(i => i.productId === productId).quantity;

    const html = `
    <div class="card-header">
      <div>
        <h4>Order ID: <span class="id">${orderId}</span></h4>
        <h5>Arriving on ${orderProductDate}</h5>
      </div>
      <p class="status"> Product Status: <span>${orderStatus}</span></p>
    </div>
    <div class="card-body">
      <div class="product-details">
        <img src="https://supersimple.dev/projects/amazon/${orderProduct.image}" alt="${orderProduct.name}">
        <div class="details">
          <h3 class="name">${orderProduct.name}</h3>
          <h5 class="quantity">Quantity: ${quantity}</h5>
          <h4 class="price">$${calcPrice(orderProduct.priceCents)}</h4>
        </div>
      </div>

      <div class="progress">
        <p><span class="nth-1 active"></span> Ordered</p>
        <p><span class="nth-2"></span> Preparing</p>
        <p><span class="nth-3"></span> Shipped</p>
        <p><span class="nth-4"></span> Delivered</p>
      </div>
    </div>
    `;

    packContainer.innerHTML = html;
    updateStatus(productId, orderId, dayjs(order.orderPutDate), dayjs(order.orderPutDate).add(days, 'days'));
  }
}

try {
  generateHtml();

} catch (err) {

  packContainer.innerHTML = '';
  errMsg.classList.add('show');
  errMsg.classList.remove('hide');
  throw new Error('Failed To Render The Page, Try Again Later!',{cause: err});
}


function updateStatus(id, orderId, putDate, arrivingDate) {
  const status = document.querySelector('.status span');

  switch (orderStatus) {
    case 'Ordered':
      status.textContent = 'Ordered';
      status.style.color = '#b85c1a';
      break;
    case 'Preparing':
      status.textContent = 'Preparing';
      status.style.color = '#008478';
      break;
    case 'Shipped':
      status.textContent = 'Shipped';
      status.style.color = '#3F51B5';
      break;
    case 'Delivered':
      status.textContent = 'Delivered';
      status.style.color = '#417d2e';
      break;
  }

  
  let count = JSON.parse(localStorage.getItem(`progress-${id}-${orderId}`)) || 1; 
  let time = JSON.parse(localStorage.getItem(`time-${id}-${orderId}`)) || 5000;

  if (!time) {

    if (count === 2) {
      time = 7000;
    } else if (count === 3) {
      time = arrivingDate.diff(putDate);
    } else if (count === 5) {
      document
        .querySelectorAll(`.progress  [class*=nth-]`).forEach( item => {
        item.classList.add('active');
        });
      time = 0;
    }

  } else if (time === 5000) {
    document.querySelector('.progress  .nth-1').classList.add('active');
    count = 2;
    time = 7000;

  } else if (time === 7000) {
    document.querySelector('.progress  .nth-1').classList.add('active');
    document.querySelector('.progress  .nth-2').classList.add('active');
    count = 3;
    time = arrivingDate.diff(putDate);
  } else if (time > 0) {
    document.querySelectorAll('.progress p:not(:last-of-type) [class*="nth-"]')
    .forEach( item => item.classList.add('active'));
    count = 4;
    time = 0;
  } else {
    document
      .querySelectorAll(`.progress  [class*=nth-]`).forEach( item => item.classList.add('active'));
    count = 5;
  }

  if (count < 5) {

    setTimeout(() => {
  
      document
        .querySelector(`.progress  .nth-${count}`).classList.add('active');
  
        orderStatus = count === 1 ?
        'Ordered' : count === 2 ?
        'Preparing' : count === 3 ?
        'Shipped' : count === 4 ?
        'Delivered' : false;

        localStorage.setItem(`orderStatus-${id}-${orderId}`, JSON.stringify(orderStatus));
        count++;
        localStorage.setItem(`progress-${id}-${orderId}`, JSON.stringify(count));
        localStorage.setItem(`time-${id}-${orderId}`, JSON.stringify(time));

        updateStatus(id, orderId, putDate,arrivingDate);
    }, time);

  } else {
    document
    .querySelectorAll(`.progress  [class*="nth-"]`).forEach(span => span.classList.add('active'));
  }
}

const search = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');

search
  .addEventListener('click', () => {
    window.location.href = `./index.html?search=${searchInput.value?.toLowerCase().split(' ').join('+')}`;
  });

searchInput.addEventListener('keydown', e => {
  console.log(e.key);
  if (e.key === 'Enter') window.location.href = `./index.html?search=${searchInput.value?.toLowerCase().split(' ').join('+')}`;
});