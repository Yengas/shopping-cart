const clear = require('clear');
const readlineSync = require('readline-sync');
const Table = require('cli-table');
const {
  Products,
  Campaigns,
  Coupons,
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

/**
 * @param isPicked
 * @param {Coupon} coupon
 * @returns {*[]}
 */
function couponLine(isPicked, coupon) {
  return [
    isPicked ? '✓' : '',
    priceText(coupon.minCartAmount),
    ...discountLine(coupon.discountAmount, coupon.discountType),
  ];
}

function couponsLine(coupons) {
  const table = new Table({
    head: ['id', 'picked', 'min amount', 'amount', 'type'],
  });

  table.push(...coupons.map(
    (coupon, idx) => (
      [`${idx + 1}`, ...couponLine(state.coupon === coupon, coupon)]
    ),
  ));

  return `# Available Coupons\r\n${table.toString()}`;
}

/**
 * @param {FinalizedCart} finalized
 */
function finalizedLine(finalized) {
  const table = new Table({
    head: ['basket', 'final', 'campaign discount', 'coupon discount', 'delivery cost'],
  });

  table.push([
    priceText(finalized.originalPrice),
    priceText(finalized.finalAmount),
    priceText(finalized.campaignDiscountAmount),
    priceText(finalized.couponDiscountAmount),
    priceText(finalized.deliveryCost),
  ]);

  return `# Financials\r\n${table.toString()}`;
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
    state.finalized = cartHelper.finalizeCart(state.cart, state.campaign, null);
    state.flash = '';
    return true;
  }

  if (state.stage === Stages.CouponPick) {
    state.stage = Stages.Finalized;
    state.finalized = cartHelper.finalizeCart(state.cart, state.campaign, state.coupon);
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

let gAvailableCoupons = [];
function pickCoupon(idxStr) {
  if (state.stage !== Stages.CouponPick) throw new Error('invalid stage');
  const idx = parseInt(idxStr, 10);
  if (Number.isNaN(idx) || idx < 1 || idx > gAvailableCoupons.length) {
    throw new Error('coupon no available');
  }
  state.coupon = gAvailableCoupons[idx - 1];
}

const Commands = {
  AddItem: { cmd: 'add-item', func: addItem },
  RemoveItem: { cmd: 'remove-item', func: removeItem },
  PickCampaign: { cmd: 'pick-campaign', func: pickCampaign },
  PickCoupon: { cmd: 'pick-coupon', func: pickCoupon },
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

function renderThirdStage() {
  console.log(cartLine(state.cart));
  const availableCoupons = (
    Coupons
      .filter(coupon => cartHelper.doesCouponApplyForCart(state.finalized, coupon))
  );
  gAvailableCoupons = availableCoupons;
  if (availableCoupons.length === 0) {
    nextStage();
    throw new Error('no coupons available, skipped to the end');
  }
  console.log(couponsLine(availableCoupons));
}

function renderFourthStage() {
  console.log(cartLine(state.cart));
  console.log(finalizedLine(state.finalized));
}

function render() {
  console.log(`--------${state.flash ? state.flash : ''}------------`);

  if (state.stage === Stages.CartCreate) {
    renderFirstStage();
  } else if (state.stage === Stages.CampaignPick) {
    renderSecondStage();
  } else if (state.stage === Stages.CouponPick) {
    renderThirdStage();
  } else if (state.stage === Stages.Finalized) {
    renderFourthStage();
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
