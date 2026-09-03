import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { ProductPage } from '../pages/product';
import { CartPage } from '../pages/cart';
import { CheckoutPage } from '../pages/checkout';
import { urlData, productData, loginData, PassCheckoutData, FailCheckoutData, errorContent } from '../data/test-data';

test.describe('체크아웃 정보 페이지 기능 테스트', () => {
  test.beforeEach (async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto();
    await loginPage.login (
    loginData.standardUser.username,
    loginData.standardUser.password
    );
    await page.waitForURL(urlData.productPage);
  });

  test('TCID_001_정보 기입 및 Continue 버튼 클릭', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
        PassCheckoutData.firstName,
        PassCheckoutData.lastName,
        PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL(urlData.checkoutOverviewPage);
  });

  test('TCID_002_정보 미기입 및 Continue 버튼 클릭', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    for (let i = 0; i < FailCheckoutData.length; i++) {
      await checkoutPage.fillCheckoutForm(
        FailCheckoutData[i].firstName,
        FailCheckoutData[i].lastName,
        FailCheckoutData[i].postalCode
      );
      await checkoutPage.clickContinue();
      switch (i) {
        case 0:
          await expect(checkoutPage.errorMessage).toHaveText(errorContent.errorFirstName);
          break;

        case 1:
          await expect(checkoutPage.errorMessage).toHaveText(errorContent.errorLastName);
          break;

        case 2:
          await expect(checkoutPage.errorMessage).toHaveText(errorContent.errorPostalCode);
          break;
      }
    }
  });

  test('TCID_003_Cancel 버튼 클릭', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.clickCancel();

    await expect(page).toHaveURL(urlData.CartPage);
  });

  test('TCID_004_버거 버튼 클릭 및 메뉴 열기', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();

    await expect(checkoutPage.burgerMenu.bmItemList).toBeVisible();
  });

  test('TCID_005_메뉴 ALL Items 버튼 클릭 및 상품페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickAllItems();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_006_메뉴 About 버튼 클릭 및 About 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickAbout();

    await expect(page).toHaveURL(urlData.aboutPage);
  });

  test('TCID_007_메뉴 Logout 동작 및 로그아웃', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickLogout();

    await expect(page).toHaveURL(urlData.loginPage);
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });

  test('TCID_008_메뉴 Reset App State 버튼 클릭 및 초기화', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
    }

    await productPage.gotoCart();
    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickResetAppState();

    await expect.soft(checkoutPage.cartBadge).toBeHidden();
  });

  test('TCID_009_메뉴 Close 버튼 클릭 및 메뉴 닫기', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.addToCart(productData[0].id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickCloseMenu();

    await expect(checkoutPage.burgerMenu.bmItemList).toBeHidden();
  });
  
});
