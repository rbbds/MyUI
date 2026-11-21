import { expect, test } from '@playwright/test';

const nbsp = ' ';

test.describe('Tier pricing table', () => {
  test('is a table, sorted, with ranges, prices and savings', async ({ page }) => {
    await page.goto('/?s=tier');
    const table = page.getByRole('table', { name: 'Volume prices' });
    await expect(table.getByRole('columnheader')).toHaveText(['Quantity', 'Price each', 'Saving']);
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0).locator('td')).toHaveText(['€0.520', '']);
    await expect(rows.nth(1).locator('td')).toHaveText(['€0.480', '8%']);
    await expect(rows.nth(2).locator('td')).toHaveText(['€0.410', '21%']);
    await expect(rows.nth(2).getByRole('rowheader')).toContainText('1,000+');
    await expect(page.locator('.rb-tier-pricing__footnote')).toHaveText('Prices excl. VATOne print included');
  });
  test('marks the row of the quantity and reads the new price out', async ({ page }) => {
    await page.goto('/?s=tier');
    const rows = page.locator('.rb-tier-pricing tbody tr');
    await expect(rows.nth(0)).toHaveAttribute('aria-current', 'true');
    await expect(rows.nth(0).getByRole('rowheader')).toContainText('Your price');
    await page.getByRole('button', { name: '250 – 999 set quantity to 250' }).click();
    await expect(page.getByTestId('q')).toHaveText('250');
    await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true');
    await expect(rows.nth(0)).not.toHaveAttribute('aria-current', 'true');
    await expect(page.locator('.rb-tier-pricing').getByRole('status')).toHaveText('Your price: €0.480 each');
    // The pointer is still on the row that was just chosen: it keeps the color of the active row.
    const colors = await rows.evaluateAll((trs) => trs.map((tr) => getComputedStyle(tr.children[0]).backgroundColor));
    await rows.nth(0).getByRole('button').hover();
    const hovered = await rows.evaluateAll((trs) => trs.map((tr) => getComputedStyle(tr.children[0]).backgroundColor));
    expect(hovered[1]).toBe(colors[1]);
    expect(hovered[0]).not.toBe(colors[0]);
    expect(colors[1]).not.toBe(colors[2]);
  });
  test('the hint names the next tier, and below the first tier no row is marked', async ({ page }) => {
    await page.goto('/?s=tier');
    await expect(page.getByTestId('hint')).toHaveText('Add 200 more and pay €0.480 each');
    await page.getByRole('button', { name: /1,000\+/ }).click();
    await expect(page.getByTestId('hint')).toHaveText('You have the lowest price each');
    await page.getByRole('button', { name: 'Below' }).click();
    await expect(page.locator('.rb-tier-pricing tbody tr[aria-current]')).toHaveCount(0);
  });
  test('the whole first cell is the click target and the focus is visible', async ({ page }) => {
    await page.goto('/?s=tier');
    await expect(page.getByRole('table')).toBeVisible();
    await page.locator('body').press('Tab');
    await expect(page.locator('.rb-tier-pricing__select').first()).toBeFocused();
    const ring = await page.locator('.rb-tier-pricing__select').first().evaluate((el) => (el.matches(':focus-visible') ? getComputedStyle(el).boxShadow : 'none'));
    expect(ring).not.toBe('none');
    const cell = page.locator('.rb-tier-pricing tbody tr').nth(2).getByRole('rowheader');
    const box = await cell.boundingBox();
    await page.mouse.click(box!.x + box!.width - 4, box!.y + box!.height - 4);
    await expect(page.getByTestId('q')).toHaveText('1000');
  });
  test('static, without saving, indicative and loading', async ({ page }) => {
    await page.goto('/?s=tier-static');
    const first = page.locator('.rb-tier-pricing').first();
    await expect(first.getByRole('button')).toHaveCount(0);
    await expect(first.getByRole('columnheader')).toHaveText(['Quantity', 'Price each']);
    await expect(first.getByText('Indicative')).toBeVisible();
    await expect(first.locator('tbody tr').nth(1)).toHaveAttribute('aria-current', 'true');
    const loading = page.getByTestId('loading');
    await expect(loading.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    await expect(loading.getByRole('status')).toHaveText('Loading prices');
    await expect(loading.locator('.rb-skeleton')).toHaveCount(9);
  });
  test('Dutch: texts, number format and hint', async ({ page }) => {
    await page.goto('/?s=tier-nl');
    const table = page.getByRole('table', { name: 'Staffelprijzen' });
    await expect(table.getByRole('columnheader')).toHaveText(['Aantal', 'Stukprijs', 'Besparing']);
    await expect(table.locator('tbody tr').nth(2).getByRole('rowheader')).toContainText('1.000+');
    await expect(table.locator('tbody tr').nth(2).getByRole('rowheader')).toContainText('Jouw prijs');
    await expect(table.locator('tbody tr').nth(2).locator('td').first()).toHaveText(`€${nbsp}0,410`);
    await expect(page.locator('.rb-tier-pricing__footnote')).toHaveText('Prijzen excl. btw');
    await expect(page.getByTestId('hint')).toHaveText(`Bestel er 200 bij en betaal €${nbsp}0,450 per stuk`.replace('0,450', '0,410').replace('200', '700'));
  });
});
