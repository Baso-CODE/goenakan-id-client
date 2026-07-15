import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

// ✅ Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
}));

// ✅ Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// ✅ Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
}));

// ✅ Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "Login.title": "Selamat Datang",
      "Login.subtitle": "Silakan masukkan detail Anda untuk masuk.",
      "Login.emailPlaceholder": "Alamat Email",
      "Login.passwordPlaceholder": "Kata Sandi",
      "Login.forgotPassword": "Lupa Kata Sandi?",
      "Login.signInButton": "Masuk",
      "Login.signingInText": "Sedang masuk...",
      "Login.orText": "Atau",
      "Login.googleSignIn": "Masuk dengan Google",
      "Login.noAccountText": "Belum punya akun?",
      "Login.createAccountLink": "Buat akun sekarang",
      "Login.messages.success": "Login berhasil! Selamat datang kembali.",
      "Login.messages.errorDefault": "Terjadi kesalahan saat login.",
      "Login.messages.tooManyAttempts":
        "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
      "Login.messages.invalidCredentials":
        "Email atau kata sandi salah. Silakan coba lagi.",
      "Login.messages.serverError":
        "Kesalahan server. Silakan coba lagi nanti.",
      "Login.messages.networkError":
        "Kesalahan jaringan. Silakan periksa koneksi Anda.",
    };
    return translations[key] || key;
  },
  useLocale: () => "id",
}));

// ✅ Mock @/i18n/routing
jest.mock("@/i18n/routing", () => ({
  Link: jest.fn(({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )),
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

// ✅ Import LoginForm component
import LoginForm from "@/app/components/loginForm";

describe("LoginForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ Mock localStorage.clear() properly
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  // ✅ Test 1: Render form dengan benar
  it("should render login form correctly", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("Alamat Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Kata Sandi")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Masuk/i })).toBeInTheDocument();
  });

  // ✅ Test 2: Submit button disabled saat kosong
  it("should disable submit button when form is empty", () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /Masuk/i });
    expect(submitButton).toBeDisabled();
  });

  // ✅ Test 3: Submit button enabled saat terisi
  it("should enable submit button when form is filled", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Alamat Email");
    const passwordInput = screen.getByPlaceholderText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(submitButton).not.toBeDisabled();
  });

  // ✅ Test 4: Successful login
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
      expect(toast.success).toHaveBeenCalled();
    });
  });

  // ✅ Test 5: Invalid credentials error
  it("should show error on invalid credentials", async () => {
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
      expect(toast.error).toHaveBeenCalled();
    });
  });

  // ✅ Test 6: Rate limit detection
  it("should detect rate limit and show error", async () => {
    const user = userEvent.setup();

    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: "Terlalu banyak percobaan login, coba lagi dalam 15 menit",
    });

    // ✅ Mock localStorage.setItem
    (window.localStorage.setItem as jest.Mock).mockImplementation(
      (key: string, value: string) => {
        window.localStorage[key as any] = value;
      },
    );

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Alamat Email");
    const passwordInput = screen.getByPlaceholderText("Kata Sandi");
    const submitButton = screen.getByRole("button", { name: /Masuk/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "login_rate_limit",
      expect.any(String),
    );
  });

  // ✅ Test 7: Form disabled during rate limit
  it("should disable form when rate limited", async () => {
    // ✅ Mock localStorage.getItem
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify({
        timestamp: Date.now(),
        retryAfter: Date.now() + 5 * 60 * 1000,
      }),
    );

    render(<LoginForm />);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText(
        "Alamat Email",
      ) as HTMLInputElement;
      expect(emailInput.disabled).toBe(true);
    });

    expect(
      screen.getByText(/Terlalu banyak percobaan login/i),
    ).toBeInTheDocument();
  });

  // ✅ Test 8: Google sign in disabled during rate limit
  it("should disable Google button when rate limited", async () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(
      JSON.stringify({
        timestamp: Date.now(),
        retryAfter: Date.now() + 5 * 60 * 1000,
      }),
    );

    render(<LoginForm />);

    await waitFor(() => {
      const googleButton = screen.getByRole("button", {
        name: /Masuk dengan Google/i,
      });
      expect(googleButton).toBeDisabled();
    });
  });

  // ✅ Test 9: Network error handling
  it("should handle network errors", async () => {
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
      expect(toast.error).toHaveBeenCalled();
    });
  });

  // ✅ Test 10: Forgot password link
  it("should have forgot password link", () => {
    render(<LoginForm />);

    const forgotLink = screen.getByText(/Lupa Kata Sandi/i);
    expect(forgotLink).toBeInTheDocument();
  });

  // ✅ Test 11: Register link
  it("should have register link", () => {
    render(<LoginForm />);

    const registerLink = screen.getByText(/Buat akun sekarang/i);
    expect(registerLink).toBeInTheDocument();
  });

  // ✅ Test 12: Google sign in button exists
  it("should have Google sign in button", () => {
    render(<LoginForm />);

    const googleButton = screen.getByRole("button", {
      name: /Masuk dengan Google/i,
    });
    expect(googleButton).toBeInTheDocument();
  });
});
