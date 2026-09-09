import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';
import { BurgerMenu, CartBadge } from './components/header';

export class CheckoutPage extends BasePage {
    // Locators
    readonly burgerMenu: BurgerMenu;
    readonly cartBadge: CartBadge;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator
    private readonly postalCodeInput: Locator;
    private readonly continueBtn: Locator
    private readonly cancelBtn: Locator;
    private readonly errorMessage: Locator;


    constructor(page: Page) {
        super(page);
        this.burgerMenu = new BurgerMenu(this.page);
        this.cartBadge = new CartBadge(this.page);
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueBtn = page.locator('[data-test="continue"]');
        this.cancelBtn = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    // Actions
    async getErrorMsgContext () {
        return await this.errorMessage.allTextContents();
    }
    
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