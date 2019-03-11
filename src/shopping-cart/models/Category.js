const { isId, isNonEmptyString, isMaybeOfType } = require('../utils/validation');

/**
 * Value class for the Category object
 */
class Category {
  /**
   * @param {string|null} id
   * @param {string} title
   * @param {Category|null} parentCategory optional parent category this category is the child of
   * @param {boolean} isLeaf whether the given category is leaf or not
   */
  constructor(id, title, parentCategory = null, isLeaf = true) {
    if (id !== null && !isId(id)) {
      throw new Error('id should be a valid id for Product');
    }

    if (!isNonEmptyString(title)) {
      throw new Error('title should be a non empty string for Category');
    }

    if (!isMaybeOfType(parentCategory, Category)) {
      throw new Error('parentCategory should be instance of the Category class');
    }

    if (parentCategory !== null && parentCategory.id === null) {
      throw new Error('parentCategory of the category may not have null id');
    }

    this.id = id;
    this.title = title;
    this.parentCategory = parentCategory;
    this.isLeaf = isLeaf;
  }

  /**
   * Create the same category object, with an id assigned to it.
   * @param idStr
   * @returns {Category}
   */
  withId(idStr) {
    return new Category(idStr, this.title, this.parentCategory, this.isLeaf);
  }

  /**
   * Compare the given object with this category, to check if they are the same.
   * @param {Category|null} other
   * @returns {boolean}
   */
  equals(other) {
    return other && this.id === other.id;
  }
}

module.exports = Category;
