import { expect, test, type Page } from '@playwright/test';

const openModal = async (page: Page, scenario: string) => {
  await page.goto(`/?s=${scenario}`);
  await page.getByRole('button', { name: 'Open modal' }).click();
  await expect(page.getByRole('dialog', { name: 'Modal title' })).toBeVisible();
};
const modal = (page: Page) => page.getByRole('dialog', { name: 'Modal title' });

test.describe('Escape in a panel inside a Modal closes only the panel', () => {
  test('Dropdown menu', async ({ page }) => {
    await openModal(page, 'modal-dropdown');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
  test('Popover', async ({ page }) => {
    await openModal(page, 'modal-popover');
    await page.getByRole('button', { name: 'Info' }).click();
    await expect(page.getByRole('dialog', { name: 'Help' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Help' })).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
  test('Date picker', async ({ page }) => {
    await openModal(page, 'modal-datepicker');
    await page.getByRole('button', { name: 'Choose a date' }).click();
    await expect(page.getByRole('grid')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('grid')).toBeHidden();
    await expect(modal(page)).toBeVisible();
  });
  test('Date range picker', async ({ page }) => {
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

test.describe('Shared panel layer', () => {
  test('Tab out of a Popover closes it and the focus stays where it went', async ({ page }) => {
    await page.goto('/?s=popover-focus');
    await page.getByRole('button', { name: 'Info' }).click();
    const panel = page.getByRole('dialog', { name: 'Help' });
    await expect(panel).toBeVisible();
    await page.keyboard.press('Tab'); // close button
    await page.keyboard.press('Tab'); // out of the popover
    await expect(panel).toBeHidden();
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('A click outside closes a Popover and does not move the focus back to the trigger', async ({ page }) => {
    await page.goto('/?s=popover-focus');
    await page.getByRole('button', { name: 'Info' }).click();
    await page.getByRole('button', { name: 'After' }).click();
    await expect(page.getByRole('dialog', { name: 'Help' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('A menu inside a Modal is not clipped by a box with overflow hidden', async ({ page }) => {
    await openModal(page, 'modal-clip');
    await page.getByRole('button', { name: 'Menu' }).click();
    const last = page.getByRole('menuitem', { name: 'Delete' });
    await expect(last).toBeVisible();
    // The last item lies far outside the 48 px box. It must be the element on top at its own centre.
    const onTop = await last.evaluate((el) => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)); });
    expect(onTop).toBe(true);
    await last.click();
    await expect(page.getByRole('menu')).toBeHidden();
  });
});

test.describe('Dropdown menu keyboard', () => {
  test('Arrow down opens on the first item, arrow up on the last', async ({ page }) => {
    await page.goto('/?s=dropdown');
    const trigger = page.getByRole('button', { name: 'Menu' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  });

  test('Typing a letter moves to the next item that starts with it', async ({ page }) => {
    await page.goto('/?s=dropdown');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
    await page.keyboard.press('d');
    await expect(page.getByRole('menuitem', { name: 'Download' })).toBeFocused();
    await page.keyboard.press('d');
    await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  });

  test('The own onClick of the trigger keeps working', async ({ page }) => {
    await page.goto('/?s=dropdown');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByText('Trigger clicks: 1')).toBeVisible();
    await expect(page.getByRole('menu')).toBeVisible();
  });
});

test.describe('Tooltip (WCAG 1.4.13)', () => {
  test('The pointer can move onto the tooltip, and Escape hides it while hovering', async ({ page }) => {
    await page.goto('/?s=tooltip');
    const tip = page.getByRole('tooltip');
    await page.getByRole('button', { name: 'Info' }).hover();
    await expect(tip).toBeVisible();
    await tip.hover();
    await expect(tip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
  });
});
