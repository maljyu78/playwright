import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginBtn: Locator;
  private readonly errorMsg: Locator;
  private readonly errorCloseBtn: Locator;

  constructor (page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.errorMsg = page.locator('[data-test="error"]');
    this.errorCloseBtn = page.locator('.error-button');
  }

  // Actions
  async usernameStatus(): Promise < string | null > {
    return await this.usernameInput.textContent();
  }

  async passwordStatus(): Promise < string | null > {
    return await this.passwordInput.textContent();
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

  async errorMsgContext(): Promise < string | null > {
    return await this.errorMsg.textContent();
  }

  async errorMsgStatus(): Promise < boolean > {
    return await this.errorMsg.isVisible();
  }

  async errorCloseBtnClick() {
    await this.errorCloseBtn.waitFor({ state: 'visible' });
    await this.errorCloseBtn.click();
  }

}
