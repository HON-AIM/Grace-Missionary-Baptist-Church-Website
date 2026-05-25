"use client";

import AuthGuard from "./AuthGuard";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
