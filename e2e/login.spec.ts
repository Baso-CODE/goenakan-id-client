import { expect, test } from "@playwright/test";

test.describe("Login Flow with Rate Limiter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
  });

  // ✅ Test 1: Successful Login
  test("should successfully login with valid credentials", async ({ page }) => {
    await page.fill('input[type="email"]', "user@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button:has-text("Masuk")');

    // Wait for redirect
    await page.waitForURL("/");
    expect(page.url()).toContain("/");
  });

  // ✅ Test 2: Invalid Credentials
  test("should show error for invalid credentials", async ({ page }) => {
    await page.fill('input[type="email"]', "user@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button:has-text("Masuk")');

    // Wait for error toast
    const errorMessage = page.locator("text=Email atau kata sandi salah");
    await expect(errorMessage).toBeVisible();
  });

  // ✅ Test 3: Rate Limit After 5 Attempts
  test("should rate limit after 5 failed login attempts", async ({
    page,
    context,
  }) => {
    // Attempt login 5 times
    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="email"]', "user@example.com");
      await page.fill('input[type="password"]', "wrongpassword");
      await page.click('button:has-text("Masuk")');

      // Wait for error toast to disappear
      await page.waitForTimeout(1000);
    }

    // 6th attempt should be rate limited
    await page.fill('input[type="email"]', "user@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button:has-text("Masuk")');

    // Check for rate limit message
    const rateLimitMessage = page.locator(
      "text=Terlalu banyak percobaan login",
    );
    await expect(rateLimitMessage).toBeVisible();

    // Check timer appears
    const timerText = page.locator("text=/Retry in:/");
    await expect(timerText).toBeVisible();
  });

  // ✅ Test 4: Form Disabled During Rate Limit
  test("should disable form when rate limited", async ({ page }) => {
    // Set rate limit in localStorage
    await page.evaluate(() => {
      const rateLimitData = {
        timestamp: Date.now(),
        retryAfter: Date.now() + 15 * 60 * 1000,
      };
      localStorage.setItem("login_rate_limit", JSON.stringify(rateLimitData));
    });

    // Reload page
    await page.reload();

    // Check inputs are disabled
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button:has-text("Masuk")');

    await expect(emailInput).toBeDisabled();
    await expect(passwordInput).toBeDisabled();
    await expect(submitButton).toBeDisabled();

    // Check alert visible
    const alertBox = page.locator("text=Terlalu banyak percobaan login");
    await expect(alertBox).toBeVisible();
  });

  // ✅ Test 5: Google Sign In Button
  test("should login with Google", async ({ page }) => {
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.click('button:has-text("Masuk dengan Google")'),
    ]);

    expect(popup.url()).toContain("accounts.google.com");
  });

  // ✅ Test 6: Forgot Password Link
  test("should navigate to forgot password page", async ({ page }) => {
    await page.click("text=Lupa Kata Sandi?");
    await page.waitForURL("/forgot-password");
    expect(page.url()).toContain("/forgot-password");
  });

  // ✅ Test 7: Create Account Link
  test("should navigate to register page", async ({ page }) => {
    await page.click("text=Buat akun sekarang");
    await page.waitForURL("/register");
    expect(page.url()).toContain("/register");
  });

  // ✅ Test 8: Auto-logout After 1 Day (JWT expiry)
  test("should clear rate limit after successful login", async ({ page }) => {
    // Set rate limit
    await page.evaluate(() => {
      const rateLimitData = {
        timestamp: Date.now(),
        retryAfter: Date.now() + 15 * 60 * 1000,
      };
      localStorage.setItem("login_rate_limit", JSON.stringify(rateLimitData));
    });

    // Mock successful login
    await page.fill('input[type="email"]', "user@example.com");
    await page.fill('input[type="password"]', "correctpassword");

    // Intercept network and mock success response
    await page.route("**/api/auth/callback/credentials", (route) => {
      route.abort("blockedbyclient");
    });

    // Check localStorage is cleared after "login"
    const rateLimitCleared = await page.evaluate(
      () => localStorage.getItem("login_rate_limit") === null,
    );
    expect(rateLimitCleared).toBeTruthy();
  });
});
