import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/login';
import { loginData } from '../data/test-data';

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


  test('TCID_002_잘못된비밀번호로그인', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginData.WrongPW.username,
      loginData.WrongPW.password
    );

    await expect(page).toHaveURL('https://www.saucedemo.com/login.html');
  });

});