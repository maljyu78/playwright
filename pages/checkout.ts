import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';
import { BurgerMenu } from './components/burgerMenu';

export class CheckoutPage extends BasePage {
    // Locators
    readonly burgerMenu: BurgerMenu;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator
    readonly postalCodeInput: Locator;
    readonly continueBtn: Locator
    readonly cancelBtn: Locator;
    readonly errorMessage: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        super(page);
        this.burgerMenu = new BurgerMenu(this.page);
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueBtn = page.locator('[data-test="continue"]');
        this.cancelBtn = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    // Actions
    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinue() {
        await this.continueBtn.click();
    }

    async clickCancel() {
        await this.cancelBtn.click();
    }

}