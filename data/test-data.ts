export const urlData = {
  loginPage: 'https://www.saucedemo.com/',
  productPage: 'https://www.saucedemo.com/inventory.html',
  CartPage: 'https://www.saucedemo.com/cart.html',
  DetailPage: 'https://www.saucedemo.com/inventory-item.html?id=',
  aboutPage: 'https://saucelabs.com/',
  checkoutInfoPage: 'https://www.saucedemo.com/checkout-step-one.html'
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
  {id: 'sauce-labs-backpack', pageId: '4', name: 'Sauce Labs Backpack', price: '29.99'},
  {id: 'sauce-labs-bike-light', pageId: '0', name: 'Sauce Labs Bike Light', price: '9.99'},
  {id: 'sauce-labs-bolt-t-shirt', pageId: '1', name: 'Sauce Labs Bolt T-Shirt', price: '15.99'},
  {id: 'sauce-labs-fleece-jacket', pageId: '5', name: 'Sauce Labs Fleece Jacket', price: '49.99'},
  {id: 'sauce-labs-onesie', pageId: '2', name: 'Sauce Labs Onesie', price: '7.99'},
  {id: 'test.allthethings()-t-shirt-(red)', pageId: '3', name : 'Test.allTheThings() T-Shirt (Red)', price: '15.99'},
];

export const errorContent = {
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
};

export const filterData = [
  { name: 'A to Z', value: 'az'},
  { name: 'Z to A', value: 'za'},
  { name: 'Price (low to high)', value: 'lohi'},
  { name: 'Price (high to low)', value: 'hilo'},
]