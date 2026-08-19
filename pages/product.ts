import { type Locator, type Page } from '@playwright/test';
import { LoginPage } from './login';
import { urlData, loginData } from '../data/test-data';

export class productPage {
  readonly page: Page;
  // Locators
  readonly pageTitle: Locator;
  readonly productItem: Locator;
  readonly addCartBtn: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.productItem = page.locator('.inventory_item');
    this.addCartBtn = page.locator('.btn_inventory');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }


// Actions
  async gotoProductPage() {
    const loginPage = new LoginPage(this.page);

    await loginPage.goto();

    await loginPage.login(
      loginData.standardUser.username,
      loginData.standardUser.password
    );
    await this.page.waitForURL(urlData.productPage);
  }



  async addToCart(productName: string) {
    const product = this.productItem.filter({ hasText: productName });
    await product.locator('.btn_inventory').click();
  }

}