export function calcPrice(price) {
  return (Math.round(Number(price)) / 100).toFixed(2);
}