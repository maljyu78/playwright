import { type Locator, type Page } from '@playwright/test';

export class BurgerMenu  {
    public page: Page;
    private readonly burgerMenuBtn: Locator;
    public readonly bmItemList: Locator;
    private readonly allItemsBtn: Locator;
    private readonly aboutBtn: Locator;
    private readonly logoutBtn: Locator;
    private readonly resetAppStateBtn: Locator;
    private readonly closeMenuBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.burgerMenuBtn = page.locator('.bm-burger-button');
        this.bmItemList = page.locator('.bm-menu-wrap');
        this.allItemsBtn = page.locator('[data-test="inventory-sidebar-link"]');
        this.aboutBtn = page.locator('[data-test="about-sidebar-link"]');
        this.logoutBtn = page.locator('[data-test="logout-sidebar-link"]');
        this.resetAppStateBtn = page.locator('[data-test="reset-sidebar-link"]');
        this.closeMenuBtn = page.locator('.bm-cross-button');
    }
  async clickBurgerMenu() {
    await this.burgerMenuBtn.waitFor({ state: 'visible' });
    await this.burgerMenuBtn.click();
  }

  async clickAllItems() {
    await this.allItemsBtn.waitFor({ state: 'visible' });
    await this.allItemsBtn.click();
  }

  async clickAbout() {
    await this.aboutBtn.waitFor({ state: 'visible' });
    await this.aboutBtn.click();
  }

  async clickLogout() {
    await this.logoutBtn.waitFor({ state: 'visible' });
    await this.logoutBtn.click();
  }

  async clickResetAppState() {
    await this.resetAppStateBtn.waitFor({ state: 'visible' });
    await this.resetAppStateBtn.click();
  }

  async clickCloseMenu() {
    await this.closeMenuBtn.waitFor({ state: 'visible' });
    await this.closeMenuBtn.click();
  }

}