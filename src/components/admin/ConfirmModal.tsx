"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineExclamationCircle, HiOutlineX } from "react-icons/hi";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const confirmStyles =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-400 text-white"
      : "bg-gold-500 hover:bg-gold-400 text-navy-900";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-navy-800 border border-navy-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-navy-500 hover:text-navy-300 transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  variant === "danger"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-gold-500/10 text-gold-500"
                }`}
              >
                <HiOutlineExclamationCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-navy-400 text-sm mt-1">{message}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-navy-700/50">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-navy-400 hover:text-white border border-navy-700 rounded-lg text-sm font-medium hover:bg-navy-700/50 transition-all disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${confirmStyles}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
