const { isNonNegativeInteger } = require('../utils/validation');
const Product = require('./Product');

/**
 * Value Class for the CartProduct object
 * Representing the information of how many of a given item is inside the cart
 */
class CartProduct {
  /**
   * @param {Product} product
   * @param {Number} count how many of this product is in the cart
   */
  constructor(product, count) {
    if (!(product instanceof Product)) {
      throw new Error('product should be instance of the Category class');
    }

    if (!isNonNegativeInteger(count)) {
      throw new Error('count should be a positive integer for CartProduct');
    }

    this.product = product;
    this.count = count;
  }

  /**
   * @param {Product|null} product
   * @returns {boolean}
   */
  productEquals(product) {
    return this.product.equals(product);
  }
}

module.exports = CartProduct;
