const CartHelper = require('../CartHelper');
const Cart = require('../Cart');
const CartProduct = require('../models/CartProduct');
const { Products, Campaigns } = require('../assets/test.data');

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
});
