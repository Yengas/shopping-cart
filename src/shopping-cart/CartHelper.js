const CampaignHandler = require('./CampaignHandler');
const CouponHandler = require('./CouponHandler');
const DeliveryCostCalculator = require('./DeliveryCostCalculator');

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
