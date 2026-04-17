import { calcPrice } from "../Data/priceCalcution.js";

describe( 'Caclulate price', () => {
  it('test 0', () => {
    expect(calcPrice(0)).toEqual('0.00');
  });

  it('Test 2095', () => {
    expect(calcPrice(2095)).toEqual('20.95');
  });

  it('Test 2000.5', () => {
    expect(calcPrice(2000.5)).toEqual('20.01');
  });
});