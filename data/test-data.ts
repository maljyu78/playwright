export const urlData = {
  loginPage: 'https://www.saucedemo.com/',
  productPage: 'https://www.saucedemo.com/inventory.html',
  CartPage: 'https://www.saucedemo.com/cart.html',
  DetailPage: 'https://www.saucedemo.com/inventory-item.html?id=',
  aboutPage: 'https://saucelabs.com/',
};

export const loginData = {
  standardUser: {
    username: 'standard_user',
    password: 'secret_sauce',
  },

  invalidPassword: {
    username: 'standard_user',
    password: 'wrong_password',
  },

  invalidUsername: {
    username: 'wrong_username',
    password: 'secret_sauce',
  },

};

export const titleData = {
  loginPageTitle: 'Swag Labs',
  productPageTitle: 'Products',
};

export const productData = [
  {id: 'sauce-labs-backpack', pageId: '4', name: 'Labs Backpack'},
  {id: 'sauce-labs-bike-light', pageId: '0', name: 'Labs Bike Light'},
  {id: 'sauce-labs-bolt-t-shirt', pageId: '1', name: 'Labs Bolt T-Shirt'},
  {id: 'sauce-labs-fleece-jacket', pageId: '5', name: 'Labs Fleece Jacket'},
  {id: 'sauce-labs-onesie', pageId: '2', name: 'Labs Onesie'},
  {id: 'test.allthethings()-t-shirt-(red)', pageId: '3', name : 'T-Shirt (Red)'},
];

export const errorContent = {
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
};

