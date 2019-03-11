const { DiscountType } = require('./models/DiscountType');

/**
 * Abstract class for applying discounts.
 */
class DiscountApplier {
  /* eslint-disable */
  /**
   * Apply discount to the given price, and return the discounted price.
   * @params price
   * @returns {Number}
   */
  applyDiscount(price) {
    throw new Error('unimplemented abstract error');
  }
  /* eslint-enable */
}

/**
 * Discount applier by percentages
 * @extends DiscountApplier
 */
class DiscountRateApplier extends DiscountApplier {
  /**
   * @param rate to discount from the price
   */
  constructor(rate) {
    super();
    this.rate = rate;
  }

  /**
   * Apply the discount of the given rate, to the price.
   * @param price
   * @returns {number}
   */
  applyDiscount(price) {
    return Math.max(0, price - (price * this.rate / 100));
  }
}

/**
 * Discount applier by fixed amount
 * @extends DiscountApplier
 */
class DiscountAmountApplier extends DiscountApplier {
  /**
   * @param amount to discount from the price
   */
  constructor(amount) {
    super();
    this.amount = amount;
  }

  /**
   * Apply the discount of the given amount to the price.
   * @param price
   * @returns {number}
   */
  applyDiscount(price) {
    return Math.max(price - this.amount, 0);
  }
}

class DiscountApplierFactory {
  /**
   * Creates a DiscountApplier instance
   * @param discountAmount
   * @param discountType
   * @returns {DiscountApplier}
   */
  static create(discountAmount, discountType) {
    if (discountType === DiscountType.Rate) return new DiscountRateApplier(discountAmount);
    if (discountType === DiscountType.Amount) return new DiscountAmountApplier(discountAmount);
    throw new Error(`no discount applier found for the discountType of ${discountType}`);
  }
}

module.exports = { DiscountApplierFactory };
