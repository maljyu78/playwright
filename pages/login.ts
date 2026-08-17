import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
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
    await this.loginButton.click();
  }
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
