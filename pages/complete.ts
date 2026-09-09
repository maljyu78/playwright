import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';
import { BurgerMenu, CartBadge } from './components/header';

export class CompletePage extends BasePage {
    // Locators
    readonly burgerMenu: BurgerMenu;
    readonly cartBadge: CartBadge;
    private readonly backHomeBtn: Locator;
    private readonly genPDForderBtn: Locator;

    constructor(page: Page) {
        super(page);

        this.burgerMenu = new BurgerMenu(this.page);
        this.cartBadge = new CartBadge(this.page);
        this.backHomeBtn = page.locator('[data-test="back-to-products"]');
        this.genPDForderBtn = page.locator('[data-test="generate-pdf-order"]');
    }

    // Actions
    async clickBackHome() {
        await this.backHomeBtn.click();
    }

    async clickGeneratePDF() {
        await this.genPDForderBtn.click();
    }

    async getDownloadEvent() {
        const downloadEvent = await this.page.waitForEvent('download');
        return downloadEvent;
    }

    async getDownloadFileName(download: any) {
        const fileName = download.suggestedFilename();

        return fileName;
    }
}