import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { ProductPage } from '../pages/product';
import { CartPage } from '../pages/cart';
import { CheckoutPage } from '../pages/checkout';
import { OverviewPage } from '../pages/overview';
import { CompletePage } from '../pages/complete';
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

  test('TCID_001_정보 기입/Continue 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
        PassCheckoutData.firstName,
        PassCheckoutData.lastName,
        PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL(urlData.checkoutOverviewPage);
  });

  test('TCID_002_정보 미기입/Continue 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];
    let errorContext;

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    for (let i = 0; i < FailCheckoutData.length; i++) {
      await checkoutPage.fillCheckoutForm(
        FailCheckoutData[i].firstName,
        FailCheckoutData[i].lastName,
        FailCheckoutData[i].postalCode
      );
      await checkoutPage.clickContinue();
      errorContext = await checkoutPage.getErrorMsgContext();

      switch (i) {
        case 0:
          await expect(errorContext).toContain(errorContent.errorFirstName);
          break;

        case 1:
          await expect(errorContext).toContain(errorContent.errorLastName);
          break;

        case 2:
          await expect(errorContext).toContain(errorContent.errorPostalCode);
          break;
      }
    }
  });

  test('TCID_003_Cancel 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.clickCancel();

    await expect(page).toHaveURL(urlData.CartPage);
  });

  test('TCID_004_버거 메뉴 진입 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();

    await expect(checkoutPage.burgerMenu.bmItemList).toBeVisible();
  });

  test('TCID_005_ALL Items 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickAllItems();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_006_About 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickAbout();

    await expect(page).toHaveURL(urlData.aboutPage);
  });

  test('TCID_007_Logout 버튼 기능 테스트', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const product = productData[0];
    let usernameText
    let passwordText

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickLogout();

    usernameText = await loginPage.usernameStatus();
    passwordText = await loginPage.passwordStatus();

    await expect(page).toHaveURL(urlData.loginPage);
    await expect(usernameText).toBe('');
    await expect(passwordText).toBe('');
  });

  test('TCID_008_Reset App State 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
    }

    await productPage.cartBadge.gotoCart();
    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickResetAppState();

    await expect.soft(checkoutPage.cartBadge.countBadge).toBeHidden();
  });

  test('TCID_009_Close 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.burgerMenu.clickBurgerMenu();
    await checkoutPage.burgerMenu.clickCloseMenu();

    await expect(checkoutPage.burgerMenu.bmItemList).toBeHidden();
  });

  test('TCID_010_CartBage 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.cartBadge.gotoCart();

    await expect(page).toHaveURL(urlData.CartPage);
  });
  
});

