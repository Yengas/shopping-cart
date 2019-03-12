const CampaignHandler = require('../CampaignHandler');
const Cart = require('../Cart');
const CartProduct = require('../models/CartProduct');
const { Products, Categories, Campaigns } = require('../assets/test.data');

const campaignHandler = new CampaignHandler();

describe('CampaignHandler test suite', () => {
  describe('getDiscount', () => {
    it('should not apply with no minItemCount match', () => {
      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.AcerAspire, 2),
          ]),
          Campaigns.DesktopCampaign,
        ),
      ).toEqual(null);

      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.MacbookPro, 1),
          ]),
          Campaigns.LaptopCampaign,
        ),
      ).toEqual(null);
    });

    it('should apply with single category', () => {
      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
          ]),
          Campaigns.DesktopCampaign,
        ),
      ).toEqual({ categoryId: Categories.Desktop.id, discountedPrice: 143760 });

      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.MacbookPro, 3),
          ]),
          Campaigns.LaptopCampaign,
        ),
      ).toEqual({ categoryId: Categories.Laptop.id, discountedPrice: 620000 });

      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.ManInGreenFaces, 1),
          ]),
          Campaigns.ActionBookCampaign,
        ),
      ).toEqual({ categoryId: Categories.Action.id, discountedPrice: 390 });
    });

    it('should apply with multiple categories', () => {
      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.AcerAspire, 3),
            new CartProduct(Products.MacbookPro, 2),
          ]),
          Campaigns.DesktopCampaign,
        ),
      ).toEqual({ categoryId: Categories.Desktop.id, discountedPrice: 143760 });

      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.MacbookPro, 3),
            new CartProduct(Products.AcerAspire, 3),
          ]),
          Campaigns.LaptopCampaign,
        ),
      ).toEqual({ categoryId: Categories.Laptop.id, discountedPrice: 620000 });

      expect(
        campaignHandler.getDiscount(
          new Cart([
            new CartProduct(Products.ManInGreenFaces, 1),
            new CartProduct(Products.MacbookPro, 3),
            new CartProduct(Products.AcerAspire, 3),
          ]),
          Campaigns.ActionBookCampaign,
        ),
      ).toEqual({ categoryId: Categories.Action.id, discountedPrice: 390 });
    });
  });
});
