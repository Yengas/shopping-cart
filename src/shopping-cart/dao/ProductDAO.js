const DataAccessObject = require('./DataAccessObject');
const Product = require('../models/Product');

/**
 * ProductDAO that does crud for the product objects
 * @extends DataAccessObject
 */
class ProductDAO extends DataAccessObject {
  constructor(initialData = []) {
    super(Product, initialData);
  }
}

module.exports = ProductDAO;
