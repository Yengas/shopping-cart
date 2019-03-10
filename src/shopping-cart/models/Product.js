const { isNonEmptyString, isNonNegativeNumber } = require('../utils/validation');
const Category = require('./Category');

/**
 * Value Class for the Product object
 */
class Product {
  /**
   * @param {String} title
   * @param {Number} price
   * @param {Category} category
   */
  constructor(title, price, category) {
    if (!isNonEmptyString(title)) {
      throw new Error('title should be a non empty string for Product');
    }

    if (!isNonNegativeNumber(price)) {
      throw new Error('price should be a positive integer for Product');
    }

    if (!(category instanceof Category)) {
      throw new Error('category should be of type Category');
    }

    this.title = title;
    this.price = price;
    this.category = category;
  }

  /**
   * Compare the given object with this product, to check if they are the same.
   * @param other
   * @returns {boolean}
   */
  equals(other) {
    return this === other;
  }
}

module.exports = Product;
