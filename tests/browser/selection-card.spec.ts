import { expect, test } from '@playwright/test';

test.describe('Selection card: slots', () => {
  test('badge and meta are read as the description, and the card without content is still a label', async ({ page }) => {
    await page.goto('/?s=card-slots');
    const print = page.getByRole('radio', { name: 'Print' });
    await expect(print).toHaveAccessibleDescription('Recommended Any colors. 8 working days');
    const root = page.locator('.rb-selection-card').first();
    expect(await root.evaluate((el) => el.tagName)).toBe('LABEL');
    await expect(root.locator('.rb-selection-card__content')).toHaveCount(0);
  });
  test('the reason in meta stays readable on a disabled card', async ({ page }) => {
    await page.goto('/?s=card-slots');
    const card = page.locator('.rb-selection-card--disabled');
    await expect(page.getByRole('radio', { name: 'Engraving' })).toBeDisabled();
    await expect(page.getByRole('radio', { name: 'Engraving' })).toHaveAccessibleDescription('Lasered. Not available for this material.');
    const colors = await card.evaluate((el) => ['.rb-selection-card__description', '.rb-selection-card__meta'].map((s) => getComputedStyle(el.querySelector(s)!).color));
    expect(colors[0]).not.toBe(colors[1]);
  });
  test('content sits outside the label: its button works and does not change the choice', async ({ page }) => {
    await page.goto('/?s=card-slots');
    const screen = page.getByRole('radio', { name: 'Screen' });
    await screen.focus();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('state')).toHaveText('b 0');
    // The option did not remount when the content appeared: the focus is still on it.
    await expect(screen).toBeFocused();
    const card = page.locator('.rb-selection-card--has-content');
    expect(await card.evaluate((el) => el.tagName)).toBe('DIV');
    expect(await card.locator('.rb-selection-card__content').evaluate((el) => el.closest('label') === null)).toBe(true);
    await page.getByRole('button', { name: 'Use fewer colors' }).click();
    await expect(page.getByTestId('state')).toHaveText('b 1');
    await expect(screen).toBeChecked();
  });
  test('an empty content slot takes no space', async ({ page }) => {
    await page.goto('/?s=card-slots');
    const cards = page.locator('.rb-selection-card');
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(second!.height).toBe(first!.height);
  });
});
