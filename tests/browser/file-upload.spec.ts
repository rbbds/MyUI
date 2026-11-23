import { expect, test } from '@playwright/test';

test.describe('File upload: files slot, item slots and processing', () => {
  test('without files and outside a list nothing changes', async ({ page }) => {
    await page.goto('/?s=files');
    const plain = page.getByTestId('plain');
    await expect(plain.locator('.rb-upload-group')).toHaveCount(0);
    expect(await plain.locator('.rb-upload').evaluate((el) => el.parentElement!.getAttribute('data-testid'))).toBe('plain');
    const loose = page.getByTestId('loose').locator('.rb-file');
    await expect(loose).not.toHaveAttribute('role', /.*/);
    await expect(loose.locator('.rb-file__main')).toHaveCount(0);
    await expect(loose.getByRole('progressbar')).toBeVisible();
  });
  test('the files are a named list below the drop zone', async ({ page }) => {
    await page.goto('/?s=files');
    const list = page.getByTestId('group').getByRole('list', { name: 'Files' });
    await expect(list.getByRole('listitem')).toHaveCount(3);
    const zone = await page.getByTestId('group').locator('.rb-upload').boundingBox();
    const first = await list.getByRole('listitem').first().boundingBox();
    expect(first!.y).toBeGreaterThan(zone!.y + zone!.height);
    expect(first!.width).toBe(zone!.width);
  });
  test('processing shows a spinner with text, no progress bar, and is read out', async ({ page }) => {
    await page.goto('/?s=files');
    const item = page.getByTestId('group').getByRole('listitem').nth(0);
    await expect(item.locator('.rb-file__processing')).toHaveText('Checking file');
    await expect(item.locator('.rb-spinner')).toBeVisible();
    await expect(item.getByRole('progressbar')).toHaveCount(0);
    await expect(item.getByRole('status')).toHaveText('Checking a.png');
    await expect(page.getByTestId('nl').locator('.rb-file__processing')).toHaveText('Bestand controleren');
    await expect(page.getByTestId('nl').getByRole('list', { name: 'Bestanden' })).toBeVisible();
  });
  test('media replaces the icon, actions work, and a complete file can still be removed', async ({ page }) => {
    await page.goto('/?s=files');
    const item = page.getByTestId('group').getByRole('listitem').nth(1);
    await expect(item.getByTestId('thumb')).toBeVisible();
    await expect(item.locator('.rb-featured-icon')).toHaveCount(0);
    await item.getByRole('button', { name: 'Replace' }).click();
    await item.getByRole('button', { name: /^Remove a-very-long/ }).click();
    await expect(page.getByTestId('log')).toHaveText('replace, remove b');
    await expect(item.getByRole('img', { name: 'Uploaded' })).toBeVisible();
  });
  test('the trailing items share one center line and a long name does not push them out', async ({ page }) => {
    await page.goto('/?s=files');
    const item = page.getByTestId('group').getByRole('listitem').nth(1);
    const centers = await item.locator('.rb-file__trailing > *').evaluateAll((els) => els.map((el) => { const r = el.getBoundingClientRect(); return Math.round(r.top + r.height / 2); }));
    expect(centers).toHaveLength(3);
    expect(new Set(centers).size).toBe(1);
    const card = await item.boundingBox();
    const remove = await item.getByRole('button', { name: /^Remove/ }).boundingBox();
    expect(remove!.x + remove!.width).toBeLessThanOrEqual(card!.x + card!.width);
    const name = item.locator('.rb-file__name');
    expect(await name.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  });
  test('content sits below the file inside the card, and an error can have its own action', async ({ page }) => {
    await page.goto('/?s=files');
    const item = page.getByTestId('group').getByRole('listitem').nth(1);
    const alert = await item.getByText('Low resolution').boundingBox();
    const name = await item.locator('.rb-file__name').boundingBox();
    const card = await item.boundingBox();
    expect(alert!.y).toBeGreaterThan(name!.y + name!.height);
    expect(alert!.y + alert!.height).toBeLessThanOrEqual(card!.y + card!.height);
    const err = page.getByTestId('group').getByRole('listitem').nth(2);
    await expect(err).toContainText('Wrong type.');
    await err.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByTestId('log')).toHaveText('retry');
  });
});
