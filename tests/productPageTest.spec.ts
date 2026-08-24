import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/product';
import { urlData, productData, loginData, filterData } from '../data/test-data';
import { LoginPage } from '../pages/login';

test.describe('상품페이지 기능 테스트', () => {
  //상품페이지 이동
  test.beforeEach (async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto();
    await loginPage.login (
    loginData.standardUser.username,
    loginData.standardUser.password
    )
    await page.waitForURL(urlData.productPage)
  });

  test('TCID_001_상품이름 클릭 및 상세정보 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];

      await productPage.gotoDetailPage(product.pageId);

      await expect(
        page, `[Faild] "${product.name}" 상세 페이지 이동 오류`
      ).toHaveURL(`${urlData.DetailPage}${product.pageId}`);
      await page.goBack();
    }
  });

  test('TCID_003_장바구니 아이콘 클릭 및 장바구니 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);
    const product = productData[0];
    
    await productPage.addToCart(product.id);
    await productPage.gotoCart();

    await expect(page).toHaveURL(urlData.CartPage);
  });

  test('TCID_004_상품담기 및 카운트배지 동기화', async ({ page }) => {
    const productPage = new ProductPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);

      await expect(
        productPage.cartBadge,
        `[Fail] "${product.name}" 카운트 배지 개수 불일치.`
      ).toHaveText(String (i+1));
    }
  });

  test('TCID_005_상품빼기 및 카운트배지 동기화', async ({ page }) => {
    const productPage = new ProductPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
    }
    
    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];
      const cartBageCount = productData.length - (i + 1);

      await productPage.rmFromCart(product.id);

      if (cartBageCount > 0) {
        await expect(
          productPage.cartBadge,
          `[Fail] "${product.name}" 카운트 배지 개수 불일치.`
        ).toHaveText(String (cartBageCount));
      }else {
        await expect(
          productPage.cartBadge,
          `[Fail] "${product.name}" 카운트 배지 개수 불일치.`
        ).toBeHidden();
      }
    }
  });

  test('TCID_006_버거 버튼 클릭 및 메뉴 열기', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.clickBurgerMenu();

    await expect(productPage.bmItemList).toBeVisible();
  });

  test('TCID_007_메뉴 ALL Items 버튼 클릭 및 상품페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.clickBurgerMenu();
    await productPage.clickAllItems();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_008_메뉴 About 버튼 클릭 및 About 페이지 이동', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.clickBurgerMenu();
    await productPage.clickAbout();

    await expect(page).toHaveURL(urlData.aboutPage);
  });

  test('TCID_009_메뉴 Logout 동작 및 로그아웃', async ({ page }) => {
    const productPage = new ProductPage(page);
    const loginPage = new LoginPage(page);

    await productPage.clickBurgerMenu();
    await productPage.clickLogout();

    await expect(page).toHaveURL(urlData.loginPage);
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });

  test('TCID_010_메뉴 Reset App State 버튼 클릭 및 초기화', async ({ page }) => {
    const productPage = new ProductPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await productPage.addToCart(product.id);
    }

    await productPage.clickBurgerMenu();
    await productPage.clickResetAppState();

    await expect(productPage.cartBadge).toBeHidden();

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await expect(
        productPage.getAddToCartBtn(product.id),
        `[Faild] "${product.name}" 상품담기 버튼 초기화 실패.` // TEST-001 이슈 등록됨
      ).toBeVisible();
    }
  });

  test('TCID_012_메뉴 Close 버튼 클릭 및 메뉴 닫기', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.clickBurgerMenu();
    await productPage.clickCloseMenu();

    await expect(productPage.bmItemList).toBeHidden();
  });

  test('TCID_013_필터 기능 테스트', async ({ page }) => {
    const productPage = new ProductPage(page);
    const failure: string[] = [];

    for (const filter of filterData) {
      try {
        let sortedProducts = [...productData];

        await productPage.clickFilterBtn(filter.value);

        const actualTexts = await productPage.productName.allTextContents();

        switch (filter.value) {
          case 'az' :
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;

          case 'za' :
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;

          case 'lohi' :
            sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
            break;

          case 'hilo' :
            sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
            break;

        }
        const expectTexts = sortedProducts.map(product => product.name);

        expect(actualTexts).toEqual(expectTexts);
      } catch (error) {
        failure.push(`[Fail] "$filter.value" 정렬 순서 불일치`)
      }
    }
    if (failure.length > 0) {
      throw new Error(`Fail List:\n${failure.join('\n')}`);
    }
  });

});