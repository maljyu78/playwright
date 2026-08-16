import {test, expect} from '@playwright/test';

// 변수
let browserContxt;
let sharedPage;

// 최초 네이버 접속
test.beforeAll(async ({browser}) => {
	browserContxt = await browser.newContext();
	sharedPage = await browserContxt.newPage();
	await sharedPage.goto('https://www.naver.com');
	await expect(sharedPage).toHaveTitle(/NAVER/i);
});

// 테스트 종료 시
test.afterAll(async () => {
	await browserContxt.close();
});
// 각 테스트 별 초기화
test.afterEach(async () => {
	await sharedPage.goto('https://www.naver.com');
});

// 검색 테스트
test('Search test', async () => {
	const searchInput = sharedPage.locator('#query');
	await searchInput.fill('글자수세기');
	await searchInput.press('Enter');
	await expect(sharedPage).toHaveURL(/search\.naver/);
});

// 버튼 클릭 테스트
test('btn click test', async () => {
	const artbtn = sharedPage.locator('.btn_notify')
	await artbtn.waitFor({state : 'visible', timeout : 5000});
	await artbtn.click();
	await expect(sharedPage).toHaveURL(/.*nidlogin\.login*/);
});

// 레이저 마우스 검색 > 리뷰 많은 순 정렬 > 1위 ~ 10위 크롤링
test('Rayzer Mouse review top 10', async () => {
	const searchInput = sharedPage.locator('#query');
	await searchInput.fill('레이저 마우스');
	await searchInput.press('Enter');
	
	const shopping_btn = sharedPage.getByRole('link', { name: '쇼핑', exact: true });
	await expect(shopping_btn).toBeVisible({
		timeout : 5000,
		message: 'Fail : 쇼핑 버튼 미노출'
	});
	const [shoppingPage] = await Promise.all([
		browserContxt.waitForEvent('page'),
		shopping_btn.click()
	]);
	await shoppingPage.waitForLoadState();
	await expect(shoppingPage).toHaveURL(/search\.shopping/);
	
	const review_high = shoppingPage.getByRole('link', { name: '리뷰 많은 순', exact: true })
		.or(shoppingPage.getByRole('button', { name: '리뷰 많은순' }));
		
	await expect(review_high).toBeVisible({
		timeout : 5000,
		message: 'Fail : 리뷰 많은 순 버튼 미노출'
	});
	await review_high.click();
	
// 개선사항 1 : 쇼핑 버튼 새 탭으로 열렸을때 불러와서 리뷰 많은 순 버튼 클릭하고 제품 리스트 top 10 크롤링 코드 짜야함
// 개선사항 2 : beforeAll 문을 beforeEach 문으로 바꿔서 오류 줄이고 Parallel로 실행해서 테스트 속도 높히기 (worker 수 조정 필요)
	await shoppingPage.close(); // 테스트 종료 후 열린 탭 닫기
});