import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';

export class productPage extends BasePage {
  // Locators

  readonly pageTitle: Locator;
  readonly productItem: Locator;
  readonly cartBadge: Locator;
  readonly burgerMenuBtn: Locator;
  readonly bmItemList: Locator;
  readonly allItemsBtn: Locator;
  readonly aboutBtn: Locator;
  readonly logoutBtn: Locator;
  readonly resetAppStateBtn: Locator;
  readonly closeMenuBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.productItem = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.burgerMenuBtn = page.locator('.bm-burger-button');
    this.bmItemList = page.locator('.bm-item-list');
    this.allItemsBtn = page.locator('#inventory_sidebar_link');
    this.aboutBtn = page.locator('#about_sidebar_link');
    this.logoutBtn = page.locator('#logout_sidebar_link');
    this.resetAppStateBtn = page.locator('#reset_sidebar_link');
    this.closeMenuBtn = page.locator('#react-burger-cross-btn');

  }


  // Actions
  async gotoCart() {
    await this.cartBadge.click();
  }

  async gotoDetailPage(pageId : string) {
    const productNameLnk = this.page.locator(`[data-test = "item-${pageId}-title-link"]`);
    await productNameLnk.click();
  }

  getAddToCartBtn(productId : string) {
    return this.page.locator(`[data-test = "add-to-cart-${productId}"]`);
  }

  getRmFromCartBtn(productId : string) {
    return this.page.locator(`[data-test = "remove-${productId}"]`);
  }

  async addToCart(productId : string) {
    const addCartBtn = this.getAddToCartBtn(productId);
    await addCartBtn.click();
  }

  async rmFromCart(productId : string) {
    const rmCartBtn = this.getRmFromCartBtn(productId);
    await rmCartBtn.click();
  }

  async clickBurgerMenu() {
    await this.burgerMenuBtn.waitFor({ state: 'visible' });
    await this.burgerMenuBtn.click();
  }

  async clickAllItems() {
    await this.allItemsBtn.click();
  }

  async clickAbout() {
    await this.aboutBtn.click();
  }

  async clickLogout() {
    await this.logoutBtn.click();
  }

  async clickResetAppState() {
    await this.resetAppStateBtn.click();
  }

  async clickCloseMenu() {
    await this.closeMenuBtn.click();
  }
  
}