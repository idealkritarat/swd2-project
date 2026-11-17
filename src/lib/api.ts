import type {
  ApiList,
  ApiOne,
  RegisterInput,
  Registration,
  Workshop,
  WorkshopInput,
} from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || (body && body.success === false)) {
    throw new ApiError(
      body?.error ?? body?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  }
  return body as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<
      ApiOne<{ id: string; name: string; email: string; role: string; token: string }>
    >("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (input: RegisterInput) =>
    request<ApiOne<{ token: string }>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

export const workshopApi = {
  list: (search?: string) =>
    request<ApiList<Workshop>>(
      `/workshops${search ? `?search=${encodeURIComponent(search)}` : ""}`,
    ),
  get: (id: string) => request<ApiOne<Workshop>>(`/workshops/${id}`),
  create: (input: WorkshopInput, token: string) =>
    request<ApiOne<Workshop>>("/workshops", {
      method: "POST",
      body: JSON.stringify(input),
      token,
    }),
  update: (id: string, input: Partial<WorkshopInput>, token: string) =>
    request<ApiOne<Workshop>>(`/workshops/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
      token,
    }),
  remove: (id: string, token: string) =>
    request<ApiOne<unknown>>(`/workshops/${id}`, { method: "DELETE", token }),
};

export const registrationApi = {
  list: (token: string) => request<ApiList<Registration>>("/registrations", { token }),
  create: (workshop: string, token: string) =>
    request<ApiOne<Registration>>("/registrations", {
      method: "POST",
      body: JSON.stringify({ workshop }),
      token,
    }),
  update: (id: string, workshop: string, token: string) =>
    request<ApiOne<Registration>>(`/registrations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ workshop }),
      token,
    }),
  remove: (id: string, token: string) =>
    request<ApiOne<unknown>>(`/registrations/${id}`, { method: "DELETE", token }),
};
