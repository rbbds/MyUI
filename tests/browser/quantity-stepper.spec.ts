import { expect, test } from '@playwright/test';

test.describe('Quantity stepper: step, messages and hint', () => {
  test('without the new props nothing changes', async ({ page }) => {
    await page.goto('/?s=qty-step');
    const plain = page.getByTestId('plain');
    await expect(plain.getByRole('button', { name: 'One more' })).toBeVisible();
    await expect(plain.getByRole('status')).toBeEmpty();
    const box = await plain.locator('.rb-qty-field').boundingBox();
    const inner = await plain.locator('.rb-qty').boundingBox();
    expect(box).toEqual(inner);
    await expect(plain.locator('.rb-qty__input')).not.toHaveAttribute('step', /.*/);
  });
  test('the buttons go per step and say so', async ({ page }) => {
    await page.goto('/?s=qty-step');
    const unit = page.getByTestId('unit');
    const field = unit.getByRole('spinbutton', { name: 'Pens' });
    await unit.getByRole('button', { name: '25 more' }).click();
    await expect(field).toHaveValue('75');
    await unit.getByRole('button', { name: '25 less' }).click();
    await expect(field).toHaveValue('50');
    await expect(unit.getByRole('button', { name: '25 less' })).toHaveAttribute('aria-disabled', 'true');
  });
  test('a typed number is corrected and explained', async ({ page }) => {
    await page.goto('/?s=qty-step');
    const unit = page.getByTestId('unit');
    const field = unit.getByRole('spinbutton', { name: 'Pens' });
    const status = unit.getByRole('status');
    await field.fill('30');
    await field.press('Enter');
    await expect(field).toHaveValue('50');
    await expect(status).toHaveText('Minimum is 50');
    await field.fill('60');
    await field.blur();
    await expect(field).toHaveValue('75');
    await expect(status).toHaveText('Changed to 75. Sold per 25.');
    await field.fill('9999');
    await field.press('Enter');
    await expect(field).toHaveValue('5000');
    await expect(status).toHaveText('Maximum is 5000');
    await field.fill('100');
    await field.press('Enter');
    await expect(status).toBeEmpty();
  });
  test('the message takes the place of the hint and describes the field', async ({ page }) => {
    await page.goto('/?s=qty-step');
    const unit = page.getByTestId('unit');
    const field = unit.getByRole('spinbutton', { name: 'Pens' });
    await expect(unit.getByText('Add more for a lower price')).toBeVisible();
    await expect(field).toHaveAccessibleDescription('Add more for a lower price');
    await field.fill('30');
    await field.press('Enter');
    await expect(unit.getByText('Add more for a lower price')).toBeHidden();
    await expect(field).toHaveAccessibleDescription('Minimum is 50');
    await unit.getByRole('button', { name: '25 more' }).click();
    await expect(unit.getByText('Add more for a lower price')).toBeVisible();
  });
  test('the field is wide enough for the largest number', async ({ page }) => {
    await page.goto('/?s=qty-step');
    const narrow = await page.getByTestId('plain').locator('.rb-qty__input').boundingBox();
    const wide = await page.getByTestId('unit').locator('.rb-qty__input').boundingBox();
    expect(narrow!.width).toBe(40);
    expect(wide!.width).toBeGreaterThan(50);
    const fits = await page.getByTestId('unit').locator('.rb-qty__input').evaluate((el: HTMLInputElement) => { el.value = '5000'; return el.scrollWidth <= el.clientWidth; });
    expect(fits).toBe(true);
  });
  test('Dutch: the limits move to the step and the texts are Dutch', async ({ page }) => {
    await page.goto('/?s=qty-step');
    const nl = page.getByTestId('nl');
    const field = nl.getByRole('spinbutton', { name: 'Aantal' });
    await expect(field).toHaveAttribute('min', '12');
    await field.fill('13');
    await field.press('Enter');
    await expect(field).toHaveValue('24');
    await expect(nl.getByRole('status')).toHaveText('Aangepast naar 24. Je bestelt per 12.');
    await expect(nl.getByRole('button', { name: '12 meer' })).toBeVisible();
  });
});
