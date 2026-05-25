"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
} from "react-icons/hi";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState<ResetPasswordInput>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setHasSession(false);
        return;
      }
      setHasSession(true);
    }
    checkSession();
  }, []);

  const passwordStrength = (pw: string): { label: string; color: string; width: string } => {
    const score = [/.{8,}/, /[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((r) =>
      r.test(pw)
    ).length;
    if (!pw) return { label: "", color: "", width: "0%" };
    if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score <= 2) return { label: "Fair", color: "bg-orange-500", width: "50%" };
    if (score <= 3) return { label: "Good", color: "bg-yellow-500", width: "75%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  };

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const result = resetPasswordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[err.path.length - 1] as string;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: form.password,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    }, 2500);
  };

  if (hasSession === null) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-navy-800/90 border border-navy-700/50 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <HiOutlineExclamationCircle className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h1 className="text-xl font-serif font-bold text-white mb-2">
            Invalid or Expired Link
          </h1>
          <p className="text-navy-400 text-sm mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/admin/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-all"
          >
            Request New Link
          </Link>
        </motion.div>
      </div>
    );
  }

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
        <motion.div className="bg-navy-800/90 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-8 lg:p-10 shadow-2xl shadow-navy-900/50">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <HiOutlineCheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                </motion.div>

                <h1 className="text-2xl font-serif font-bold text-white mb-2">
                  Password Updated
                </h1>
                <p className="text-navy-400 text-sm">
                  Your password has been reset successfully. Redirecting to sign in...
                </p>

                <div className="mt-6 flex justify-center">
                  <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-gold-500/20"
                  >
                    <HiOutlineShieldCheck className="w-8 h-8 text-navy-900" />
                  </motion.div>

                  <h1 className="text-2xl font-serif font-bold text-white">
                    Set New Password
                  </h1>
                  <p className="text-navy-400 text-sm mt-2">
                    Choose a strong password for your account
                  </p>
                  <div className="h-0.5 w-12 bg-gold-500/50 rounded-full mx-auto mt-4" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        className="w-full pl-11 pr-11 py-3 bg-navy-900/80 border border-navy-700 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60 transition-all"
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        autoFocus
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

                    {form.password && (
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1 w-full bg-navy-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: strength.width }}
                            className={`h-full rounded-full ${strength.color} transition-all`}
                          />
                        </div>
                        <p className={`text-xs ${strength.color.replace("bg-", "text-")}`}>
                          {strength.label}
                        </p>
                      </div>
                    )}

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

                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        { test: /.{8,}/, label: "8+ characters" },
                        { test: /[A-Z]/, label: "Uppercase letter" },
                        { test: /[a-z]/, label: "Lowercase letter" },
                        { test: /[0-9]/, label: "Number" },
                      ].map((rule) => (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-1.5 text-xs ${
                            rule.test.test(form.password)
                              ? "text-emerald-400"
                              : "text-navy-500"
                          }`}
                        >
                          <span>
                            {rule.test.test(form.password) ? "✓" : "○"}
                          </span>
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500 pointer-events-none" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm({ ...form, confirmPassword: e.target.value })
                        }
                        className="w-full pl-11 pr-11 py-3 bg-navy-900/80 border border-navy-700 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60 transition-all"
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirm ? (
                          <HiOutlineEyeOff className="w-5 h-5" />
                        ) : (
                          <HiOutlineEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                      >
                        <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>

                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
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
                        Updating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Reset Password
                        <HiOutlineArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
