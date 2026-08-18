import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly errorMsg: Locator;
  readonly errorCloseBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.errorMsg = page.locator('[data-test="error"]');
    this.errorCloseBtn = page.locator('.error-button');
  }

  // Actions

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }
  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }
  async clickLogin() {
    await this.loginBtn.click();
  }
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
  async errorCloseBtnClick() {
    await this.errorCloseBtn.waitFor({ state: 'visible' });
    await this.errorCloseBtn.click();
  }

}
