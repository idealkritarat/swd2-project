import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/register/page";
import { authApi } from "@/lib/api";

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("next-auth/react", () => ({ signIn: jest.fn() }));
jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  authApi: { register: jest.fn() },
}));

async function fill(overrides: Record<string, string> = {}) {
  const v = {
    "Full name": "Test User",
    Email: "t@test.dev",
    "Phone number": "0812345678",
    Password: "secret1",
    "Confirm password": "secret1",
    ...overrides,
  };
  for (const [label, value] of Object.entries(v)) {
    await userEvent.type(screen.getByLabelText(label, { exact: true }), value);
  }
  await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
}

describe("Sign up form", () => {
  beforeEach(() => jest.clearAllMocks());

  it("rejects mismatched passwords before calling the API", async () => {
    render(<RegisterPage />);
    await fill({ "Confirm password": "different" });
    expect(await screen.findByRole("alert")).toHaveTextContent(/do not match/i);
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("rejects an invalid phone number", async () => {
    render(<RegisterPage />);
    await fill({ "Phone number": "abc" });
    expect(await screen.findByRole("alert")).toHaveTextContent(/valid phone number/i);
  });

  it("submits valid details", async () => {
    (authApi.register as jest.Mock).mockResolvedValue({ success: true });
    render(<RegisterPage />);
    await fill();
    expect(authApi.register).toHaveBeenCalledWith(
      expect.objectContaining({ email: "t@test.dev", role: "member" }),
    );
  });
});
