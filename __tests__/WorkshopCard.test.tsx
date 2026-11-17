import { render, screen } from "@testing-library/react";
import WorkshopCard from "@/components/WorkshopCard";
import type { Workshop } from "@/types";

const base: Workshop = {
  _id: "w1",
  name: "React Basics",
  description: "Components and state",
  instructor: "Aj. Pat",
  workshopDate: "2099-01-01T00:00:00.000Z",
  location: "Lab 301",
  capacity: 15,
  isActive: true,
};

describe("WorkshopCard", () => {
  it("shows the workshop and links to its detail page", () => {
    render(<WorkshopCard workshop={base} />);
    expect(screen.getByRole("heading", { name: "React Basics" })).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
      "href",
      "/workshops/w1",
    );
  });

  it("marks a past workshop as ended", () => {
    render(<WorkshopCard workshop={{ ...base, workshopDate: "2000-01-01T00:00:00.000Z" }} />);
    expect(screen.getByText("Ended")).toBeInTheDocument();
  });
});
