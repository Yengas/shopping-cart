const { isNonNegativeInteger } = require('../utils/validation');
const { validateDiscountWithType } = require('./DiscountType');
const Category = require('./Category');

/**
 * Value Class for the Campaign object.
 * Campaigns are applied to specific categories, if there are at least n items
 * of that category in the basket. The discount can be a percentage or a fixed
 * amount.
 */
class Campaign {
  /**
   * @param {Category} category
   * @param {Number} discountAmount
   * @param {Number} minItemCount
   * @param {DiscountType} discountType
   * @param {Category} category
   */
  constructor(category, discountAmount, minItemCount, discountType) {
    if (!(category instanceof Category)) {
      throw new Error('category should be of type Category');
    }

    if (!category.isLeaf) {
      throw new Error('campaigns can only be applied to leaf categories');
    }

    if (!isNonNegativeInteger(minItemCount)) {
      throw new Error('minItemCount should be a positive integer for Campaign');
    }

    validateDiscountWithType(discountAmount, discountType);

    this.category = category;
    this.discountAmount = discountAmount;
    this.minItemCount = minItemCount;
    this.discountType = discountType;
  }

  /**
   * Compare the given object with this campaign, to check if they are the same.
   * @param other
   * @returns {boolean}
   */
  equals(other) {
    return this === other;
  }
}

module.exports = Campaign;
