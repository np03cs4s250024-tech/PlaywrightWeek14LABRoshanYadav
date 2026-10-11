
import { test, expect } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

const APP = pathToFileURL(
  path.resolve('app/sajilo-signup.html')
).href;


test('application opens on the login page', async ({ page }) => {
  await page.goto(APP);

  await expect(
    page.getByRole('heading', { name: 'Log in to Sajilo Pay' })
  ).toBeVisible();
});

  // await expect(page).toHaveURL(/#login$/);


// Test 2: Task 1 and Task 2 — Register Sita and log in successfully
test('new user can register and then log in', async ({ page }) => {
  // TODO 1: Open the application
  await page.goto(APP);

  // TODO 2: Open registration
  await page.getByRole('link', { name: 'Create an account' }).click();
  await expect(page).toHaveURL(/#register$/);

  // TODO 3: Fill registration details
  await page.getByLabel('Full name').fill('Sita Sharma');
  await page.getByLabel('Mobile number').fill('9812345678');
  await page.getByLabel('Email').fill('sita.sharma@example.com');
  await page.getByLabel('Password').fill('Sajilo@2082');

  // TODO 4: Select province and district
  await page.getByLabel('Province').selectOption('bagmati');
  await page.getByLabel('District').selectOption({ label: 'Kathmandu' });

  // TODO 5: Select Business account type
  await page.getByLabel('Business').check();

  // TODO 6: Upload citizenship photo
  await page.getByLabel('Citizenship photo').setInputFiles(
    path.resolve('test-data/citizenship.png')
  );

  await expect(page.getByTestId('file-info')).toContainText('Selected:');

  // TODO 7: Select notification preferences
  await page.getByLabel('SMS', { exact: true }).check();
  await page.getByLabel('Viber', { exact: true }).check();

  // TODO 8: Accept terms and register
  await page.getByLabel(
    'I agree to the Terms and Privacy Policy'
  ).check();

  await page.getByRole('button', { name: 'Create account' }).click();

  // Verify registration success
  await expect(page.getByRole('status')).toHaveText(
    'Account created for Sita. Please log in.'
  );

  await expect(page).toHaveURL(/#login$/);

  // TODO 9: Fill Sita's mobile number and password
  await page.getByLabel('Mobile number').fill('9812345678');
  await page.getByLabel('Password').fill('Sajilo@2082');

  // TODO 10: Submit by pressing Enter
  await page.getByLabel('Password').press('Enter');

  // TODO 11: Verify dashboard heading and wallet balance
  await expect(page).toHaveURL(/#dashboard$/);

  await expect(
    page.getByRole('heading', { name: 'Namaste, Sita!' })
  ).toBeVisible();

  await expect(page.getByTestId('wallet-balance')).toHaveText('Rs 0.00');

  // TODO 12: Verify Sita's profile details
  await expect(page.getByTestId('profile')).toContainText('Kathmandu');
  await expect(page.getByTestId('profile')).toContainText('Business');
  await expect(page.getByTestId('profile')).toContainText('SMS, Viber');
});

// Test 3: Task 3 — Wrong password shows an error and stays on login
test('wrong password shows an error and stays on login', async ({ page }) => {
  // Open the application
  await page.goto(APP);

  // TODO 1: Log in as Ram using an incorrect password
  await page.getByLabel('Mobile number').fill('9841234567');
  await page.getByLabel('Password').fill('Galat@123');

  await page.getByRole('button', { name: 'Log in' }).click();

  // TODO 2: Verify the error message
  await expect(page.getByRole('alert')).toHaveText(
    'Incorrect mobile number or password'
  );

  // TODO 3: Verify the login page remains visible
  await expect(
    page.getByRole('heading', { name: 'Log in to Sajilo Pay' })
  ).toBeVisible();

  // Verify the dashboard is not visible
  await expect(
    page.getByRole('heading', { name: /Namaste/ })
  ).not.toBeVisible();
});