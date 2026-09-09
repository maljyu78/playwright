import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { urlData, loginData, errorContent } from '../data/test-data';

test.describe('로그인 기능', () => {

  test('TCID_001_로그인 성공 테스트', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginData.standardUser.username,
      loginData.standardUser.password
    );
    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_002_아이디 불일치/로그인 실패 테스트', async ({ page }) => {
    const loginPage = new LoginPage(page);
    let errorMsg;

    await loginPage.goto();

    await loginPage.login(
      loginData.invalidUsername.username,
      loginData.invalidUsername.password
    );

    errorMsg = await loginPage.errorMsgContext();

    await expect(errorMsg).toContain(errorContent.invalidCredentials);
  });

  test('TCID_003_비밀번호 불일치/로그인 실패 테스트', async ({ page }) => {
    const loginPage = new LoginPage(page);
    let errorMsg;

    await loginPage.goto();

    await loginPage.login(
      loginData.invalidPassword.username,
      loginData.invalidPassword.password
    );

    errorMsg = await loginPage.errorMsgContext();

    await expect(errorMsg).toContain(errorContent.invalidCredentials);
  });

  test('TCID_004_에러메시지 닫기 버튼 기능 테스트', async ({ page }) => {
    const loginPage = new LoginPage(page);
    let errorMsgStatus;

    await loginPage.goto();

    await loginPage.login(
      loginData.invalidPassword.username,
      loginData.invalidPassword.password
    );

    await loginPage.errorCloseBtnClick();
    errorMsgStatus = await loginPage.errorMsgStatus();

    await expect(errorMsgStatus).toBeFalsy();
  });

});