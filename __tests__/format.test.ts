import { dateParts, formatDate, isPast, monthLabel, toDateInput, todayUtc } from "@/lib/format";

describe("format helpers", () => {
  it("formats an ISO date in UTC", () => {
    expect(formatDate("2026-12-01T00:00:00.000Z")).toBe("1 Dec 2026");
  });

  it("returns the raw value for an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("splits a date into the parts shown on the date tile", () => {
    expect(dateParts("2026-12-05T00:00:00.000Z")).toEqual({ day: "5", month: "Dec", weekday: "Sat" });
    expect(monthLabel("2026-12-05T00:00:00.000Z")).toBe("December 2026");
  });

  it("cuts an ISO string down to a date input value", () => {
    expect(toDateInput("2026-12-01T00:00:00.000Z")).toBe("2026-12-01");
  });

  it("treats yesterday as past and today as not past", () => {
    const today = todayUtc();
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    expect(isPast(yesterday)).toBe(true);
    expect(isPast(today)).toBe(false);
  });
});
