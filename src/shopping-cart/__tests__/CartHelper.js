const CartHelper = require('../CartHelper');
const Cart = require('../Cart');
const CartProduct = require('../models/CartProduct');
const {
  Products, Categories, Coupons, Campaigns,
} = require('../assets/test.data');

const cartHelper = CartHelper.createDefault();

describe('CartHelper test suite', () => {
  describe('pickBestCampaign', () => {
    it('should return null when there is no campaign to apply', () => {
      expect(
        cartHelper.pickBestCampaign(
          new Cart([
            new CartProduct(Products.AcerAspire, 2),
          ]),
          ...[Campaigns.DesktopCampaign, Campaigns.LaptopCampaign, Campaigns.ActionBookCampaign],
        ),
      ).toEqual(null);

      expect(
        cartHelper.pickBestCampaign(
          new Cart([
            new CartProduct(Products.AcerAspire, 2),
          ]),
        ),
      ).toEqual(null);
    });

    it('should return the correct promo when one is applyable', () => {
      expect(
        cartHelper.pickBestCampaign(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
          ]),
          ...[Campaigns.DesktopCampaign, Campaigns.LaptopCampaign, Campaigns.ActionBookCampaign],
        ),
      ).toBe(Campaigns.DesktopCampaign);

      expect(
        cartHelper.pickBestCampaign(
          new Cart([
            new CartProduct(Products.MacbookPro, 3),
          ]),
          ...[Campaigns.DesktopCampaign, Campaigns.LaptopCampaign, Campaigns.ActionBookCampaign],
        ),
      ).toEqual(Campaigns.LaptopCampaign);
    });
  });
  describe('finalizeCart', () => {
    it('should work with proper inputs', () => {
      expect(cartHelper.finalizeCart(
        new Cart([
          new CartProduct(Products.MacbookPro, 3),
        ]),
        Campaigns.LaptopCampaign,
        Coupons.BigSpender,
      )).toEqual({
        originalPrice: 630000,
        finalAmount: 558000,
        deliveryCost: 0,
        couponDiscountAmount: 62000,
        campaignDiscountAmount: 10000,
        pricesByCategory: {
          [Categories.Laptop.id]: 620000,
        },
        cartProducts: [
          new CartProduct(Products.MacbookPro, 3),
        ],
      });

      expect(cartHelper.finalizeCart(
        new Cart([
          new CartProduct(Products.MacbookPro, 2),
        ]),
        Campaigns.LaptopCampaign,
        Coupons.BigSpender,
      )).toEqual({
        originalPrice: 420000,
        finalAmount: 378000,
        deliveryCost: 0,
        couponDiscountAmount: 42000,
        campaignDiscountAmount: 0,
        pricesByCategory: {
          [Categories.Laptop.id]: 420000,
        },
        cartProducts: [
          new CartProduct(Products.MacbookPro, 2),
        ],
      });

      expect(cartHelper.finalizeCart(
        new Cart([
          new CartProduct(Products.MacbookPro, 2),
        ]),
        Campaigns.LaptopCampaign,
        null,
      )).toEqual({
        originalPrice: 420000,
        finalAmount: 420000,
        deliveryCost: 0,
        couponDiscountAmount: 0,
        campaignDiscountAmount: 0,
        pricesByCategory: {
          [Categories.Laptop.id]: 420000,
        },
        cartProducts: [
          new CartProduct(Products.MacbookPro, 2),
        ],
      });

      expect(cartHelper.finalizeCart(
        new Cart([
          new CartProduct(Products.MacbookPro, 2),
        ]),
        null,
        Coupons.BigSpender,
      )).toEqual({
        originalPrice: 420000,
        finalAmount: 378000,
        deliveryCost: 0,
        couponDiscountAmount: 42000,
        campaignDiscountAmount: 0,
        pricesByCategory: {
          [Categories.Laptop.id]: 420000,
        },
        cartProducts: [
          new CartProduct(Products.MacbookPro, 2),
        ],
      });
    });
  });
});
