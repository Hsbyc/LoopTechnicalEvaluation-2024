import dotenv from 'dotenv';
dotenv.config(); // Load .env variables
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { test, expect } from '@playwright/test';

// Import environment variables from .env
const basePath = process.env.BASE_DIR;

let LoginPageTests, WelcomePageTests, CrossFunctionalProjectPlanPageTests, WorkRequestsPageTests;

test.describe('Test Suite', () => {
  let context, page, loginPage, welcomePageTests, crossFunctionalProjectPlanPageTests, workRequestsPageTests;

  test.beforeAll(async () => {
    // Dynamically import your page objects inside beforeAll (or when you need them)
    LoginPageTests = (await import(`${basePath}/pageObjectsAndTests/loginPageTests.js`)).default;
    WelcomePageTests = (await import(`${basePath}/pageObjectsAndTests/welcomePageTests.js`)).default;
    CrossFunctionalProjectPlanPageTests = (await import(`${basePath}/pageObjectsAndTests/crossFunctionalProjectPlanPageTests.js`)).default;
    WorkRequestsPageTests = (await import(`${basePath}/pageObjectsAndTests/workRequestsPageTests.js`)).default;

    // Launch the browser and create a browser context
    const browser = await chromium.launch({ headless: true }); // Turn false to watch test cases running
    context = await browser.newContext();

    // Perform login and save session state
    await loginOnce(context);

    // Instantiate the page objects
    page = await context.newPage();
    loginPage = new LoginPageTests(page);
    welcomePageTests = new WelcomePageTests(page);
    crossFunctionalProjectPlanPageTests = new CrossFunctionalProjectPlanPageTests(page);
    workRequestsPageTests = new WorkRequestsPageTests(page);
  });

  test.afterAll(async () => {
    await context.browser().close();
  });

  // Load test data from JSON file
  const testData = JSON.parse(fs.readFileSync('./testData.json'));

  // Dynamically run each test based on the test data
  testData.testCases.forEach((data) => {
    test(data.testName, async () => {
      await runTest(data.testName, context, data.projectName, data.todo, data.tags);
    });
  });
});

// Helper method to perform login and save the session state
async function loginOnce(context) {
  const page = await context.newPage();
  const loginPage = new LoginPageTests(page);
  const welcomePageTests = new WelcomePageTests(page);

  await loginPage.navigateToLoginPage();
  await loginPage.login();
  // Wait for the greeting to show up and verify login
  await welcomePageTests.verifyLogin();
  // Save the session state (cookies, localStorage, etc.)
  await context.storageState({ path: path.resolve('authState.json') });

  console.log('Login successful and session state saved.');
}

// Helper method for passing the login step
async function prepareForTest(context) {
  const page = await context.newPage();
  // Load the session state (login info)
  await context.storageState({ path: path.resolve('authState.json') });
  await page.goto('https://app.asana.com/0/');
  return page;
}

// Helper method to run a test with the saved login session
async function runTest(testCase, context, projectName, todoOrRequest, expectedTags) {
  const page = await prepareForTest(context);
  const welcomePageTests = new WelcomePageTests(page);
  const crossFunctionalProjectPlanPageTests = new CrossFunctionalProjectPlanPageTests(page);
  const workRequestsPageTests = new WorkRequestsPageTests(page);

  console.log(`${testCase} started...`);
  await welcomePageTests.dynamicSearch(projectName, page);
  console.log('Search bar action completed for ' + projectName);

  if (projectName.startsWith('Cross')) {
    await crossFunctionalProjectPlanPageTests.verifyTodos(todoOrRequest, expectedTags);
  } else if (projectName.startsWith('Work')) {
    await workRequestsPageTests.verifyWorkRequests(todoOrRequest, expectedTags);
  }
  console.log(`${testCase} completed successfully.`);
}