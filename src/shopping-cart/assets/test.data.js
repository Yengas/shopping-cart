const { isId } = require('../utils/validation');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Campaign = require('../models/Campaign');
const Coupon = require('../models/Coupon');
const ProductDAO = require('../dao/ProductDAO');
const CategoryDAO = require('../dao/CategoryDAO');
const { DiscountType } = require('../models/DiscountType');

const categoryDAO = new CategoryDAO();
const productDAO = new ProductDAO();

function createCategory(title, parentCategory = null) {
  return new Category(
    null,
    title,
    parentCategory === null ? null : categoryDAO.getForId(parentCategory.id),
  );
}

function createProduct(title, price, category) {
  return new Product(null, title, price, categoryDAO.getForId(category.id));
}

/**
 * Overly complex :D helper method to insert map of objects into the given dao.
 * @param dao
 * @param modelMap
 * @returns {{}}
 */
function insertToDAO(dao, modelMap) {
  const keyToIdMap = (
    Object
      .keys(modelMap)
      .reduce((acc, key) => {
        const model = modelMap[key];

        // if model is with valid id, use it
        if (model.id !== null && isId(model.id)) {
          return { ...acc, [key]: model.id };
        }

        // otherwise insert it into dao to get a model with id, and then use it
        return { ...acc, [key]: dao.insert(model).id };
      }, {})
  );

  return (
    Object
      .keys(keyToIdMap)
      .reduce((acc, key) => (
        { ...acc, [key]: dao.getForId(keyToIdMap[key]) }
      ), {})
  );
}

const TechnologyCategory = categoryDAO.insert(createCategory('Technology'));
const BookCategory = categoryDAO.insert(createCategory('Book'));
const ComputersCategory = categoryDAO.insert(createCategory('Computers', TechnologyCategory));
const Categories = insertToDAO(categoryDAO, {
  Technology: TechnologyCategory,
  Book: BookCategory,
  Computers: ComputersCategory,
  Desktop: createCategory('Desktop', ComputersCategory),
  Laptop: createCategory('Laptop', ComputersCategory),
  Telephones: createCategory('Telephones', TechnologyCategory),
  Robotics: createCategory('Robotics', TechnologyCategory),
  Action: createCategory('Action', BookCategory),
  Adventure: createCategory('Adventure', BookCategory),
  Romance: createCategory('Romance', BookCategory),
});

const Products = insertToDAO(productDAO, {
  AcerAspire: createProduct('Acer Aspire C24-865-ACi5NT', 59900, Categories.Desktop),
  MacbookPro: createProduct('Apple MacBook Pro', 210000, Categories.Laptop),
  ManInGreenFaces: createProduct('Men in Green Faces', 600, Categories.Action),
  TouchingTheVoid: createProduct('Touching the Void', 1400, Categories.Adventure),
  TheSummerHouse: createProduct('The Summer House', 1000, Categories.Romance),
});

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
