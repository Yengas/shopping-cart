const { DiscountApplierFactory } = require('./Discount');

/**
 * @typedef {{ discountedPrice: Number }} CouponDiscountResult
 */

/**
 * Interface class for coupon logic handling
 */
class CouponHandler {
  /* eslint-disable */
  /**
   * Apply the given coupon to the cart total price.
   * @param {Number} cartAmount
   * @param {Coupon} coupon
   * @returns {CouponDiscountResult|null}
   */
  getDiscount(cartAmount, coupon) {
    throw new Error('not implemented');
  }
  /* eslint-enable */
}

/**
 * Apply the given coupon to the given total price, according to the
 * min amount logic.
 * @extends CouponHandler
 */
class DefaultCouponHandler extends CouponHandler {
  /* eslint-disable class-methods-use-this */
  /**
   * Apply the given coupon to the cart.
   * @param {Number} cartAmount
   * @param {Coupon} coupon
   * @returns {CouponDiscountResult|null}
   */
  getDiscount(cartAmount, coupon) {
    const { minCartAmount, discountAmount, discountType } = coupon;
    const applier = DiscountApplierFactory.create(discountAmount, discountType);

    if (cartAmount < minCartAmount) return null;
    return { discountedPrice: applier.applyDiscount(cartAmount) };
  }
  /* eslint-enable */
}

module.exports = DefaultCouponHandler;
