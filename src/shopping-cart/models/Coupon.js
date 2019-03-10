const { isNonNegativeNumber } = require('../utils/validation');
const { validateDiscountWithType } = require('./DiscountType');

/**
 * Value Class for the Coupon:object
 */
class Coupon {
  /**
   * @param {Number} minCartAmount
   * @param {Number} discountAmount
   * @param {DiscountType} discountType
   */
  constructor(minCartAmount, discountAmount, discountType) {
    if (!isNonNegativeNumber(minCartAmount)) {
      throw new Error('minCartAmount should be a positive integer for Coupon');
    }

    validateDiscountWithType(discountAmount, discountType);

    this.minCartAmount = minCartAmount;
    this.discountAmount = discountAmount;
    this.discountType = discountType;
  }

  /**
   * Compare the given object with this coupon, to check if they are the same.
   * @param other
   * @returns {boolean}
   */
  equals(other) {
    return this === other;
  }
}

module.exports = Coupon;
