const savedOrders = localStorage.getItem('submittedOrders');
export let submittedOrders = savedOrders ? JSON.parse(savedOrders) : [];

export function saveSubmit() {
  localStorage.setItem('submittedOrders', JSON.stringify(submittedOrders));
}