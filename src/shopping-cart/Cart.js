const CartProduct = require('./models/CartProduct');

/**
 * Remove the CartProduct associated with the given product from the
 * list of cartProducts.
 * @param {CartProduct[]} cartProducts
 * @param {Product} product
 * @returns {CartProduct[]}
 */
const removeProductFromCartProducts = (cartProducts, product) => (
  cartProducts
    .filter(cartProduct => !cartProduct.productEquals(product))
);

/**
 * Finds the cart product of the given product
 * @param cartProducts
 * @param product
 * @returns {CartProduct|undefined}
 */
const findCartProduct = (cartProducts, product) => (
  cartProducts
    .find(cartProduct => cartProduct.productEquals(product))
);

/**
 * Get the total number of products in the cart.
 * @param cartProducts
 * @param product
 * @returns {Number}
 */
const getProductCountInCart = (cartProducts, product) => {
  const foundCartProduct = findCartProduct(cartProducts, product);

  if (!foundCartProduct) return 0;
  return foundCartProduct.count;
};

/**
 * Cart class holding the current shopping cart of the user.
 * Every instance is immutable.
 */
class Cart {
  /**
   * Initialize a new shopping cart with optional parameters.
   * @param {CartProduct[]} products
   */
  constructor(products = []) {
    this.products = products;
  }

  /**
   * Given a product and count to increment/decrement, updates the
   * cart by calculating the new count.
   * @param {Product} product
   * @param {Number} count
   * @returns {Cart}
   */
  addItem(product, count) {
    const currentCount = getProductCountInCart(this.products, product);
    const newCount = currentCount + count;
    if (newCount <= 0) return this.removeItem(product);
    const cartProduct = new CartProduct(product, newCount);

    return new Cart(
      removeProductFromCartProducts(this.products, product)
        .concat([cartProduct]),
    );
  }

  /**
   * Remove the given product from the cart.
   * @param product
   * @returns {Cart}
   */
  removeItem(product) {
    return new Cart(
      removeProductFromCartProducts(this.products, product),
    );
  }
}

module.exports = Cart;
