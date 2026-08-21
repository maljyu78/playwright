import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';

export class productPage extends BasePage {
  // Locators

  readonly pageTitle: Locator;
  readonly productItem: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.productItem = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }


  // Actions
  async gotoCart() {
    await this.cartBadge.click();
  }

  async gotoDetailPage(pageId : string) {
    const productNameLnk = this.page.locator(`[data-test = "item-${pageId}-title-link"]`);
    await productNameLnk.click();
  }

  async addToCart(productId : string) {
    const addCartBtn = this.page.locator(`[data-test = "add-to-cart-${productId}"]`);
    await addCartBtn.click();
  }

  async rmFromCart(productId : string) {
    const rmCartBtn = this.page.locator(`[data-test = "remove-${productId}"]`);
    await rmCartBtn.click();
  }

}