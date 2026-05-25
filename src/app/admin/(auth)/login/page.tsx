"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, LoginInput } from "@/lib/validations";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

type AuthErrorCode =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "rate_limit"
  | "network"
  | "unknown";

const errorMessages: Record<AuthErrorCode, string> = {
  invalid_credentials: "Invalid email or password. Please try again.",
  email_not_confirmed: "Please confirm your email address before signing in.",
  rate_limit: "Too many login attempts. Please wait a moment and try again.",
  network:
    "Unable to connect. Please check your internet connection and try again.",
  unknown: "An unexpected error occurred. Please try again.",
};

function parseAuthError(message: string): { code: AuthErrorCode; display: string } {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials"))
    return { code: "invalid_credentials", display: errorMessages.invalid_credentials };
  if (lower.includes("email not confirmed"))
    return { code: "email_not_confirmed", display: errorMessages.email_not_confirmed };
  if (lower.includes("rate limit") || lower.includes("too many"))
    return { code: "rate_limit", display: errorMessages.rate_limit };
  if (lower.includes("network") || lower.includes("fetch"))
    return { code: "network", display: errorMessages.network };
  return { code: "unknown", display: message || errorMessages.unknown };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "logged-out") setJustLoggedOut(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setJustLoggedOut(false);

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as string;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      const parsed = parseAuthError(error.message);
      setServerError(parsed.display);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence>
          {justLoggedOut && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
            >
              <HiOutlineShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-emerald-300 text-sm">
                You have been signed out successfully.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-navy-800/90 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-8 lg:p-10 shadow-2xl shadow-navy-900/50"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-gold-500/20"
            >
              <span className="text-navy-900 font-serif font-bold text-2xl">G</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl lg:text-3xl font-serif font-bold text-white"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-navy-400 text-sm mt-2"
            >
              Sign in to the GMBC Admin Panel
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4 }}
              className="h-0.5 w-12 bg-gold-500/50 rounded-full mx-auto mt-4"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-navy-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-navy-900/80 border border-navy-700 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60 transition-all"
                  placeholder="admin@gmbc.org"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                >
                  <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-navy-300">
                  Password
                </label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs text-gold-500/80 hover:text-gold-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-11 py-3 bg-navy-900/80 border border-navy-700 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                >
                  <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <div className="flex items-center gap-3">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-sm text-navy-400 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5"
                >
                  <HiOutlineExclamationCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{serverError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-xl font-medium hover:from-gold-400 hover:to-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <HiOutlineArrowRight className="w-4 h-4" />
                </span>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-navy-500 text-xs"
          >
            Grace Missionary Baptist Church &mdash; Admin Panel
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
