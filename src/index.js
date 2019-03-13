const clear = require('clear');
const readlineSync = require('readline-sync');
const Table = require('cli-table');
const {
  Products,
} = require('./assets/console.data');
const { Cart } = require('./shopping-cart');

const priceText = price => `${(price / 100).toFixed(2)} ₺`;

function productLine({ title, price, category }) {
  return [title, priceText(price), category.title];
}

function cartProductLine({ product, count }) {
  return [count, ...productLine(product)];
}

function cartLine(cart) {
  const table = new Table({
    head: ['count', 'product', 'price', 'category'],
  });

  table.push(...cart.products.map(cartProductLine));

  return `# Your Basket\r\n${table.toString()}`;
}

function listLine(product) {
  return [product.id, ...productLine(product)];
}

function productListLine() {
  const table = new Table({
    head: ['id', 'product', 'price', 'category'],
  });

  table.push(...Products.map(listLine));

  return `# Available Products\r\n${table.toString()}`;
}

const Stages = {
  CartCreate: 1,
  CampaignPick: 2,
  CouponPick: 3,
  Finalized: 4,
};

const state = {
  flash: '',
  stage: Stages.CartCreate,
  cart: null,
  campaign: null,
  coupon: null,
};

function reset() {
  state.flash = '';
  state.stage = Stages.CartCreate;
  state.cart = new Cart();
  state.campaign = null;
  state.coupon = null;
}

function nextStage() {
  throw new Error('no next stage');
}

function addItem(idStr, countStr) {
  const count = parseInt(countStr, 10);
  if (Number.isNaN(count)) throw new Error('invalid count');
  const product = Products.find(({ id }) => id === idStr.trim());
  if (!product) throw new Error('product not found');

  state.cart = state.cart.addItem(product, count);
}

function removeItem(idStr) {
  const product = Products.find(({ id }) => id === idStr.trim());
  if (!product) throw new Error('product not found');

  state.cart = state.cart.removeItem(product);
}

const Commands = {
  AddItem: { cmd: 'add-item', func: addItem },
  RemoveItem: { cmd: 'remove-item', func: removeItem },
  Next: { cmd: 'next', func: nextStage },
};

function renderFirstStage() {
  console.log(productListLine());
  console.log('--------');
  console.log(cartLine(state.cart));
}

function render() {
  console.log(`--------${state.flash ? state.flash : ''}------------`);

  if (state.stage === Stages.CartCreate) {
    renderFirstStage();
  }

  state.flash = '';
}

function parseAndRunCommand(str) {
  const command = Object.values(Commands).find(({ cmd }) => str.startsWith(cmd));
  if (!command) throw new Error('command not found');
  const args = str.substring(command.cmd.length + 1).split(' ');

  command.func.apply(this, args);
  state.flash = `${command.cmd} ran`;
}

reset();
while (true) {
  clear();
  render();

  try {
    const line = readlineSync.question('command: ');
    parseAndRunCommand(line);
  } catch (err) {
    state.flash = err.message;
  }
}
