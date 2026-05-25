"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  HiOutlineBookOpen,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { formatDate, truncate } from "@/lib/utils";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { Sermon } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSermons = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("sermons")
      .select("*")
      .order("date", { ascending: false });
    if (data) setSermons(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const filtered = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.pastor.toLowerCase().includes(search.toLowerCase()) ||
      s.scripture.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("sermons").delete().eq("id", deleteId);
    if (!error) {
      fetchSermons();
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("sermons").update({ is_published: !current }).eq("id", id);
    fetchSermons();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Sermon"
        message="Are you sure you want to delete this sermon? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4"
      >
        <div className="flex items-center gap-3 flex-1">
          <HiOutlineBookOpen className="w-6 h-6 text-gold-500 shrink-0" />
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Sermons
            </h1>
            <p className="text-navy-400 text-sm">
              {sermons.length} total &middot;{" "}
              {sermons.filter((s) => s.is_published).length} published
            </p>
          </div>
        </div>
        <Link
          href="/admin/sermons/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 text-navy-900 rounded-xl text-sm font-medium hover:bg-gold-400 transition-all shrink-0"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Sermon
        </Link>
      </motion.div>

      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, pastor, or scripture..."
          className="w-full pl-10 pr-4 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white text-sm placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60 transition-all"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-700/50">
                <th className="text-left px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                  Pastor
                </th>
                <th className="text-left px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                  Scripture
                </th>
                <th className="text-left px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-navy-400 text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-navy-500">
                    {search
                      ? "No sermons match your search"
                      : "No sermons yet"}
                  </td>
                </tr>
              ) : (
                paginated.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-navy-700/30 hover:bg-navy-700/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="w-10 h-7 rounded object-cover shrink-0"
                          />
                        )}
                        <div>
                          <span className="text-white text-sm font-medium">
                            {item.title}
                          </span>
                          {item.scripture && (
                            <p className="text-navy-500 text-xs mt-0.5">
                              {item.scripture}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-navy-400 text-sm">
                        {item.pastor}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-navy-500 text-sm font-mono">
                        {item.scripture || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-navy-400 text-sm">
                        {item.date ? formatDate(item.date) : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          togglePublished(item.id, item.is_published)
                        }
                        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                          item.is_published
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-navy-700/50 text-navy-500 hover:bg-navy-700"
                        }`}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/sermons/${item.id}/edit`}
                          className="p-2 text-navy-400 hover:text-gold-500 hover:bg-navy-700/50 rounded-lg transition-all"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 text-navy-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-navy-700/50">
            <span className="text-navy-400 text-sm">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-navy-400 hover:text-white hover:bg-navy-700/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm transition-all ${
                    p === page
                      ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                      : "text-navy-400 hover:text-white hover:bg-navy-700/50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-navy-400 hover:text-white hover:bg-navy-700/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
