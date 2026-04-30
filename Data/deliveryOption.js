import {saveToStorage, cart} from './data.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function updateDeliveryOption(productId , deliveryOptionId) {
  let itemMatches;  

  cart.forEach(item => {
    if (productId === item.productId) {
      itemMatches = item;
    }
  });

  itemMatches.deliveryOptionId = deliveryOptionId;
  saveToStorage()
}

export function calcDate(formate = 'dddd, MMMM D', days, today) {
  const deliveryDate = today.add(
    days,
    'days'
  );
  const dateString = deliveryDate.format(
    formate
  );

  return dateString;
}