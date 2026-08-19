import { test, expect } from '@playwright/test';
import { productPage } from '../pages/product';
import { urlData, productData, errorContent } from '../data/test-data';

test.describe('상품 페이지 기능', () => {

  test('TCID_001_상품 목록 페이지 진입', async ({ page }) => {
    const ProductPage = new productPage(page);

    await ProductPage.gotoProductPage();

    await expect(page).toHaveURL(urlData.productPage);
  });

  test('TCID_002_상품 정보 페이지 진입', async ({ page }) => {
    const ProductPage = new productPage(page);

    await ProductPage.gotoProductPage();
    await ProductPage.addToCart(productData.backpack);
    
    await expect(ProductPage.cartBadge).toHaveText('1');
  });
  
});