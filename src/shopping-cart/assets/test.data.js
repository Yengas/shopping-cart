const Product = require('../models/Product');
const Category = require('../models/Category');
const Campaign = require('../models/Campaign');
const Coupon = require('../models/Coupon');
const { DiscountType } = require('../models/DiscountType');

const TechnologyCategory = new Category('Technology');
const BookCategory = new Category('Book');
const ComputersCategory = new Category('Computers', TechnologyCategory);
const Categories = {
  Technology: TechnologyCategory,
  Book: BookCategory,
  Computers: ComputersCategory,
  Desktop: new Category('Desktop', ComputersCategory),
  Laptop: new Category('Laptop', ComputersCategory),
  Telephones: new Category('Telephones', TechnologyCategory),
  Robotics: new Category('Robotics', TechnologyCategory),
  Action: new Category('Action', BookCategory),
  Adventure: new Category('Adventure', BookCategory),
  Romance: new Category('Romance', BookCategory),
};

const Products = {
  AcerAspire: new Product('Acer Aspire C24-865-ACi5NT', 59900, Categories.Desktop),
  MacbookPro: new Product('Apple MacBook Pro', 210000, Categories.Laptop),
  ManInGreenFaces: new Product('Men in Green Faces', 600, Categories.Action),
  TouchingTheVoid: new Product('Touching the Void', 1400, Categories.Adventure),
  TheSummerHouse: new Product('The Summer House', 1000, Categories.Romance),
};

const Campaigns = {
  TechnologyCampaign: new Campaign(Categories.Technology, 20, 3, DiscountType.Rate),
  // 10.000 cents => 100$
  LaptopCampaign: new Campaign(Categories.Laptop, 10000, 3, DiscountType.Amount),
  ActionBookCampaign: new Campaign(Categories.Action, 35, 1, DiscountType.Rate),
};

const Coupons = {
  // 30$ discount for orders 100$+
  FirstOrder: new Coupon(10000, 3000, DiscountType.Amount),
  // Every order over 2000$ has 10% discount
  BigSpender: new Coupon(200000, 10, DiscountType.Rate),
};

module.exports = {
  Categories,
  Products,
  Campaigns,
  Coupons,
};
