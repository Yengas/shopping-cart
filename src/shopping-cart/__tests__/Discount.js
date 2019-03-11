const { DiscountType } = require('../models/DiscountType');
const { DiscountApplierFactory } = require('../Discount');

describe('Discount test suite', () => {
  describe('rate test suite', () => {
    const applier = DiscountApplierFactory.create(20, DiscountType.Rate);

    it('should not return negative numbers', () => {
      expect(applier.applyDiscount(-5)).toEqual(0);
      expect(applier.applyDiscount(-2.3765)).toEqual(0);
      expect(applier.applyDiscount(-1)).toEqual(0);
    });

    it('should apply meaningful discounts', () => {
      expect(applier.applyDiscount(100)).toEqual(80);
      expect(applier.applyDiscount(50)).toEqual(40);
      expect(applier.applyDiscount(20)).toEqual(16);
      expect(applier.applyDiscount(35)).toEqual(28);
      expect(applier.applyDiscount(41)).toEqual(32.8);
    });

    it('should work with 100 percent discounts', () => {
      const newApplier = DiscountApplierFactory.create(100, DiscountType.Rate);

      expect(newApplier.applyDiscount(100)).toEqual(0);
      expect(newApplier.applyDiscount(50)).toEqual(0);
      expect(newApplier.applyDiscount(20)).toEqual(0);
      expect(newApplier.applyDiscount(35)).toEqual(0);
      expect(newApplier.applyDiscount(41)).toEqual(0);
    });
  });

  describe('amount test suite', () => {
    const applier = DiscountApplierFactory.create(20, DiscountType.Amount);

    it('should not return negative numbers', () => {
      expect(applier.applyDiscount(-5)).toEqual(0);
      expect(applier.applyDiscount(-2.3765)).toEqual(0);
      expect(applier.applyDiscount(2)).toEqual(0);
      expect(applier.applyDiscount(7)).toEqual(0);
      expect(applier.applyDiscount(13.3)).toEqual(0);
      expect(applier.applyDiscount(19)).toEqual(0);
      expect(applier.applyDiscount(20)).toEqual(0);
    });

    it('should apply meaningful discounts', () => {
      expect(applier.applyDiscount(100)).toEqual(80);
      expect(applier.applyDiscount(50)).toEqual(30);
      expect(applier.applyDiscount(20)).toEqual(0);
      expect(applier.applyDiscount(35)).toEqual(15);
      expect(applier.applyDiscount(40.22)).toEqual(20.22);
    });
  });
});
