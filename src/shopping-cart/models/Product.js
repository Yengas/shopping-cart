const { isId, isNonEmptyString, isNonNegativeNumber } = require('../utils/validation');
const Category = require('./Category');

/**
 * Value Class for the Product object
 */
class Product {
  /**
   * @param {String|null} id
   * @param {String} title
   * @param {Number} price is in cents
   * @param {Category} category
   */
  constructor(id, title, price, category) {
    if (id !== null && !isId(id)) {
      throw new Error('id should be a valid id for Product');
    }

    if (!isNonEmptyString(title)) {
      throw new Error('title should be a non empty string for Product');
    }

    if (!isNonNegativeNumber(price)) {
      throw new Error('price should be a positive integer for Product');
    }

    if (!(category instanceof Category)) {
      throw new Error('category should be of type Category');
    }

    this.id = id;
    this.title = title;
    this.price = price;
    this.category = category;
  }

  /**
   * Create the same product object, with an id assigned to it.
   * @param idStr
   * @returns {Product}
   */
  withId(idStr) {
    return new Product(idStr, this.title, this.price, this.category);
  }

  /**
   * Compare the given object with this product, to check if they are the same.
   * @param {Product|null} other
   * @returns {boolean}
   */
  equals(other) {
    return other && this.id === other.id;
  }
}

module.exports = Product;
