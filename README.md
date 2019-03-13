# shopping-cart
An example implementation of a shopping cart, used for OOP practicing. The shopping cart supports campaigns and coupons, and may hold products belonging to child/root categories.

It is intended to be used as a CLI application.

## Requirements
The project was developed on LTS of the Node. Make sure your node is version 10, if something goes wrong. You should install all dependencies by running `npm install`.

## Usage
Run `npm start` to start the cli. The commands that you can use are listed below.

- *add-item* adds item to your cart, in the first stage. Example usage: `add-item 1 4` where 1 is the id of the product, 4 is the count to add
- *remove-item* removes an item from your basket, in the first stage. Example usage: `remove-item 2` where 2 is the id of the product.
- *pick-campaign* picks a campaign. Example usage: `pick-campaign 1` picks the first campaign. Works in the second stage.
- *pick-coupon* picks a coupon. Example usage: `pick-coupon 1` picks the first coupon. Works in the third stage.
- *next* go to the next stage, works in every stages.
- *reset* reset the cli state to the initial state.
- *exit* exit the cli app.
