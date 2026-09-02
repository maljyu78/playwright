import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { ProductPage } from '../pages/product';
import { CartPage } from '../pages/cart';
import { urlData, productData, loginData } from '../data/test-data';

test.describe('장바구니 페이지 기능 테스트', () => {
    test.beforeEach (async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto();
    await loginPage.login (
    loginData.standardUser.username,
    loginData.standardUser.password
    );
    await page.waitForURL(urlData.productPage);
  });

    test.fixme('TCID_001_장바구니 페이지 콜드 케이스', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();

    await expect.soft(cartPage.cartItem).toHaveCount(0);
    await expect.soft(cartPage.checkoutBtn).toBeDisabled();
    await expect.soft(cartPage.continueShoppingBtn).toBeEnabled();
    await expect.soft(cartPage.removeBtn).toBeHidden();
  }); // TEST-002 이슈 등록 완료

  test('TCID_002_콜드 케이스 쇼핑 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();

    await cartPage.clickContinueShopping();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test.fixme('TCID_003_콜드 케이스 체크아웃 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await expect(page).toHaveURL(urlData.productPage);
  }); // TEST-002 연계 이슈 (체크아웃 버튼 활성화 유지되는 현상)

  test('TCID_004_장바구니 페이지 상품 담기', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
      await productPage.gotoCart();

      await expect(
        cartPage.cartItem,
        `[Fail] "${product.name}"상품 개수 불일치.`
      ).toHaveCount(i+1);

      await page.goBack();
    }
  });
  
  test('TCID_005_장바구니 페이지 상품 제거', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
      await productPage.gotoCart();

      await cartPage.clickRemove();
      await page.goBack();
    }
    await productPage.gotoCart();
    await expect.soft(cartPage.cartItem).toHaveCount(0);
  });

  test('TCID_006_상품 담긴 상태 쇼핑 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickContinueShopping();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_007_상품 담긴 상태 체크아웃 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await cartPage.clickCheckout();

    await expect(page).toHaveURL(urlData.checkoutInfoPage);
  });

  test('TCID_008_상품 담긴 상태 상세정보 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];

      await productPage.addToCart(product.id);
      await productPage.gotoCart();

      await cartPage.clickItemName(product.pageId);

      await expect(
        page, `[Faild] "${product.name}" 상세 페이지 이동 오류`
      ).toHaveURL(`${urlData.DetailPage}${product.pageId}`);
      
      await page.goBack();
      await page.goBack();
    }
  });

  test('TCID_009_버거 버튼 클릭 및 메뉴 열기', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();

    await expect(cartPage.burgerMenu.bmItemList).toBeVisible();
  });

  test('TCID_010_메뉴 ALL Items 버튼 클릭 및 상품페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickAllItems();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_011_메뉴 About 버튼 클릭 및 About 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickAbout();

    await expect(page).toHaveURL(urlData.aboutPage);
  });

  test('TCID_012_메뉴 Logout 동작 및 로그아웃', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickLogout();

    await expect(page).toHaveURL(urlData.loginPage);
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });

  test.fixme('TCID_013_메뉴 Reset App State 버튼 클릭 및 초기화', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
    }

    await productPage.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickResetAppState();

    await expect.soft(cartPage.cartBadge).toBeHidden();
    await expect.soft(cartPage.cartItem).toHaveCount(0); // TEST-001 이슈 등록 완료
  });

  test('TCID_014_메뉴 Close 버튼 클릭 및 메뉴 닫기', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.gotoCart();
    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickCloseMenu();

    await expect(cartPage.burgerMenu.bmItemList).toBeHidden();
  });

});