test.describe('체크아웃 Overview 페이지 기능 테스트', () => {
  test.beforeEach (async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto();
    await loginPage.login (
      loginData.standardUser.username,
      loginData.standardUser.password
    );
    await page.waitForURL(urlData.productPage);
  });

  test('TCID_001_상품 정보 일치 확인', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    for ( let i = 0; i < productData.length; i++ ) {
      const product =  productData[i];
      let itemCount;
      let itemName;
      let itemPrice;

      await productPage.addToCart(product.id);
      await productPage.cartBadge.gotoCart();
      await cartPage.clickCheckout();

      await checkoutPage.fillCheckoutForm(
        PassCheckoutData.firstName,
        PassCheckoutData.lastName,
        PassCheckoutData.postalCode
      );
      await checkoutPage.clickContinue();

      itemCount = await overviewPage.getItemCount();
      itemName = await overviewPage.getItemName();
      itemPrice = await overviewPage.getItemPrice();

      await expect.soft(itemCount).toBe(i+1);
      await expect.soft(itemName).toContain(product.name);
      await expect.soft(itemPrice).toContain(Number(product.price));
      
      await page.goto(urlData.productPage);
    }
  });

  test('TCID_002_상품 총 가격 일치 확인', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    let itemTotal;
    let itemTax;
    let total;
    let tax;
    let sumPrice: number = 0;
    let priceTotal: number = 0;

    for ( let i = 0; i < productData.length; i++ ) {
      const product = productData[i];
      

      await productPage.addToCart(product.id);
      await productPage.cartBadge.gotoCart();
      await cartPage.clickCheckout();

      await checkoutPage.fillCheckoutForm(
        PassCheckoutData.firstName,
        PassCheckoutData.lastName,
        PassCheckoutData.postalCode
      );

      await checkoutPage.clickContinue();

      sumPrice = sumPrice + Number(product.price);
      tax = await overviewPage.getTax(sumPrice);
      priceTotal = Number(sumPrice) + Number(tax);

      itemTotal = await overviewPage.getItemTotal();
      itemTax = await overviewPage.getItemTax();
      total = await overviewPage.getTotalPrice();

      await expect.soft(itemTotal[0].toFixed(2)).toContain(sumPrice.toFixed(2).toString());
      await expect.soft(itemTax[0].toFixed(2)).toContain(tax.toString());
      await expect.soft(total[0].toFixed(2)).toContain(priceTotal.toFixed(2).toString());

      await page.goto(urlData.productPage);
    }
  });

  test('TCID_003_취소 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.clickCancel();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_004_완료 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);


    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.clickFinish();

    await expect(page).toHaveURL(urlData.checkoutCompletePage);
  });

  test('TCID_005_버거 메뉴 진입 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.burgerMenu.clickBurgerMenu();

    await expect(overviewPage.burgerMenu.bmItemList).toBeVisible();
  });

  test('TCID_006_ALL Items 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.burgerMenu.clickBurgerMenu();
    await overviewPage.burgerMenu.clickAllItems();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_007_About 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    const product = productData[0];

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.burgerMenu.clickBurgerMenu();
    await overviewPage.burgerMenu.clickAbout();

    await expect(page).toHaveURL(urlData.aboutPage);
  });

  test('TCID_008_Logout 버튼 기능 테스트', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    const product = productData[0];
    let usernameText
    let passwordText

    await productPage.addToCart(product.id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.burgerMenu.clickBurgerMenu();
    await overviewPage.burgerMenu.clickLogout();

    usernameText = await loginPage.usernameStatus();
    passwordText = await loginPage.passwordStatus();

    await expect(page).toHaveURL(urlData.loginPage);
    await expect(usernameText).toBe('');
    await expect(passwordText).toBe('');
  });

  test('TCID_009_Reset App State 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
    }

    await productPage.cartBadge.gotoCart();
    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.burgerMenu.clickBurgerMenu();
    await overviewPage.burgerMenu.clickResetAppState();

    await expect.soft(overviewPage.cartBadge.countBadge).toBeHidden();
  });

  test('TCID_010_Close 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.burgerMenu.clickBurgerMenu();
    await overviewPage.burgerMenu.clickCloseMenu();

    await expect(overviewPage.burgerMenu.bmItemList).toBeHidden();
  });

  test('TCID_011_CartBage 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);

    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.cartBadge.gotoCart();

    await expect(page).toHaveURL(urlData.CartPage);
  });

});

test.describe('체크아웃 성공 페이지 기능 테스트', () => {
  test.beforeEach (async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto();
    await loginPage.login (
      loginData.standardUser.username,
      loginData.standardUser.password
    );
    await page.waitForURL(urlData.productPage);
  });
  test('TCID_001_Back Home 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    const completePage = new CompletePage(page);

    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.clickFinish();

    await completePage.clickBackHome();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_002_Generate PDF order 버튼 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const overviewPage = new OverviewPage(page);
    const completePage = new CompletePage(page);
    let download;
    let generatedName;
    
    await productPage.addToCart(productData[0].id);
    await productPage.cartBadge.gotoCart();

    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutForm(
      PassCheckoutData.firstName,
      PassCheckoutData.lastName,
      PassCheckoutData.postalCode
    );
    await checkoutPage.clickContinue();

    await overviewPage.clickFinish();

    await completePage.clickGeneratePDF();

    download = await completePage.getDownloadEvent();
    expect(download).toBeTruthy();

    generatedName = await completePage.getDownloadFileName(download);
    expect(generatedName.length).toBeGreaterThan(0);

    await download.cancel();
  });

});