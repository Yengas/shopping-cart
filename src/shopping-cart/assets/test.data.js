const Product = require('../models/Product');
const Category = require('../models/Category');

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
  AcerAspire: new Product('Acer Aspire C24-865-ACi5NT', 599, Categories.Desktop),
  MacbookPro: new Product('Apple MacBook Pro', 2100, Categories.Laptop),
  ManInGreenFaces: new Product('Men in Green Faces', 6, Categories.Action),
  TouchingTheVoid: new Product('Touching the Void', 14, Categories.Adventure),
  TheSummerHouse: new Product('The Summer House', 10, Categories.Romance),
};

module.exports = {
  Categories,
  Products,
};
