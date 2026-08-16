import fs from 'node:fs';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

interface TestSummary {
  browser: string;
  title: string;
  status: string;
  error?: string;
}

interface BrowserStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

interface SlackSummary {
  status: string;
  browsers: Record<string, BrowserStats>;
  failedTests: TestSummary[];
}

class SlackReporter implements Reporter {
  // Browser별 테스트 결과를 저장한다.
  private browsers: Record<string, BrowserStats> = {};

  /*
   * 테스트 ID를 Key로 사용해서 결과를 저장한다.
   *
   * Retry가 발생하더라도 같은 테스트의 결과를
   * 마지막 결과로 덮어쓰기 때문에 중복 집계를 방지할 수 있다.
   */
  private testResults = new Map<string, TestSummary>();

  onBegin(_config: FullConfig, suite: Suite) {
    /*
     * Playwright Project를 확인한다.
     *
     * 현재 프로젝트에서는:
     * chromium
     * firefox
     * webkit
     *
     * 이 각각 하나의 Browser가 된다.
     */
    for (const project of suite.suites) {
      if (project.type !== 'project') {
        continue;
      }

      this.browsers[project.title] = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
      };
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    /*
     * 현재 테스트가 어느 Browser Project에서 실행됐는지 찾는다.
     *
     * test.parent를 따라 올라가면서
     * type === 'project'인 Suite를 찾는다.
     */
    let suite: Suite | undefined = test.parent;

    while (suite && suite.type !== 'project') {
      suite = suite.parent;
    }

    if (!suite) {
      return;
    }

    const browser = suite.title;

    /*
     * 혹시 onBegin에서 Browser가 등록되지 않았더라도
     * 안전하게 초기화한다.
     */
    if (!this.browsers[browser]) {
      this.browsers[browser] = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
      };
    }

    /*
     * Playwright의 실제 테스트 상태를
     * 우리가 사용할 상태로 변환한다.
     */
    let status: 'passed' | 'failed' | 'skipped';

    switch (result.status) {
      case 'passed':
        status = 'passed';
        break;

      case 'skipped':
        status = 'skipped';
        break;

      case 'failed':
      case 'timedOut':
      case 'interrupted':
      default:
        status = 'failed';
        break;
    }

    /*
     * 실패 원인을 가져온다.
     *
     * Slack에 너무 긴 에러가 들어가는 것을 방지하기 위해
     * 최대 500자로 제한한다.
     */
    let error: string | undefined;

    if (result.errors && result.errors.length > 0) {
      error = result.errors[0].message
        ?.replace(/\s+/g, ' ')
        .trim()
        .slice(0, 500);
    }

    /*
     * Browser + Test ID 조합을 Key로 사용한다.
     *
     * 같은 테스트가 retry되면 기존 결과를 덮어쓴다.
     */
    const testKey = `${browser}:${test.id}`;

    this.testResults.set(testKey, {
      browser,
      title: test.title,
      status,
      error,
    });
  }

  onEnd(result: FullResult) {
    /*
     * 테스트 결과를 기반으로 Browser별 통계를
     * 다시 계산한다.
     */
    for (const browser of Object.keys(this.browsers)) {
      this.browsers[browser] = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
      };
    }

    const failedTests: TestSummary[] = [];

    /*
     * 저장된 최종 테스트 결과를 순회하면서
     * Browser별 통계를 계산한다.
     */
    for (const test of this.testResults.values()) {
      const stats = this.browsers[test.browser];

      if (!stats) {
        continue;
      }

      stats.total++;

      switch (test.status) {
        case 'passed':
          stats.passed++;
          break;

        case 'skipped':
          stats.skipped++;
          break;

        case 'failed':
        default:
          stats.failed++;

          failedTests.push(test);
          break;
      }
    }

    /*
     * Slack에서 사용할 최종 결과 데이터를 만든다.
     */
    const summary: SlackSummary = {
      status: result.status,
      browsers: this.browsers,
      failedTests,
    };

    /*
     * GitHub Actions에서 이 JSON 파일을 읽어서
     * Slack 메시지를 생성한다.
     */
    fs.mkdirSync('test-results', {
      recursive: true,
    });

    fs.writeFileSync(
      'test-results/slack-summary.json',
      JSON.stringify(summary, null, 2),
      'utf-8',
    );
  }
}

export default SlackReporter;