import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';
import { BurgerMenu, CartBadge } from './components/header';

export class OverviewPage extends BasePage {
    // Locators
    readonly burgerMenu: BurgerMenu;
    readonly cartBadge: CartBadge;
    private readonly itemList: Locator;
    private readonly itemName: Locator;
    private readonly itemPrice: Locator;
    private readonly itemTotal: Locator;
    private readonly itemTax: Locator;
    private readonly total: Locator;
    private readonly cancelBtn: Locator;
    private readonly finishBtn: Locator;


    constructor(page: Page) {
        super(page);

        this.burgerMenu = new BurgerMenu(this.page);
        this.cartBadge = new CartBadge(this.page);
        this.itemList = page.locator('[data-test="inventory-item"]');
        this.itemName = page.locator('[data-test="inventory-item-name"]');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
        this.itemTax = page.locator('[data-test="tax-label"]');
        this.total = page.locator('[data-test="total-label"]');
        this.itemTotal = page.locator('[data-test="subtotal-label"]');
        this.cancelBtn = page.locator('[data-test="cancel"]');
        this.finishBtn = page.locator('[data-test="finish"]');

    }

    // Actions
    async getItemCount(): Promise < number > {
        await this.itemList.first().waitFor({
            state: 'visible',
        });

        return await this.itemList.count();
    }

    async getItemName(): Promise < string[] > {
        await this.itemName.first().waitFor({
            state: 'visible',
        });

        return await this.itemName.allTextContents();
    }

    async getItemPrice(): Promise < number[] > {
        await this.itemPrice.first().waitFor({
            state: 'visible',
        });

        const itemPrice = await this.itemPrice.allTextContents();

        if (itemPrice.length === 0) {
            return [0];
        }
        else {
            return itemPrice.map(price => parseFloat(price.replace('$', '')));   
        }
    }

    async getItemTax(): Promise < number[] > {
        await this.itemTax.first().waitFor({
            state: 'visible',
        });
        
        const itemTax = await this.itemTax.allTextContents();

        if (itemTax.length === 0) {
            return [0];
        }
        else {
            return itemTax.map(tax => parseFloat(tax.replace('Tax: $', '')));
        }
    }

    async getItemTotal(): Promise < number[] > {
        await this.itemTotal.first().waitFor({
            state: 'visible',
        });

        const itemTotal = await this.itemTotal.allTextContents();

        if (itemTotal.length === 0) {
            return [0];
        }
        else {
            return itemTotal.map(total => parseFloat(total.replace('Item total: $', '')));
        }
    }

    async getTotalPrice(): Promise < number[] > {
        await this.total.first().waitFor({
            state: 'visible',
        });

        const totalPrice = await this.total.allTextContents();

        if (totalPrice.length === 0) {
            return [0];
        }
        else {
            return totalPrice.map(price => parseFloat(price.replace('Total: $', '')));
        }
    }

    async clickCancel() {
        await this.cancelBtn.click();
    }

    async clickFinish() {
        await this.finishBtn.click();
    }

    async getTax(productPrice: number) {
        const taxRate = 0.08;
        const tax = productPrice * taxRate;

        return tax.toFixed(2);
    }
}