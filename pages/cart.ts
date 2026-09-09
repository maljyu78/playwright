import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';
import { BurgerMenu, CartBadge } from './components/header';

export class CartPage extends BasePage {
    // Locators
    readonly burgerMenu: BurgerMenu;
    readonly cartBadge: CartBadge;
    private readonly cartItem: Locator;
    private readonly checkoutBtn: Locator;
    private readonly continueShoppingBtn: Locator;
    private readonly removeBtn: Locator;

    constructor(page: Page) {
        super(page);

        this.burgerMenu = new BurgerMenu(this.page);
        this.cartBadge = new CartBadge(this.page);
        this.cartItem = page.locator('.cart_item');
        this.checkoutBtn = page.locator('[data-test="checkout"]');
        this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
        this.removeBtn = page.locator('[data-test^="remove-"]');
    }

    // Actions
    async clickCheckout() {
        await this.checkoutBtn.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingBtn.click();
    }

    async clickRemove() {
        await this.removeBtn.click();
    }
    async clickItemName(pageId: string) {
        const ItemNameLnk = this.page.locator(`[data-test = "item-${pageId}-title-link"]`);
        await ItemNameLnk.click();
  }
}