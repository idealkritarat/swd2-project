import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/SearchBar";

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("SearchBar", () => {
  beforeEach(() => push.mockClear());

  it("navigates with an encoded query", async () => {
    render(<SearchBar />);
    await userEvent.type(screen.getByRole("textbox", { name: /search workshops/i }), "c++ intro");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(push).toHaveBeenCalledWith("/?search=c%2B%2B%20intro");
  });

  it("goes back to the full list when cleared", async () => {
    render(<SearchBar initial="react" />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(push).toHaveBeenCalledWith("/");
  });
});
