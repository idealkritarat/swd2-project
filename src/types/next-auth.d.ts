import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: "admin" | "member";
    token: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "admin" | "member";
      token: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "member";
    apiToken?: string;
    userId?: string;
  }
}
