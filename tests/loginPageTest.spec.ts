import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { urlData, loginData, errorContent } from '../data/test-data';

test.describe('로그인 기능', () => {

  test('TCID_001_아이디, 비밀번호 일치', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginData.standardUser.username,
      loginData.standardUser.password
    );
    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_002_아이디 불일치', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginData.invalidPassword.username,
      loginData.invalidPassword.password
    );
    await expect(loginPage.errorMsg).toContainText(errorContent.invalidCredentials);
  });

  test('TCID_003_비밀번호 불일치', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginData.invalidUsername.username,
      loginData.invalidUsername.password
    );
    await expect(loginPage.errorMsg).toContainText(errorContent.invalidCredentials);
  });

  test('TCID_004_에러메시지 닫기버튼 클릭', async ({ page }) => {
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