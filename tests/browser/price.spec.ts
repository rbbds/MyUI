import { expect, test } from '@playwright/test';

const nbsp = '\u00a0';

test.describe('Price: prefix, decimals and VAT', () => {
  test('reads as one phrase in the right order', async ({ page }) => {
    await page.goto('/?s=price-unit');
    await expect(page.getByTestId('en')).toHaveText('From€0.523per pieceexcl. VAT');
    // What you see follows the same order as what a screen reader reads.
    const order = await page.getByTestId('en').locator('.rb-price > span').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().left)));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
  test('decimals is a fixed number of decimals', async ({ page }) => {
    await page.goto('/?s=price-unit');
    await expect(page.getByTestId('pad')).toHaveText('€0.520');
  });
  test('without the new props nothing changes', async ({ page }) => {
    await page.goto('/?s=price-unit');
    await expect(page.getByTestId('plain')).toHaveText('€79.95');
    await expect(page.getByTestId('plain').locator('.rb-price > span')).toHaveCount(1);
  });
  test('the VAT text and the format follow the LocaleProvider', async ({ page }) => {
    await page.goto('/?s=price-unit');
    await expect(page.getByTestId('nl')).toHaveText(`v.a.€${nbsp}0,523per stukincl. btw`);
  });
});
