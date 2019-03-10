const { isNonEmptyString, isMaybeOfType } = require('../utils/validation');

/**
 * Value class for the Category object
 */
class Category {
  /**
   * @param {string} title
   * @param {Category|null} parentCategory optional parent category this category is the child of
   */
  constructor(title, parentCategory = null) {
    if (!isNonEmptyString(title)) {
      throw new Error('title should be a non empty string for Category');
    }

    if (!isMaybeOfType(parentCategory, Category)) {
      throw new Error('parentCategory should be instance of the Category class');
    }

    this.title = title;
    this.parentCategory = parentCategory;
  }

  /**
   * Compare the given object with this category, to check if they are the same.
   * @param other
   * @returns {boolean}
   */
  equals(other) {
    return this === other;
  }
}

module.exports = Category;
