import { test } from '@e2e/fixtures/test.fixture';
import { generateAlias } from '@e2e/helpers/generator.helper';
import { expect } from '@playwright/test';

test.beforeEach(async ({ spireKeyApp, webAuthnHelper }) => {
  await spireKeyApp.OpenSpireKeyApp();
  await webAuthnHelper.enableWebAuthN();
});

test('Create new Wallet using SpireKey', async ({
  welcomePage,
  registerPage,
  accountsPage,
}) => {
  const alias = await generateAlias();

  await test.step('Start Registration', async () => {
    await welcomePage.startRegistration();
  });

  await test.step('Set Alias.', async () => {
    await registerPage.setAliasTo(alias);
    await registerPage.proceedToNextStep();
  });

  await test.step('Set Passkey.', async () => {
    await registerPage.createPassKey();
  });

  await test.step('Set Device Type.', async () => {
    await registerPage.setDeviceTypeTo('phone');
    await registerPage.proceedToNextStep();
  });

  await test.step('Set Color.', async () => {
    await registerPage.setColorTo('green');
  });

  await test.step('Complete Registration.', async () => {
    await registerPage.completeRegistration();
  });

  await test.step('An account with the provided alias has been genrated.', async () => {
    await expect(await accountsPage.getAccountCard(alias)).toBeVisible();
  });
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole('heading', { name: 'Installation' }),
  ).toBeVisible();
});
