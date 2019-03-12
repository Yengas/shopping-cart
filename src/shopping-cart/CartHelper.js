const CampaignHandler = require('./CampaignHandler');
const CouponHandler = require('./CouponHandler');
const DeliveryCostCalculator = require('./DeliveryCostCalculator');
const FinalizedCart = require('./models/FinalizedCart');

const sumArr = arr => arr.reduce((acc, v) => acc + v, 0);

/**
 * Given a list of cart products, return how much was spent on each category.
 * Returns a map of category id to, amount spent in that category.
 * @param cartProducts
 */
const getCartPricesByCategory = cartProducts => (
  cartProducts
    .reduce(
      (acc, { count, product: { price, category } }) => ({
        [category.id]: (
          category.id in acc ? acc[category.id] : 0
        ) + (price * count),
      }),
      {},
    )
);
/**
 * Apply the given discount to the cart
 * @param {CampaignHandler} campaignHandler
 * @param {Cart} cart
 * @param amountSpentByCategory
 * @param {Campaign} campaign
 * @returns {{ amountSpentByCategory: *, campaignDiscountAmount: number }}
 */
const applyCampaignToCart = (campaignHandler, cart, amountSpentByCategory, campaign) => {
  const campaignDiscountAmount = (
    campaign === null
      ? null
      : campaignHandler.getDiscount(cart, campaign)
  );
  if (campaignDiscountAmount === null) return { amountSpentByCategory, campaignDiscountAmount: 0 };

  return {
    amountSpentByCategory: {
      ...amountSpentByCategory,
      [campaignDiscountAmount.categoryId]: campaignDiscountAmount.discountedPrice,
    },
    campaignDiscountAmount: (
      amountSpentByCategory[campaignDiscountAmount.categoryId]
      - campaignDiscountAmount.discountedPrice
    ),
  };
};
/**
 * Apply the given coupon to the cart
 * @param {CouponHandler} couponHandler
 * @param {Number} totalPrice
 * @param {Coupon} coupon
 * @returns {{ finalAmount: Number, couponDiscountAmount: number }}
 */
const applyCouponToAmount = (couponHandler, totalPrice, coupon) => {
  const couponDiscountAmount = (
    coupon === null
      ? null
      : couponHandler.getDiscount(totalPrice, coupon)
  );
  if (couponDiscountAmount === null) return { finalAmount: totalPrice, couponDiscountAmount: 0 };

  return {
    finalAmount: couponDiscountAmount.discountedPrice,
    couponDiscountAmount: totalPrice - couponDiscountAmount.discountedPrice,
  };
};

/**
 * CartHelper is a class that includes functions to create finalized carts,
 * and utility functions like picking the best campaign.
 */
class CartHelper {
  /**
   * Requirements of the cart helper to run related logic
   * @param {CampaignHandler} campaignHandler
   * @param {CouponHandler} couponHandler
   * @param {DeliveryCostCalculator} deliveryCostCalculator
   */
  constructor(campaignHandler, couponHandler, deliveryCostCalculator) {
    this.campaignHandler = campaignHandler;
    this.couponHandler = couponHandler;
    this.deliveryCostCalculator = deliveryCostCalculator;
  }

  /**
   * Get the best campaign to apply to the cart, according to the most discounted amount.
   * Returns null if none of the campaigns can be applied
   * @param {Cart} cart
   * @param {Campaign} campaigns
   * @returns {Campaign|null}
   */
  pickBestCampaign(cart, ...campaigns) {
    const result = campaigns.reduce((acc, campaign) => {
      const campaignDiscount = this.campaignHandler.getDiscount(cart, campaign);
      if (campaignDiscount === null) return acc;
      if (acc === null) return { discount: campaignDiscount, campaign };
      const { discount } = acc;

      // if this campaign supplies more discount, return this
      if (campaignDiscount.discountedPrice < discount.discountedPrice) {
        return { discount: campaignDiscount, campaignDiscount };
      }

      return acc;
    }, null);

    return result !== null ? result.campaign : null;
  }

  /**
   * Create the finalized cart with all of the discounted prices calculated.
   * @param {Cart} cart
   * @param {Campaign} campaign
   * @param {Coupon} coupon
   * @returns {FinalizedCart}
   */
  finalizeCart(cart, campaign, coupon) {
    // calculate campaign discount and money paid by category
    const spentCategoryMap = getCartPricesByCategory(cart.products);
    const originalPrice = sumArr(Object.values(spentCategoryMap));
    const { amountSpentByCategory, campaignDiscountAmount } = applyCampaignToCart(
      this.campaignHandler,
      cart,
      spentCategoryMap,
      campaign,
    );
    // get the total price after the campaign discount
    const totalPrice = sumArr(Object.values(amountSpentByCategory));
    // apply coupon to get coupon discount amount and final amount
    const { finalAmount, couponDiscountAmount } = applyCouponToAmount(
      this.couponHandler,
      totalPrice,
      coupon,
    );
    // apply the delivery cost
    const { totalCost } = this.deliveryCostCalculator.calculateFor(cart);
    // return the finalized cart
    return new FinalizedCart(
      cart.products,
      amountSpentByCategory,
      originalPrice,
      finalAmount + totalCost,
      totalCost,
      campaignDiscountAmount,
      couponDiscountAmount,
    );
  }

  /**
   * @param {Cart} cart
   * @param {Campaign} campaign
   * @returns {boolean}
   */
  doesCampaignApplyForCart(cart, campaign) {
    return this.campaignHandler.getDiscount(cart, campaign) !== null;
  }

  /**
   * @param {FinalizedCart} finalizedCart
   * @param {Coupon} coupon
   * @returns {boolean}
   */
  doesCouponApplyForCart(finalizedCart, coupon) {
    return this.couponHandler.getDiscount(finalizedCart.finalAmount, coupon) !== null;
  }

  /**
   * Create a default cart helper with th given deliveryCostCalculator options
   * @returns {CartHelper}
   */
  static createDefault({ costPerDelivery = 0, costPerProduct = 0, fixedCost = 0 } = {}) {
    return new CartHelper(
      new CampaignHandler(),
      new CouponHandler(),
      new DeliveryCostCalculator(costPerDelivery, costPerProduct, fixedCost),
    );
  }
}

module.exports = CartHelper;
