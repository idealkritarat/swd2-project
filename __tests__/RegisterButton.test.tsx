import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterButton from "@/components/RegisterButton";
import { registrationApi } from "@/lib/api";

const useSession = jest.fn();
jest.mock("next-auth/react", () => ({ useSession: () => useSession() }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  registrationApi: { create: jest.fn() },
}));

const member = { data: { user: { role: "member", token: "tok" } }, status: "authenticated" };

describe("RegisterButton", () => {
  beforeEach(() => jest.clearAllMocks());

  it("asks visitors to log in", () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<RegisterButton workshopId="w1" />);
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login?callbackUrl=/workshops/w1",
    );
  });

  it("tells admins they cannot register", () => {
    useSession.mockReturnValue({ data: { user: { role: "admin" } }, status: "authenticated" });
    render(<RegisterButton workshopId="w1" />);
    expect(screen.getByText(/cannot register/i)).toBeInTheDocument();
  });

  it("registers a member and shows a confirmation", async () => {
    useSession.mockReturnValue(member);
    (registrationApi.create as jest.Mock).mockResolvedValue({ success: true });
    render(<RegisterButton workshopId="w1" />);
    await userEvent.click(screen.getByRole("button", { name: /register for this workshop/i }));
    expect(registrationApi.create).toHaveBeenCalledWith("w1", "tok");
    expect(await screen.findByRole("status")).toHaveTextContent(/you are registered/i);
  });

  it("shows the backend rule message when registration is refused", async () => {
    useSession.mockReturnValue(member);
    const { ApiError } = jest.requireActual("@/lib/api");
    (registrationApi.create as jest.Mock).mockRejectedValue(new ApiError("Workshop is full", 409));
    render(<RegisterButton workshopId="w1" />);
    await userEvent.click(screen.getByRole("button", { name: /register for this workshop/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Workshop is full");
  });
});
