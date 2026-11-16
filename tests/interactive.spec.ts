import { test, expect } from '@playwright/test';

test.describe('Interactive Widgets & UI Behaviors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('clicking avatar toggles speech bubble popover', async ({ page }) => {
    const avatarDisc = page.locator('.avatar-disc');
    const speechBubble = page.locator('.speech-bubble');

    // Initially speech bubble should not have active class
    await expect(speechBubble).not.toHaveClass(/active/);

    // Click avatar -> should activate
    await avatarDisc.click();
    await expect(speechBubble).toHaveClass(/active/);
    await expect(speechBubble).toContainText("Let's talk test automation frameworks");

    // Click outside -> should close
    await page.locator('h1.hero-title').click();
    await expect(speechBubble).not.toHaveClass(/active/);
  });

  test('career journey accordion toggles role details open and closed', async ({ page }) => {
    const timelineCards = page.locator('.timeline-card');
    await expect(timelineCards).toHaveCount(3);

    // First role (techolution) is open by default
    const firstCard = timelineCards.nth(0);
    await expect(firstCard).toHaveClass(/open/);
    await expect(firstCard.locator('.company-name')).toHaveText('techolution');

    // Second role (Emerson Electric) is closed initially
    const secondCard = timelineCards.nth(1);
    await expect(secondCard).not.toHaveClass(/open/);

    // Click header of second role to expand it
    const secondHeader = secondCard.locator('.role-header');
    await secondHeader.click();
    await expect(secondCard).toHaveClass(/open/);
    await expect(secondCard.locator('.role-body')).toBeVisible();

    // Click again to collapse
    await secondHeader.click();
    await expect(secondCard).not.toHaveClass(/open/);
  });

  test('skills filter tabs filter category cards accurately', async ({ page }) => {
    const filterBtns = page.locator('.skills-filter-bar .filter-btn');
    const skillCards = page.locator('.skill-category-card');

    // All skills should be visible by default
    await expect(skillCards).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      await expect(skillCards.nth(i)).toBeVisible();
    }

    // Click 'AI & Agentic QA' filter
    const aiFilter = page.locator('.filter-btn[data-filter="ai"]');
    await aiFilter.click();
    await expect(aiFilter).toHaveClass(/active/);

    // Only AI card should remain visible
    const visibleCards = page.locator('.skill-category-card:visible');
    await expect(visibleCards).toHaveCount(1);
    await expect(visibleCards.locator('.skill-category-title')).toHaveText('AI & Agentic QA');

    // Reset back to All
    const allFilter = page.locator('.filter-btn[data-filter="all"]');
    await allFilter.click();
    await expect(page.locator('.skill-category-card:visible')).toHaveCount(6);
  });

  test('interactive QA terminal runner executes test suite simulation and streams telemetry', async ({ page }) => {
    const terminal = page.locator('.terminal-card');
    await terminal.scrollIntoViewIfNeeded();

    const runBtn = terminal.locator('.run-btn');
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toHaveText(/Run Suite/);

    // Click Run Suite
    await runBtn.click();
    await expect(runBtn).toHaveText(/Executing/);

    // Wait for the simulated test execution to finish (it completes in ~4 seconds)
    await expect(runBtn).toHaveText(/Re-run Suite/i, { timeout: 12000 });

    const terminalBody = terminal.locator('.terminal-body');
    await expect(terminalBody).toContainText('playwright test --project=agentic-mcp-suite');
    await expect(terminalBody).toContainText('[AI-Planner]');
    await expect(terminalBody).toContainText('[AI-Healer]');
    await expect(terminalBody).toContainText('74 passed (100%)');
  });

  test('copy to clipboard buttons provide instant feedback', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const emailCopyBtn = page.locator('.copy-btn[data-copy="akshayshinde127@gmail.com"]');
    await emailCopyBtn.scrollIntoViewIfNeeded();
    await expect(emailCopyBtn).toHaveText('Copy');

    await emailCopyBtn.click();
    await expect(emailCopyBtn).toHaveText(/Copied/);
    await expect(emailCopyBtn).toHaveClass(/copied/);
  });

  test('contact form validates required inputs and gives submission feedback', async ({ page }) => {
    const form = page.locator('#contactForm');
    await form.scrollIntoViewIfNeeded();

    const submitBtn = form.locator('button[type="submit"]');

    // Fill form
    await page.fill('#name', 'Playwright Test User');
    await page.fill('#email', 'testuser@qa-automation.io');
    await page.selectOption('#subject', 'agentic');
    await page.fill('#message', 'Testing the contact submission flow in Playwright.');

    await submitBtn.click();

    // Verify confirmation feedback
    const statusMsg = page.locator('#formStatus');
    await expect(statusMsg).toHaveClass(/success/);
    await expect(statusMsg).toContainText('Thank you! Your message has been prepared');
  });
});
