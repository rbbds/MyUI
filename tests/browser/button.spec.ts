import { expect, test, type Page } from '@playwright/test';

/** The color a token resolves to on the page, as the browser reports it. */
const token = (page: Page, name: string) => page.evaluate((n) => {
  const probe = document.createElement('div');
  probe.style.background = `var(${n})`;
  document.querySelector('.rb-root')!.appendChild(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
}, name);
const background = (page: Page, name: string) => page.getByRole('button', { name }).evaluate((el) => getComputedStyle(el).backgroundColor);
const press = async (page: Page, name: string) => { await page.getByRole('button', { name }).hover(); await page.mouse.down(); };

test.describe('Button: pressed state', () => {
  for (const [name, t] of [['Primary', '--button-primary-surface-pressed'], ['Accent', '--button-accent-surface-pressed'], ['Secondary', '--button-secondary-surface-pressed'], ['Delete', '--button-primary-destructive-surface-pressed']] as const) {
    test(`${name} uses its pressed token while the mouse is down`, async ({ page }) => {
      await page.goto('/?s=button-pressed');
      const rest = await background(page, name);
      await press(page, name);
      await expect.poll(() => background(page, name)).toBe(await token(page, t));
      expect(await token(page, t)).not.toBe(rest);
      await page.mouse.up();
    });
  }
  test('a button with aria-disabled does not change when pressed', async ({ page }) => {
    await page.goto('/?s=button-pressed');
    const rest = await background(page, 'Switched off');
    await press(page, 'Switched off');
    await page.waitForTimeout(300);
    expect(await background(page, 'Switched off')).toBe(rest);
    await page.mouse.up();
  });
});

test.describe('Accent button: brand tokens', () => {
  test('a brand sets the exact button color and text color', async ({ page }) => {
    await page.goto('/?s=button-pressed');
    await page.addStyleTag({ content: ':root{--brand-color-accent-solid-surface:#2f7d5b;--brand-color-accent-solid-surface-hover:#236a4c;--brand-color-accent-solid-surface-pressed:#1a543b;--brand-color-accent-solid-foreground:#ffffff}' });
    const accent = page.getByRole('button', { name: 'Accent' });
    await expect.poll(() => background(page, 'Accent')).toBe('rgb(47, 125, 91)');
    expect(await accent.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
    await press(page, 'Accent');
    await expect.poll(() => background(page, 'Accent')).toBe('rgb(26, 84, 59)');
    await page.mouse.up();
  });
  test('a brand sets its own grays and error color', async ({ page }) => {
    await page.goto('/?s=button-pressed');
    await page.addStyleTag({ content: ':root{--brand-color-neutral-700:#402a55;--brand-color-neutral-300:#b9a7c9;--brand-color-error-600:#a3122b}' });
    const secondary = page.getByRole('button', { name: 'Secondary' });
    await expect.poll(() => secondary.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(64, 42, 85)');
    expect(await secondary.evaluate((el) => getComputedStyle(el).borderTopColor)).toBe('rgb(185, 167, 201)');
    expect(await background(page, 'Delete')).toBe('rgb(163, 18, 43)');
  });
  test('without brand tokens the accent button keeps accent 400 with dark text', async ({ page }) => {
    await page.goto('/?s=button-pressed');
    expect(await background(page, 'Accent')).toBe(await token(page, '--brand-color-accent-400'));
    expect(await page.getByRole('button', { name: 'Accent' }).evaluate((el) => getComputedStyle(el).color)).toBe(await token(page, '--gray-900'));
  });
});
