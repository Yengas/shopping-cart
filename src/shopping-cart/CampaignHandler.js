const { DiscountApplierFactory } = require('./Discount');

/**
 * @typedef {{ categoryId: string, discountedPrice: Number }} CategoryDiscountResult
 */

/**
 * Interface class for campaign handling related logic
 */
class CampaignHandler {
  /* eslint-disable */
  /**
   * Apply discount to the given card products
   * @param {Cart} cart
   * @param {Campaign} campaign
   * @returns {CategoryDiscountResult}
   */
  getDiscount(cart, campaign) {
    throw new Error('not implemented');
  }
  /* eslint-enable */
}

/**
 * Calculate how much the user will pay for the given category.
 * @param {CartProduct[]} cartProducts
 * @param {Category} category
 * @returns {Number}
 */
const getTotalPriceForCategory = (cartProducts, category) => (
  cartProducts
    .filter(({ product }) => product.category.equals(category))
    .reduce(
      ({ count: categoryCount, price }, { count, product }) => ({
        count: categoryCount + count,
        price: price + (product.price * count),
      }),
      { count: 0, price: 0 },
    )
);

/**
 * Default campaign handler that looks at the campaign category,
 * and the cart products category
 * @extends CampaignHandler
 */
class DefaultCampaignHandler extends CampaignHandler {
  /* eslint-disable class-methods-use-this */
  /**
   * Given a cart, and the campaign, calculate how much discount
   * will be applied to the given cart, on which category and how much.
   * @param {Cart} cart
   * @param {Campaign} campaign
   * @returns {CategoryDiscountResult|null}
   */
  getDiscount(cart, campaign) {
    const { discountAmount, discountType, category } = campaign;
    const { products: cartProducts } = cart;
    const da = DiscountApplierFactory.create(discountAmount, discountType);
    const {
      price: totalCategorySpent,
      count: categoryProductCount,
    } = getTotalPriceForCategory(cartProducts, category);

    if (totalCategorySpent <= 0 || categoryProductCount < campaign.minItemCount) return null;

    return {
      categoryId: category.id,
      discountedPrice: da.applyDiscount(totalCategorySpent),
    };
  }
  /* eslint-enable */
}

module.exports = DefaultCampaignHandler;
