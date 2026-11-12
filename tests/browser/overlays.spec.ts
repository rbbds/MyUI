import { expect, test, type Page } from '@playwright/test';

const openModal = async (page: Page, scenario: string) => {
  await page.goto(`/?s=${scenario}`);
  await page.getByRole('button', { name: 'Open modal' }).click();
  await expect(page.getByRole('dialog', { name: 'Modal title' })).toBeVisible();
};
// Known bugs from the review of 12 November 2026 (H4, H5). They get fixed with the shared panel layer.
// test.fail() keeps CI green now and turns red when the bug is gone: then remove the line.
const KNOWN = 'Known bug, see CHANGELOG (Unreleased, Known issues)';
const modal = (page: Page) => page.getByRole('dialog', { name: 'Modal title' });

test.describe('Escape in a panel inside a Modal closes only the panel', () => {
  test('Dropdown menu', async ({ page }) => {
    test.fail(true, KNOWN);
    await openModal(page, 'modal-dropdown');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
  test('Popover', async ({ page }) => {
    test.fail(true, KNOWN);
    await openModal(page, 'modal-popover');
    await page.getByRole('button', { name: 'Info' }).click();
    await expect(page.getByRole('dialog', { name: 'Help' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Help' })).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
  test('Date picker', async ({ page }) => {
    test.fail(true, KNOWN);
    await openModal(page, 'modal-datepicker');
    await page.getByRole('button', { name: 'Choose a date' }).click();
    await expect(page.getByRole('grid')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('grid')).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
  test('Date range picker', async ({ page }) => {
    test.fail(true, KNOWN);
    await openModal(page, 'modal-daterange');
    await page.getByRole('button', { name: /Period/ }).click();
    await expect(page.getByRole('dialog', { name: 'Choose a period' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Choose a period' })).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
  test('Combobox', async ({ page }) => {
    await openModal(page, 'modal-combobox');
    await page.getByRole('combobox', { name: 'Country' }).click();
    await expect(page.getByRole('option', { name: 'Belgium' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('option', { name: 'Belgium' })).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
});

test('A toast stays visible and is not inert while a Modal is open', async ({ page }) => {
  test.fail(true, KNOWN);
  await openModal(page, 'modal-toast');
  const state = await page.locator('.rb-alert--toast').evaluate((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    // An element outside a modal dialog is inert: it cannot take focus.
    const probe = document.createElement('button');
    el.appendChild(probe);
    probe.focus();
    const focusable = document.activeElement === probe;
    probe.remove();
    return { onTop: !!top && el.contains(top), focusable };
  });
  expect(state).toEqual({ onTop: true, focusable: true });
});

test('Combobox: the chevron closes an open list', async ({ page }) => {
  await page.goto('/?s=combobox');
  const input = page.getByRole('combobox', { name: 'Country' });
  await input.click();
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Show options' }).click();
  await expect(input).toHaveAttribute('aria-expanded', 'false');
});

test('Date range picker: the accessible name of the trigger includes the chosen period', async ({ page }) => {
  await page.goto('/?s=daterange');
  // The name must hold the label and the value. A label alone hides the value from screen readers.
  await expect(page.getByRole('button', { name: /Period.*11\/01\/2026/ })).toBeVisible();
});
