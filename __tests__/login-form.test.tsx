import LoginForm from "@/app/components/loginForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

jest.mock("next-auth/react");
jest.mock("next/navigation");
jest.mock("sonner");

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock routing
jest.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
  useRouter: jest.fn(),
}));

describe("LoginForm Component", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    (signIn as jest.Mock).mockClear();
  });

  // ✅ Test 1: Normal Login Success
  it("should login successfully with valid credentials", async () => {
    const user = userEvent.setup();

    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
      error: null,
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Alamat Email");
    const passwordInput = screen.getByPlaceholderText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("berhasil"),
      );
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  // ✅ Test 2: Invalid Credentials Error
  it("should show error message on invalid credentials", async () => {
    const user = userEvent.setup();

    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: "Email atau password salah",
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Alamat Email");
    const passwordInput = screen.getByPlaceholderText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Email atau kata sandi salah"),
      );
    });
  });

  // ✅ Test 3: Rate Limit Detection (429 Error)
  it("should detect rate limit and show countdown timer", async () => {
    const user = userEvent.setup();

    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: "Terlalu banyak percobaan login, coba lagi dalam 15 menit",
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Alamat Email");
    const passwordInput = screen.getByPlaceholderText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Terlalu banyak percobaan"),
      );
    });

    // Check localStorage
    const rateLimitData = JSON.parse(
      localStorage.getItem("login_rate_limit") || "{}",
    );
    expect(rateLimitData.retryAfter).toBeDefined();
  });

  // ✅ Test 4: Form Disabled During Rate Limit
  it("should disable form during rate limit", async () => {
    // Pre-set rate limit in localStorage
    const rateLimitData = {
      timestamp: Date.now(),
      retryAfter: Date.now() + 5 * 60 * 1000, // 5 menit ke depan
    };
    localStorage.setItem("login_rate_limit", JSON.stringify(rateLimitData));

    render(<LoginForm />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText("Alamat Email");
      const passwordInput = screen.getByPlaceholderText("Kata Sandi");
      const submitButton = screen.getByRole("button", { name: /Masuk/i });

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    // Check alert message
    expect(
      screen.getByText(/Terlalu banyak percobaan login/i),
    ).toBeInTheDocument();
  });

  // ✅ Test 5: Rate Limit Countdown Timer
  it("should update countdown timer every second", async () => {
    jest.useFakeTimers();

    const rateLimitData = {
      timestamp: Date.now(),
      retryAfter: Date.now() + 60 * 1000, // 1 menit
    };
    localStorage.setItem("login_rate_limit", JSON.stringify(rateLimitData));

    render(<LoginForm />);

    await waitFor(() => {
      expect(screen.getByText(/Retry in:/i)).toBeInTheDocument();
      expect(screen.getByText(/60s/)).toBeInTheDocument();
    });

    // Fast-forward 30 seconds
    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(screen.getByText(/30s/)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  // ✅ Test 6: Google Sign In Disabled During Rate Limit
  it("should disable Google sign in during rate limit", async () => {
    const user = userEvent.setup();

    const rateLimitData = {
      timestamp: Date.now(),
      retryAfter: Date.now() + 5 * 60 * 1000,
    };
    localStorage.setItem("login_rate_limit", JSON.stringify(rateLimitData));

    render(<LoginForm />);

    await waitFor(() => {
      const googleButton = screen.getByRole("button", {
        name: /Masuk dengan Google/i,
      });
      expect(googleButton).toBeDisabled();
    });
  });

  // ✅ Test 7: Form Enabled After Rate Limit Expires
  it("should enable form after rate limit expires", async () => {
    jest.useFakeTimers();

    const rateLimitData = {
      timestamp: Date.now(),
      retryAfter: Date.now() + 2000, // 2 detik
    };
    localStorage.setItem("login_rate_limit", JSON.stringify(rateLimitData));

    render(<LoginForm />);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /Masuk/i });
      expect(submitButton).toBeDisabled();
    });

    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /Masuk/i });
      expect(submitButton).not.toBeDisabled();
      expect(localStorage.getItem("login_rate_limit")).toBeNull();
    });

    jest.useRealTimers();
  });

  // ✅ Test 8: Network Error Handling
  it("should handle network errors gracefully", async () => {
    const user = userEvent.setup();

    (signIn as jest.Mock).mockRejectedValueOnce(
      new Error("Network error: Failed to fetch"),
    );

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Alamat Email");
    const passwordInput = screen.getByPlaceholderText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("jaringan"),
      );
    });
  });

  // ✅ Test 9: Submit Button Disabled When Fields Empty
  it("should disable submit button when fields are empty", () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /Masuk/i });
    expect(submitButton).toBeDisabled();
  });

  // ✅ Test 10: Clear localStorage After Successful Login
  it("should clear rate limit from localStorage after successful login", async () => {
    const user = userEvent.setup();

    // Pre-set rate limit
    const rateLimitData = {
      timestamp: Date.now(),
      retryAfter: Date.now() + 15 * 60 * 1000,
    };
    localStorage.setItem("login_rate_limit", JSON.stringify(rateLimitData));

    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
      error: null,
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Alamat Email");
    const passwordInput = screen.getByPlaceholderText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem("login_rate_limit")).toBeNull();
    });
  });
});
