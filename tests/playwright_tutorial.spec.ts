import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { loginData, productData, errorContent } from '../data/test-data';

test.describe('로그인 기능', () => {

  test('TCID_001_정상로그인', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(
      loginData.standardUser.username,
      loginData.standardUser.password
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('TCID_002_잘못된아이디로그인', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginData.invalidPassword.username,
      loginData.invalidPassword.password
    );
    await expect(loginPage.errorMsg).toContainText(errorContent.invalidCredentials);
  });

  test('TCID_003_잘못된비밀번호로그인', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginData.invalidUsername.username,
      loginData.invalidUsername.password
    );
    await expect(loginPage.errorMsg).toContainText(errorContent.invalidCredentials);
  });

  test('TCID_004_에러 메시지 X 버튼', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(
      loginData.invalidPassword.username,
      loginData.invalidPassword.password
    );
    await loginPage.errorCloseBtnClick();
    await expect(loginPage.errorMsg).toBeHidden();
  });
});