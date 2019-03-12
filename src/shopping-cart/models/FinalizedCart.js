/**
 * FinalizedCart is the final object that holds all of the information
 * Regarding the cart products, and the applied discounts, delivery costs etc.
 */
class FinalizedCart {
  /**
   * @param {CartProduct[]} cartProducts
   * @param pricesByCategory prices by category after campaign discount
   * @param {Number} originalPrice the customer would pay
   * @param {Number} finalAmount discounts deducted and delivery cost added
   * @param {Number} deliveryCost
   * @param {Number} campaignDiscountAmount
   * @param {Number} couponDiscountAmount
   */
  constructor(
    cartProducts,
    pricesByCategory,
    originalPrice,
    finalAmount,
    deliveryCost,
    campaignDiscountAmount,
    couponDiscountAmount,
  ) {
    this.cartProducts = cartProducts;
    this.pricesByCategory = pricesByCategory;
    this.originalPrice = originalPrice;
    this.finalAmount = finalAmount;
    this.deliveryCost = deliveryCost;
    this.campaignDiscountAmount = campaignDiscountAmount;
    this.couponDiscountAmount = couponDiscountAmount;
  }

  getTotalAmountAfterDiscounts() {
    return this.finalAmount;
  }

  getCouponDiscount() {
    return this.couponDiscountAmount;
  }

  getCampaignDiscount() {
    return this.campaignDiscountAmount;
  }

  getDeliveryCost() {
    return this.deliveryCost;
  }
}

module.exports = FinalizedCart;
