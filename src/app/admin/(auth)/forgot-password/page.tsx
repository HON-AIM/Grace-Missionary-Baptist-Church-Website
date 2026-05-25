"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations";
import {
  HiOutlineMail,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlinePaperAirplane,
} from "react-icons/hi";

export default function ForgotPasswordPage() {
  const [form, setForm] = useState<ForgotPasswordInput>({ email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const result = forgotPasswordSchema.safeParse(form);
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

    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect_to=/admin/reset-password`,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
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
        <motion.div className="bg-navy-800/90 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-8 lg:p-10 shadow-2xl shadow-navy-900/50">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <HiOutlineCheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                </motion.div>

                <h1 className="text-2xl font-serif font-bold text-white mb-2">
                  Check Your Email
                </h1>
                <p className="text-navy-400 text-sm mb-2">
                  We&apos;ve sent a password reset link to:
                </p>
                <p className="text-gold-500 font-medium mb-6">{form.email}</p>

                <div className="bg-navy-900/50 border border-navy-700/50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-navy-400 text-sm">
                    <span className="text-navy-300 font-medium">Didn&apos;t receive it?</span>
                    <br />
                    Check your spam folder, or make sure you used the correct email
                    address. The link expires in 1 hour.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSent(false);
                    setServerError("");
                  }}
                  className="text-gold-500/80 hover:text-gold-400 text-sm transition-colors"
                >
                  Send again
                </button>

                <div className="mt-6 pt-6 border-t border-navy-700/50">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm transition-colors"
                  >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </Link>
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
                    <span className="text-navy-900 font-serif font-bold text-2xl">G</span>
                  </motion.div>

                  <h1 className="text-2xl font-serif font-bold text-white">
                    Reset Password
                  </h1>
                  <p className="text-navy-400 text-sm mt-2">
                    Enter your email and we&apos;ll send you a reset link
                  </p>

                  <div className="h-0.5 w-12 bg-gold-500/50 rounded-full mx-auto mt-4" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
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
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Reset Link
                        <HiOutlinePaperAirplane className="w-4 h-4" />
                      </span>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 pt-6 border-t border-navy-700/50 text-center">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm transition-colors"
                  >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-navy-500 text-xs"
        >
          Grace Missionary Baptist Church &mdash; Admin Panel
        </motion.p>
      </motion.div>
    </div>
  );
}
