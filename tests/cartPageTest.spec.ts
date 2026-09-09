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

  test.fixme('TCID_001_장바구니 페이지 콜드 케이스 확인', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    let itemCount;
    let checkoutBtn;
    let continueShoppingBtn;
    let removeBtn;

    await productPage.cartBadge.gotoCart();

    itemCount = await cartPage.getItemCount();
    checkoutBtn = await cartPage.getCheckoutBtnStatus();
    continueShoppingBtn = await cartPage.getContinueShoppingBtnStatus();
    removeBtn = await cartPage.getRemoveBtnStatus();

    await expect.soft(itemCount).toBe(0);
    await expect.soft(checkoutBtn).toBeFalsy();
    await expect.soft(continueShoppingBtn).toBeTruthy();
    await expect.soft(removeBtn).toBeFalsy();
  }); // TEST-002 이슈 등록 완료

  test('TCID_002_콜드 케이스/쇼핑 페이지 이동 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.cartBadge.gotoCart();

    await cartPage.clickContinueShopping();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test.fixme('TCID_003_콜드 케이스/체크아웃 페이지 이동 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await expect(page).toHaveURL(urlData.productPage);
  }); // TEST-002 연계 이슈 (체크아웃 버튼 활성화 유지되는 현상)

  test('TCID_004_장바구니 상품 담기 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];
      let itemCount;

      await productPage.addToCart(product.id);
      await productPage.cartBadge.gotoCart();

      itemCount = await cartPage.getItemCount();

      await expect(
        itemCount,
        `[Fail] "${product.name}"상품 개수 불일치.`
      ).toBe(i+1);

      await page.goBack();
    }
  });
  
  test('TCID_005_장바구니 상품 제거 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    let itemCount;

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
      await productPage.cartBadge.gotoCart();

      await cartPage.clickRemove();
      await page.goBack();
    }

    itemCount = await cartPage.getItemCount();

    await productPage.cartBadge.gotoCart();
    await expect.soft(itemCount).toBe(0);
  });

  test('TCID_006_상품 담긴 상태/쇼핑 페이지 이동 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickContinueShopping();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_007_상품 담긴 상태/체크아웃 페이지 이동 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await expect(page).toHaveURL(urlData.checkoutInfoPage);
  });

  test('TCID_008_상품 담긴 상태/상세정보 페이지 이동 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];

      await productPage.addToCart(product.id);
      await productPage.cartBadge.gotoCart();

      await cartPage.clickItemName(product.pageId);

      await expect(
        page, `[Faild] "${product.name}" 상세 페이지 이동 오류`
      ).toHaveURL(`${urlData.DetailPage}${product.pageId}`);
      
      await page.goBack();
      await page.goBack();
    }
  });

  test('TCID_009_버거 메뉴 진입 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.cartBadge.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();

    await expect(cartPage.burgerMenu.bmItemList).toBeVisible();
  });

  test('TCID_010_ALL Items 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.cartBadge.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickAllItems();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_011_About 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.cartBadge.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickAbout();

    await expect(page).toHaveURL(urlData.aboutPage);
  });

  test('TCID_012_Logout 버튼 기능 테스트', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    let usernameText
    let passwordText

    await productPage.cartBadge.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickLogout();

    usernameText = await loginPage.usernameStatus();
    passwordText = await loginPage.passwordStatus();

    await expect(page).toHaveURL(urlData.loginPage);
    await expect(usernameText).toBe('');
    await expect(passwordText).toBe('');
  });

  test.fixme('TCID_013_Reset App State 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    let itemCount;

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
    }

    await productPage.cartBadge.gotoCart();

    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickResetAppState();
    itemCount = await cartPage.getItemCount();

    await expect.soft(cartPage.cartBadge.countBadge).toBeHidden();
    await expect.soft(itemCount).toBe(0); // TEST-001 이슈 등록 완료
  });

  test('TCID_014_Close 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.cartBadge.gotoCart();
    await cartPage.burgerMenu.clickBurgerMenu();
    await cartPage.burgerMenu.clickCloseMenu();

    await expect(cartPage.burgerMenu.bmItemList).toBeHidden();
  });

});