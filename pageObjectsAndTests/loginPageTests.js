import dotenv from 'dotenv';
dotenv.config(); // Load .env variables  (gitignored!)
import { test, expect } from '@playwright/test';

class loginPageTests {
    constructor(page) {
      this.page = page;
      this.emailInput = page.locator('input[type="email"][name="e"]');
      this.continueButton = page.locator('.LoginEmailForm-continueButton');
      this.passwordInput = page.locator('input#lui_6[type="password"]');
      this.loginButton = page.locator('.LoginPasswordForm-loginButton');
    }
  
    // Method to navigate to the login page
    async navigateToLoginPage() {
      await this.page.goto('https://app.asana.com/-/login');
      const title = this.page.locator('h2', { hasText: 'Welcome to Asana' });
      await expect(title).toHaveText('Welcome to Asana');
    }
  
    // Method to perform login with provided credentials
    async login() {
      const email = process.env.ASANA_EMAIL;
      const password = process.env.ASANA_PASSWORD;

      await expect(this.emailInput).toBeVisible();
      await expect(this.continueButton).toBeVisible();
      await this.emailInput.fill(email);
      await this.continueButton.click();
      await expect(this.passwordInput).toBeVisible();
      await expect(this.loginButton).toBeVisible();
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
  }
  
  export default loginPageTests;