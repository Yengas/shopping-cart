const { isNonNegativeNumber, isEnum } = require('../utils/validation');

/**
 * Enums for the different discount types
 * @readonly
 * @enum {number}
 */
const DiscountType = {
  Undefined: 0,
  Rate: 1,
  Amount: 2,
};

const validateDiscountWithType = (discountAmount, discountType) => {
  if (!isNonNegativeNumber(discountAmount)) {
    throw new Error('discountAmount should be a positive number for Campaign');
  }

  if (!isEnum(discountType, DiscountType)) {
    throw new Error('discountType should be an enum of DiscountType');
  }

  if (discountType === DiscountType.Rate && discountAmount > 100) {
    throw new Error('discount amount should not be over 100 for discount type rate');
  }

  return true;
};

module.exports = {
  DiscountType,
  validateDiscountWithType,
};
