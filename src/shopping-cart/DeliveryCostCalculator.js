/**
 * Get distinct categories from array of CartProducts
 * @param {CartProduct[]} cartProducts
 * @returns {Category[]}
 */
const getDistinctCategoriesFromCartProducts = cartProducts => (
  Object.values(
    cartProducts
      .reduce(
        (acc, { product: { category } }) => ({ ...acc, [category.id]: category }),
        {},
      ),
  )
);

/**
 * @typedef {{
 *  deliveriesCost: Number,
 *  fixedCost: Number,
 *  productsCost: Number,
 *  totalCost: Number
 * }} DeliveryCostResult
 */

/**
 * DeliveryPostCalculator is the dynamic logistics cost calculator.
 */
class DeliveryCostCalculator {
  /**
   * @param {Number} costPerDelivery cost to transport a distinct category group items
   * @param {Number} costPerProduct cost to transport a distinct item
   * @param {Number} fixedCost for the logistics
   */
  constructor(costPerDelivery, costPerProduct, fixedCost) {
    this.costPerDelivery = costPerDelivery;
    this.costPerProduct = costPerProduct;
    this.fixedCost = fixedCost;
  }

  /**
   * Given the cart, calculate the delivery cost for it.
   * @param {Cart} cart
   * @returns {DeliveryCostResult}
   */
  calculateFor(cart) {
    const cartProducts = cart.products;
    const numberOfDeliveries = getDistinctCategoriesFromCartProducts(cartProducts).length;
    const numberOfProducts = cartProducts.length;

    // calculate the costs
    const { costPerDelivery, costPerProduct, fixedCost } = this;
    const deliveriesCost = costPerDelivery * numberOfDeliveries;
    const productsCost = costPerProduct * numberOfProducts;
    const totalCost = deliveriesCost + productsCost + fixedCost;

    return {
      deliveriesCost,
      productsCost,
      fixedCost,
      totalCost,
    };
  }
}

module.exports = DeliveryCostCalculator;
