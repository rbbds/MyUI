import { expect, test } from '@playwright/test';

const nbsp = ' ';

test.describe('LocaleProvider', () => {
  test('sets the format of amounts and the texts for everything inside it', async ({ page }) => {
    await page.goto('/?s=locale-nl');
    const summary = page.locator('.rb-cart-summary');
    await expect(summary.first()).toContainText(`€${nbsp}1.234,56`);
    await expect(summary.first()).toContainText('Overzicht');
    await expect(summary.first()).toContainText('Totaal');
    // Texts the provider does not have stay English.
    await expect(summary.first()).toContainText('Subtotal');
    await expect(page.getByRole('status').filter({ hasText: 'Laden' })).toBeAttached();
  });
  test('a locale prop on a component wins over the provider', async ({ page }) => {
    await page.goto('/?s=locale-nl');
    await expect(page.getByTestId('own-locale')).toContainText('€2.00');
  });
  test('without a provider everything stays en-US', async ({ page }) => {
    await page.goto('/?s=locale-none');
    const summary = page.locator('.rb-cart-summary').first();
    await expect(summary).toContainText('€1,234.56');
    await expect(summary).toContainText('Summary');
    await expect(summary).toContainText('Total');
    await expect(page.getByRole('spinbutton', { name: 'Quantity' })).toBeVisible();
  });
  test('nlNL translates the texts and sets the formats', async ({ page }) => {
    await page.goto('/?s=locale-nl-full');
    const summary = page.locator('.rb-cart-summary').first();
    await expect(summary).toContainText('Overzicht');
    await expect(summary).toContainText('Subtotaal');
    await expect(summary).toContainText('Totaal');
    await expect(summary).toContainText('Inclusief btw');
    await expect(summary).toContainText(`€${nbsp}1.234,56`);
    await expect(page.getByRole('spinbutton', { name: 'Aantal' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eén meer' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Paginering' })).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: 'Laden' })).toBeAttached();
  });
});
