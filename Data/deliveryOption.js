import {saveToStorage, cart} from './data.js';

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