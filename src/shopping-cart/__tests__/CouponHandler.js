const CouponHandler = require('../CouponHandler');
const { Coupons } = require('../assets/test.data');

const couponHandler = new CouponHandler();

// FirstOrder: new Coupon(10000, 3000, DiscountType.Amount),
// Every order over 2000$ has 10% discount
// BigSpender: new Coupon(200000, 10, DiscountType.Rate),

describe('CouponHandler test suite', () => {
  describe('getDiscount', () => {
    it('should not apply below min cart amount', () => {
      expect(
        couponHandler.getDiscount(9000, Coupons.FirstOrder),
      )
        .toEqual(null);

      expect(
        couponHandler.getDiscount(150000, Coupons.BigSpender),
      )
        .toEqual(null);
    });

    it('should apply above min cart amount', () => {
      expect(
        couponHandler.getDiscount(90000, Coupons.FirstOrder),
      )
        .toEqual({ discountedPrice: 87000 });

      expect(
        couponHandler.getDiscount(1500000, Coupons.BigSpender),
      )
        .toEqual({ discountedPrice: 1350000 });
    });
  });
});
