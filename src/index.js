const clear = require('clear');
const readlineSync = require('readline-sync');
const Table = require('cli-table');
const {
  Products,
  Campaigns,
} = require('./assets/console.data');
const { DeliveryCosts } = require('./constants');
const { Cart, CartHelper } = require('./shopping-cart');
const { DiscountType } = require('./shopping-cart/models/DiscountType');

const cartHelper = CartHelper.createDefault(DeliveryCosts);
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
  finalized: null,
};

const priceText = price => `${(price / 100).toFixed(2)} ₺`;

const discountLine = (amount, type) => (
  type === DiscountType.Rate
    ? [`${amount}%`, 'rate']
    : [priceText(amount), 'amount']
);


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

/**
 * @param isPicked
 * @param {Campaign} campaign
 * @returns {*[]}
 */
function campaignLine(isPicked, campaign) {
  return [
    isPicked ? '✓' : '',
    campaign.category.title,
    ...discountLine(campaign.discountAmount, campaign.discountType),
  ];
}

function campaignsLine(campaigns) {
  const table = new Table({
    head: ['id', 'picked', 'category', 'amount', 'type'],
  });

  table.push(...campaigns.map(
    (campaign, idx) => (
      [`${idx + 1}`, ...campaignLine(state.campaign === campaign, campaign)]
    ),
  ));

  return `# Available Campaigns\r\n${table.toString()}`;
}

function reset() {
  state.flash = '';
  state.stage = Stages.CartCreate;
  state.cart = new Cart();
  state.campaign = null;
  state.coupon = null;
  state.finalized = null;
}

function exitFunc() {
  process.exit(0);
}

function nextStage() {
  if (state.stage === Stages.CartCreate) {
    if (state.cart.products.length === 0) throw new Error('your basket is empty');
    state.stage = Stages.CampaignPick;
    state.flash = '';
    return true;
  }

  if (state.stage === Stages.CampaignPick) {
    state.stage = Stages.CouponPick;
    state.flash = '';
    return true;
  }

  throw new Error('no next stage');
}

function addItem(idStr, countStr) {
  if (state.stage !== Stages.CartCreate) throw new Error('invalid stage');
  const count = parseInt(countStr, 10);
  if (Number.isNaN(count)) throw new Error('invalid count');
  const product = Products.find(({ id }) => id === idStr.trim());
  if (!product) throw new Error('product not found');

  state.cart = state.cart.addItem(product, count);
}

function removeItem(idStr) {
  if (state.stage !== Stages.CartCreate) throw new Error('invalid stage');
  const product = Products.find(({ id }) => id === idStr.trim());
  if (!product) throw new Error('product not found');

  state.cart = state.cart.removeItem(product);
}

let gAvailableCampaigns = [];
function pickCampaign(idxStr) {
  if (state.stage !== Stages.CampaignPick) throw new Error('invalid stage');
  const idx = parseInt(idxStr, 10);
  if (Number.isNaN(idx) || idx < 1 || idx > gAvailableCampaigns.length) {
    throw new Error('campaign no available');
  }
  state.campaign = gAvailableCampaigns[idx - 1];
}

const Commands = {
  AddItem: { cmd: 'add-item', func: addItem },
  RemoveItem: { cmd: 'remove-item', func: removeItem },
  PickCampaign: { cmd: 'pick-campaign', func: pickCampaign },
  Next: { cmd: 'next', func: nextStage },
  Exit: { cmd: 'exit', func: exitFunc },
  Reset: { cmd: 'reset', func: reset },
};

function renderFirstStage() {
  console.log(productListLine());
  console.log(cartLine(state.cart));
}

function renderSecondStage() {
  console.log(cartLine(state.cart));
  const availableCampaigns = (
    Campaigns
      .filter(campaign => cartHelper.doesCampaignApplyForCart(state.cart, campaign))
  );
  gAvailableCampaigns = availableCampaigns;
  if (availableCampaigns.length === 0) {
    nextStage();
    throw new Error('no campaign available, skipped to coupons');
  }
  console.log(campaignsLine(availableCampaigns));
}

function render() {
  console.log(`--------${state.flash ? state.flash : ''}------------`);

  if (state.stage === Stages.CartCreate) {
    renderFirstStage();
  } else if (state.stage === Stages.CampaignPick) {
    renderSecondStage();
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
  try {
    clear();
    render();

    const line = readlineSync.question('command: ');
    parseAndRunCommand(line);
  } catch (err) {
    state.flash = err.message;
  }
}
