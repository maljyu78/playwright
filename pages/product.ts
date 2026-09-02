import { type Locator, type Page } from '@playwright/test';
import { BurgerMenu } from './components/burgerMenu';
import { BasePage } from './base';

export class ProductPage extends BasePage {
  // Locators
  readonly burgerMenu: BurgerMenu;
  readonly pageTitle: Locator;
  readonly productItem: Locator;
  readonly productName: Locator;
  readonly cartBadge: Locator;
  readonly cartBtn: Locator;
  readonly filterBtn: Locator;

  constructor(page: Page) {
    super(page);
    
    this.burgerMenu = new BurgerMenu(this.page);
    this.pageTitle = page.locator('.title');
    this.productItem = page.locator('.inventory_item');
    this.productName = page.locator('.inventory_item_name')
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartBtn = page.locator('[data-test="shopping-cart-link"]');
    this.filterBtn = page.locator('.product_sort_container')


  }

  // Actions
  async gotoCart() {
    await this.cartBtn.click();
  }

  async clickProductName(pageId: string) {
    const productNameLnk = this.page.locator(`[data-test = "item-${pageId}-title-link"]`);
    await productNameLnk.click();
  }

  async clickProductImg(pageId: string){
    const productNameLnk = this.page.locator(`[data-test = "item-${pageId}-img-link"]`);
    await productNameLnk.click();
  }
  getAddToCartBtn(productId: string) {
    return this.page.locator(`[data-test = "add-to-cart-${productId}"]`);
  }

  getRmFromCartBtn(productId: string) {
    return this.page.locator(`[data-test = "remove-${productId}"]`);
  }

  async addToCart(productId: string) {
    const addCartBtn = this.getAddToCartBtn(productId);
    await addCartBtn.click();
  }

  async rmFromCart(productId: string) {
    const rmCartBtn = this.getRmFromCartBtn(productId);
    await rmCartBtn.click();
  }
  
  async clickFilterBtn(value: string) {
    await this.filterBtn.selectOption(value);
  }

}