/**
 * Base error class to differentiate business logic errors from unhandled ones
 */
class ShoppingCartError extends Error {
  constructor(message) {
    super(message);

    if (this.constructor === ShoppingCartError) {
      throw new TypeError('Abstract class "ShoppingCartError" cannot be instantiated directly.');
    }
  }
}

module.exports = {
  ShoppingCartError,
};
