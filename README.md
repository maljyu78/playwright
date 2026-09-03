# playwright-tutorial
- 목적 : SauceDemo 페이지 대상으로 POM(Page Object Model) 기반 테스트 자동화 설계

- 언어 및 프레임워크 : Playwright (TypeScript), Node.js
- 인프라 및 AI : Generative AI, GitHub Actions, Slack Webhook
- 결함 관리 : GitHub Issues

[현재 진행 상황]
- Playwright + TypeScript 프로젝트 초기 환경 세팅
- 테스트 케이스, 페이지 클래스, 테스트 데이터 파일을 나누어 POM 구조로 설계
- 로그인 페이지 기능테스트 스크립트 작성완료
- 상품 페이지 기능테스트 스크립트 작성완료
- Gen AI를 활용하여 GitHub Actions CI 기본 파이프라인 연동 및 Slack Webhook을 통한 테스트 결과 전송
- 테스트 중 발견한 결함은 GitHub Issues 탭에 등록
- 장바구니 페이지 기능테스트 스크립트 작성완료
- 결제 페이지 기능 테스트 스크립트 작성예정

[주요 파일 구조]

data
- test-data.ts

pages
- components
  - burgerMenu.ts
- base.ts
- cart.ts
- checkout.ts
- login.ts
- product.ts

tests
- cartPageTest.spec.ts
- checkoutPageTest.spec.ts
- loginPageTest.spec.ts
- productPageTest.spec.ts
