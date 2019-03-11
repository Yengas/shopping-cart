const DeliveryCostCalculator = require('../DeliveryCostCalculator');
const Cart = require('../Cart');
const CartProduct = require('../models/CartProduct');
const { Products } = require('../assets/test.data');

describe('DeliveryCostCalculator test suite', () => {
  describe('calculateFor', () => {
    it('should work with different category counts', () => {
      const deliveryCost = 100;
      const deliveryCostCalculator = new DeliveryCostCalculator(deliveryCost, 0, 0);

      // one item
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.AcerAspire, 1),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: deliveryCost,
          productsCost: 0,
          fixedCost: 0,
          totalCost: deliveryCost,
        });

      // same item more than once
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: deliveryCost,
          productsCost: 0,
          fixedCost: 0,
          totalCost: deliveryCost,
        });

      // more than one category/item
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
            new CartProduct(Products.MacbookPro, 1),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: deliveryCost * 2,
          productsCost: 0,
          fixedCost: 0,
          totalCost: deliveryCost * 2,
        });
    });

    it('should work with different product counts', () => {
      const productDeliveryCost = 100;
      const deliveryCostCalculator = new DeliveryCostCalculator(0, productDeliveryCost, 0);

      // one item
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.MacbookPro, 1),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: 0,
          productsCost: productDeliveryCost,
          fixedCost: 0,
          totalCost: productDeliveryCost,
        });

      // same item, more than once
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.MacbookPro, 2),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: 0,
          productsCost: productDeliveryCost,
          fixedCost: 0,
          totalCost: productDeliveryCost,
        });

      // 2 different categories/items
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
            new CartProduct(Products.MacbookPro, 1),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: 0,
          productsCost: productDeliveryCost * 2,
          fixedCost: 0,
          totalCost: productDeliveryCost * 2,
        });
    });

    it('should return at least fixed cost', () => {
      const fixedCost = 100;
      const deliveryCostCalculator = new DeliveryCostCalculator(0, 0, fixedCost);

      // one item with quantity 1
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.MacbookPro, 1),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: 0,
          productsCost: 0,
          fixedCost,
          totalCost: fixedCost,
        });

      // same item, more than once
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.MacbookPro, 3),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: 0,
          productsCost: 0,
          fixedCost,
          totalCost: fixedCost,
        });

      // 2 different category/items
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
            new CartProduct(Products.MacbookPro, 1),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: 0,
          productsCost: 0,
          fixedCost,
          totalCost: fixedCost,
        });
    });

    it('should work with mixed inputs', () => {
      const deliveryCost = 1;
      const productDeliveryCost = 2;
      const fixedCost = 4;
      const deliveryCostCalculator = (
        new DeliveryCostCalculator(deliveryCost, productDeliveryCost, fixedCost)
      );

      // 2 different category/items
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
            new CartProduct(Products.MacbookPro, 1),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: deliveryCost * 2,
          productsCost: productDeliveryCost * 2,
          fixedCost,
          totalCost: (deliveryCost * 2) + (productDeliveryCost * 2) + fixedCost,
        });

      // 2 items same category
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.MacbookPro, 3),
            new CartProduct(Products.MonsterNotebook, 3),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: deliveryCost,
          productsCost: productDeliveryCost * 2,
          fixedCost,
          totalCost: deliveryCost + (productDeliveryCost * 2) + fixedCost,
        });

      // one item
      expect(
        deliveryCostCalculator.calculateFor(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
          ]),
        ),
      )
        .toEqual({
          deliveriesCost: deliveryCost,
          productsCost: productDeliveryCost,
          fixedCost,
          totalCost: deliveryCost + productDeliveryCost + fixedCost,
        });
    });
  });
});
