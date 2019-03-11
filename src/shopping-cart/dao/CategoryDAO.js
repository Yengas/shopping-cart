const DataAccessObject = require('./DataAccessObject');
const Category = require('../models/Category');

/**
 * CategoryDAO that does crud for the product objects
 * @extends DataAccessObject
 */
class CategoryDAO extends DataAccessObject {
  constructor(initialData = []) {
    super(Category, initialData);
  }

  /**
   * Override CategoryDAO insert to change parent categories.
   * @param model
   * @returns {Category|Product}
   */
  insert(model) {
    const newModel = super.insert(model);

    // set parent category to non leaf, if it is set as leaf
    if (newModel.parentCategory !== null && newModel.parentCategory.isLeaf) {
      const parent = newModel.parentCategory;
      const newParentCategory = this.replace(
        parent.id,
        new Category(parent.id, parent.title, parent.parentCategory, false),
      );

      return this.replace(
        newModel.id,
        new Category(newModel.id, newModel.title, newParentCategory, true),
      );
    }

    return newModel;
  }
}

module.exports = CategoryDAO;
