import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = './') {
    await this.page.goto(path);
  }
}

export class HomePage extends BasePage {
  readonly hero: Locator;
  readonly heroTitle: Locator;
  readonly heroRole: Locator;
  readonly statusBadge: Locator;
  readonly techChips: Locator;

  constructor(page: Page) {
    super(page);
    this.hero = page.locator('#home');
    this.heroTitle = this.hero.locator('h1.hero-title');
    this.heroRole = this.hero.locator('.hero-role');
    this.statusBadge = this.hero.locator('.status-badge');
    this.techChips = this.hero.locator('.tech-chip');
  }

  async gotoHome() { await this.goto('./'); }
  async expectHeroVisible() { await expect(this.hero).toBeVisible(); }
  async expectName(name: string) { await expect(this.heroTitle).toHaveText(name); }
  async expectRole(role: string) { await expect(this.heroRole).toContainText(role); }
  async expectStatus(text: string) { await expect(this.statusBadge).toContainText(text); }
  async expectTechChips(chips: string[]) { await expect(this.techChips).toContainText(chips); }
  async expectSectionAttached(id: string) { await expect(this.page.locator(`section#${id}`)).toBeAttached(); }
}

export class NavBar extends BasePage {
  readonly bar: Locator;
  constructor(page: Page) {
    super(page);
    this.bar = page.locator('nav.nav-bar');
  }
  async expectVisible() { await expect(this.bar).toBeVisible(); }
  async expectLinks(expected: { text: string; hash: string }[]) {
    for (const { text, hash } of expected) {
      const link = this.bar.locator(`a.nav-link[href="${hash}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveText(text);
    }
  }
  async clickLink(hash: string) { await this.bar.locator(`a.nav-link[href="${hash}"]`).click(); }
}

export class AvatarComponent extends BasePage {
  readonly avatarDisc: Locator;
  readonly speechBubble: Locator;
  constructor(page: Page) {
    super(page);
    this.avatarDisc = page.locator('.avatar-disc');
    this.speechBubble = page.locator('.speech-bubble');
  }
  async toggle() { await this.avatarDisc.click(); }
  async expectActive(active: boolean) {
    const matcher = active ? /active/ : /^(?!.*active).*/;
    await expect(this.speechBubble).toHaveClass(matcher);
  }
  async expectBubbleText(text?: string) {
    if (text) await expect(this.speechBubble).toContainText(text);
    else await expect(this.speechBubble).toBeEmpty();
  }
}

export class TimelineComponent extends BasePage {
  readonly cards: Locator;
  constructor(page: Page) {
    super(page);
    this.cards = page.locator('.timeline-card');
  }
  async expectCardCount(n: number) { await expect(this.cards).toHaveCount(n); }
  async expectCardOpen(idx: number) { await expect(this.cards.nth(idx)).toHaveClass(/open/); }
  async expectCardClosed(idx: number) { await expect(this.cards.nth(idx)).not.toHaveClass(/open/); }
  async toggleCard(idx: number) { await this.cards.nth(idx).locator('.role-header').click(); }
}

export class SkillsFilter extends BasePage {
  readonly filterBtns: Locator;
  readonly skillCards: Locator;
  constructor(page: Page) {
    super(page);
    this.filterBtns = page.locator('.skills-filter-bar .filter-btn');
    this.skillCards = page.locator('.skill-category-card');
  }
  async expectAllVisible(count: number) {
    await expect(this.skillCards).toHaveCount(count);
    for (let i = 0; i < count; i++) await expect(this.skillCards.nth(i)).toBeVisible();
  }
  async applyFilter(filter: string) { await this.page.locator(`.filter-btn[data-filter="${filter}"]`).click(); }
  async expectVisibleCards(titles: string[]) {
    const visible = this.page.locator('.skill-category-card:visible');
    await expect(visible).toHaveCount(titles.length);
    await expect(visible.locator('.skill-category-title')).toContainText(titles);
  }
}

export class TerminalComponent extends BasePage {
  readonly terminal: Locator;
  readonly runBtn: Locator;
  readonly output: Locator;
  constructor(page: Page) {
    super(page);
    this.terminal = page.locator('.terminal-card');
    this.runBtn = this.terminal.locator('.run-btn');
    this.output = this.terminal.locator('.terminal-body');
  }
  async runSuite() { await this.runBtn.click(); }
  async expectRunning() { await expect(this.runBtn).toHaveText(/Executing/); }
  async expectFinished() { await expect(this.runBtn).toHaveText(/Re-run Suite/i, { timeout: 12000 }); }
  async expectOutputContains(texts: string[]) {
    for (const txt of texts) await expect(this.output).toContainText(txt);
  }
}

export class CopyButton extends BasePage {
  readonly btn: Locator;
  constructor(page: Page, btn: Locator) {
    super(page);
    this.btn = btn;
  }
  async clickAndExpectFeedback() {
    await expect(this.btn).toHaveText('Copy');
    await this.btn.click();
    await expect(this.btn).toHaveText(/Copied/);
    await expect(this.btn).toHaveClass(/copied/);
  }
}

export class ContactForm extends BasePage {
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectSelect: Locator;
  readonly messageTextarea: Locator;
  readonly submitBtn: Locator;
  readonly statusMsg: Locator;
  constructor(page: Page) {
    super(page);
    this.form = page.locator('#contactForm');
    this.nameInput = this.form.locator('#name');
    this.emailInput = this.form.locator('#email');
    this.subjectSelect = this.form.locator('#subject');
    this.messageTextarea = this.form.locator('#message');
    this.submitBtn = this.form.locator('button[type="submit"]');
    this.statusMsg = this.form.locator('#formStatus');
  }
  async fill(name: string, email: string, subject: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectSelect.selectOption(subject);
    await this.messageTextarea.fill(message);
  }
  async submit() { await this.submitBtn.click(); }
  async expectSuccess(message?: string) {
    await expect(this.statusMsg).toHaveClass(/success/);
    if (message) await expect(this.statusMsg).toContainText(message);
  }
}
