import { test, expect } from '@playwright/test';
import { productPage } from '../pages/product';
import { urlData, productData, loginData } from '../data/test-data';
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

  });

  test('TCID_001_상품이름 클릭 및 상세정보 페이지 이동', async ({ page }) => {
    const ProductPage = new productPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];

      await ProductPage.gotoDetailPage(product.pageId);
      await expect(
        page, `[Faild] "${product.name}" 상세 페이지 이동 오류`
      ).toHaveURL(`${urlData.DetailPage}${product.pageId}`);
      await page.goBack();
    }
  });

  test('TCID_003_장바구니 아이콘 클릭 및 장바구니 페이지 이동', async ({ page }) => {
    const ProductPage = new productPage(page);
    const product = productData[0];
    
    await ProductPage.addToCart(product.id);
    await ProductPage.gotoCart();
    await expect(page).toHaveURL(urlData.CartPage);
  });

  test('TCID_004_상품담기 및 카운트배지 동기화', async ({ page }) => {
    const ProductPage = new productPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await ProductPage.addToCart(product.id);
      await expect(
        ProductPage.cartBadge,
        `[Faild] "${product.name}" 카운트 배지 개수 불일치.`
      ).toHaveText(String (i+1));
    }
  });

  test('TCID_005_상품빼기 및 카운트배지 동기화', async ({ page }) => {
    const ProductPage = new productPage(page);

    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];

      await ProductPage.addToCart(product.id);
    }
    
    for (let i = 0; i < productData.length; i++) {
      const product =  productData[i];
      const cartBageCount = productData.length - (i + 1);

      await ProductPage.rmFromCart(product.id);

      if (cartBageCount > 0) {
        await expect(
          ProductPage.cartBadge,
          `[Faild] "${product.name}" 카운트 배지 개수 불일치.`
        ).toHaveText(String (cartBageCount));
      }else {
        await expect(
          ProductPage.cartBadge,
          `[Faild] "${product.name}" 카운트 배지 개수 불일치.`
        ).toBeHidden();
      }
    }
  });

});