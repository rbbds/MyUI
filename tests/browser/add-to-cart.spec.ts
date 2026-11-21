import { expect, test } from '@playwright/test';

test.describe('Add to cart: order unit, hint and second action', () => {
  test('without the new props it starts at 1 and has one button', async ({ page }) => {
    await page.goto('/?s=buy-plain');
    await expect(page.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('1');
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(page.locator('.rb-add-to-cart__secondary')).toHaveCount(0);
    const rows = await page.locator('.rb-add-to-cart__row > *, .rb-add-to-cart__row .rb-qty').evaluateAll((els) => els.filter((el) => el.getBoundingClientRect().height > 0).map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(rows).size).toBe(1);
  });
  test('starts at the minimum, goes per step and tells the page the quantity', async ({ page }) => {
    await page.goto('/?s=buy-bulk');
    const field = page.getByRole('spinbutton', { name: 'Quantity Pen' });
    await expect(field).toHaveValue('50');
    await page.getByRole('button', { name: '25 more' }).click();
    await expect(field).toHaveValue('75');
    await expect(page.getByText('Hint for 75')).toBeVisible();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.getByTestId('log')).toHaveText('add 75');
  });
  test('the hint and the message sit below the row and do not move the buttons', async ({ page }) => {
    await page.goto('/?s=buy-bulk');
    const buy = page.getByRole('button', { name: 'Add to cart' });
    const stepper = page.locator('.rb-add-to-cart .rb-qty');
    const before = [await buy.boundingBox(), await stepper.boundingBox()];
    const field = page.getByRole('spinbutton', { name: 'Quantity Pen' });
    await field.fill('60');
    await field.press('Enter');
    const message = page.locator('.rb-add-to-cart').getByRole('status');
    await expect(message).toHaveText('Changed to 75. Sold per 25.');
    expect([await buy.boundingBox(), await stepper.boundingBox()]).toEqual(before);
    const box = await message.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(before[0]!.y + before[0]!.height);
    expect(Math.round(box!.x)).toBe(Math.round(before[1]!.x));
  });
  test('the second action gets the quantity and blocks both buttons while busy', async ({ page }) => {
    await page.goto('/?s=buy-bulk');
    const quote = page.getByRole('button', { name: 'Request a quote' });
    await expect(quote).toHaveAccessibleDescription('For large orders.');
    await quote.click();
    await expect(page.getByTestId('log')).toHaveText('quote 50');
    await expect(quote).toHaveAttribute('aria-busy', 'true');
    await quote.click({ force: true });
    await page.getByRole('button', { name: 'Add to cart' }).click({ force: true });
    await expect(page.getByTestId('log')).toHaveText('quote 50');
    await page.getByRole('button', { name: 'Done' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.getByTestId('log')).toHaveText('quote 50, add 50');
  });
  test('Cart item keeps the minimum and the step, and the message does not move the remove button', async ({ page }) => {
    await page.goto('/?s=cart-min');
    const field = page.getByRole('spinbutton', { name: 'Quantity Pen' });
    const remove = page.getByRole('button', { name: 'Remove Pen' });
    const before = await remove.boundingBox();
    await expect(page.getByRole('button', { name: '25 less' })).toHaveAttribute('aria-disabled', 'true');
    await field.fill('10');
    await field.press('Enter');
    await expect(field).toHaveValue('50');
    await expect(page.locator('.rb-cart-item').getByRole('status')).toHaveText('Minimum is 50');
    expect(await remove.boundingBox()).toEqual(before);
  });
});
