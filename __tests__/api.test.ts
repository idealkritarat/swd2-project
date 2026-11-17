import { ApiError, registrationApi, workshopApi } from "@/lib/api";

function mockFetch(status: number, body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe("api client", () => {
  it("encodes the search term", async () => {
    mockFetch(200, { success: true, count: 0, data: [] });
    await workshopApi.list("react & node");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("?search=react%20%26%20node"),
      expect.any(Object),
    );
  });

  it("sends the bearer token", async () => {
    mockFetch(200, { success: true, count: 0, data: [] });
    await registrationApi.list("abc");
    const init = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(init.headers.Authorization).toBe("Bearer abc");
  });

  it("throws an ApiError carrying the backend message and status", async () => {
    mockFetch(409, { success: false, error: "Workshop is full" });
    await expect(registrationApi.create("w1", "t")).rejects.toMatchObject({
      message: "Workshop is full",
      status: 409,
    });
  });

  it("turns a network failure into a friendly error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("down")) as unknown as typeof fetch;
    await expect(workshopApi.list()).rejects.toBeInstanceOf(ApiError);
  });
});
