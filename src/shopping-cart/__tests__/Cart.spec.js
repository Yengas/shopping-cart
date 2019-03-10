const Cart = require('../Cart');
const CartProduct = require('../models/CartProduct');
const { Products } = require('../assets/test.data');

describe('Cart test suite', () => {
  describe('addItem', () => {
    it('should add properly to empty basket', () => {
      const EmptyCart = new Cart();

      expect(
        EmptyCart
          .addItem(Products.AcerAspire, 2)
          .products,
      )
        .toEqual(
          [new CartProduct(Products.AcerAspire, 2)],
        );
      expect(
        EmptyCart
          .addItem(Products.MacbookPro, 2)
          .products,
      )
        .toEqual(
          [new CartProduct(Products.MacbookPro, 2)],
        );

      expect(
        EmptyCart
          .addItem(Products.ManInGreenFaces, 2)
          .products,
      )
        .toEqual(
          [new CartProduct(Products.ManInGreenFaces, 2)],
        );
    });

    it('should add properly multiple items to the same basket', () => {
      const EmptyCart = new Cart();

      expect(
        EmptyCart
          .addItem(Products.MacbookPro, 2)
          .addItem(Products.TouchingTheVoid, 3)
          .products,
      )
        .toEqual(
          [
            new CartProduct(Products.MacbookPro, 2),
            new CartProduct(Products.TouchingTheVoid, 3),
          ],
        );

      expect(
        EmptyCart
          .addItem(Products.TheSummerHouse, 2)
          .addItem(Products.ManInGreenFaces, 2)
          .addItem(Products.TouchingTheVoid, 1)
          .addItem(Products.TheSummerHouse, 3)
          .products,
      )
        .toEqual(
          [
            new CartProduct(Products.ManInGreenFaces, 2),
            new CartProduct(Products.TouchingTheVoid, 1),
            new CartProduct(Products.TheSummerHouse, 5),
          ],
        );
    });

    it('should decrement items correctly', () => {
      const threeMacbookCart = new Cart([
        new CartProduct(Products.MacbookPro, 3),
      ]);

      expect(
        threeMacbookCart
          .addItem(Products.MacbookPro, -1)
          .products,
      )
        .toEqual(
          [new CartProduct(Products.MacbookPro, 2)],
        );

      expect(
        threeMacbookCart
          .addItem(Products.MacbookPro, -3)
          .products,
      )
        .toEqual([]);

      expect(
        new Cart([
          new CartProduct(Products.ManInGreenFaces, 2),
          new CartProduct(Products.TheSummerHouse, 1),
        ])
          .addItem(Products.ManInGreenFaces, -1)
          .products,
      )
        .toEqual([
          new CartProduct(Products.TheSummerHouse, 1),
          new CartProduct(Products.ManInGreenFaces, 1),
        ]);
    });
  });

  describe('removeItem', () => {
    it('should remove items correctly', () => {
      const actionAndRomanceCart = new Cart([
        new CartProduct(Products.ManInGreenFaces, 2),
        new CartProduct(Products.TheSummerHouse, 1),
      ]);

      expect(
        actionAndRomanceCart
          .removeItem(Products.ManInGreenFaces)
          .products,
      )
        .toEqual([
          new CartProduct(Products.TheSummerHouse, 1),
        ]);

      expect(
        actionAndRomanceCart
          .removeItem(Products.TheSummerHouse)
          .products,
      )
        .toEqual([
          new CartProduct(Products.ManInGreenFaces, 2),
        ]);
    });
  });
});
