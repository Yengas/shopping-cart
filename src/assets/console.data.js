const TestData = require('../shopping-cart/assets/test.data');

module.exports = (
  Object
    .keys(TestData)
    .reduce((acc, key) => ({ ...acc, [key]: Object.values(TestData[key]) }), {})
);
