import { type Locator, type Page } from '@playwright/test';
import { urlData } from '../data/test-data';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(urlData.loginPage);
    }
}