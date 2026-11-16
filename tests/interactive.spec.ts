import { test, expect } from '@playwright/test';
import { AvatarComponent, TimelineComponent, SkillsFilter, TerminalComponent, CopyButton, ContactForm } from './pages/PageObjects';

test.describe('Interactive Widgets & UI Behaviors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('clicking avatar toggles speech bubble popover', async ({ page }) => {
    const avatar = new AvatarComponent(page);
    await avatar.expectActive(false);
    await avatar.toggle();
    await avatar.expectActive(true);
    await avatar.expectBubbleText("Let's talk test automation frameworks");
    await avatar.toggle(); // click outside via same toggle (avatar click again closes)
    await avatar.expectActive(false);
  });

  test('career journey accordion toggles role details open and closed', async ({ page }) => {
    const timeline = new TimelineComponent(page);
    await timeline.expectCardCount(3);
    await timeline.expectCardOpen(0);
    await timeline.expectCardClosed(1);
    await timeline.toggleCard(1);
    await timeline.expectCardOpen(1);
    await timeline.toggleCard(1);
    await timeline.expectCardClosed(1);
  });

  test('skills filter tabs filter category cards accurately', async ({ page }) => {
    const filter = new SkillsFilter(page);
    await filter.expectAllVisible(6);
    await filter.applyFilter('ai');
    await filter.expectVisibleCards(['AI & Agentic QA']);
    await filter.applyFilter('all');
    await filter.expectAllVisible(6);
  });

  test('interactive QA terminal runner executes test suite simulation and streams telemetry', async ({ page }) => {
    const terminal = new TerminalComponent(page);
    await terminal.runSuite();
    await terminal.expectRunning();
    await terminal.expectFinished();
    await terminal.expectOutputContains([
      'playwright test --project=agentic-mcp-suite',
      '[AI-Planner]',
      '[AI-Healer]',
      '74 passed (100%)',
    ]);
  });

  test('copy to clipboard buttons provide instant feedback', async ({ page, context, browserName }) => {
    if (browserName !== 'webkit') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } const copyBtn = new CopyButton(page, page.locator('.copy-btn[data-copy="akshayshinde127@gmail.com"]'));
    await copyBtn.clickAndExpectFeedback();
  });

  test('contact form validates required inputs and gives submission feedback', async ({ page }) => {
    const form = new ContactForm(page);
    await form.fill(
      'Playwright Test User',
      'testuser@qa-automation.io',
      'agentic',
      'Testing the contact submission flow in Playwright.'
    );
    await form.submit();
    await form.expectSuccess('Thank you! Your message has been prepared');
  });
});
