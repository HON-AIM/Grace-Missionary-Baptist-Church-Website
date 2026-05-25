"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { announcementSchema, AnnouncementInput } from "@/lib/validations";
import FormField from "@/components/admin/FormField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUpload from "@/components/FileUpload";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [form, setForm] = useState<AnnouncementInput>({
    title: "",
    content: "",
    category: "General",
    date: new Date().toISOString().split("T")[0],
    image: null,
    is_pinned: false,
    is_published: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = announcementSchema.safeParse(form);
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
    const { error } = await supabase.from("announcements").insert([form]);

    if (error) {
      setErrors((prev) => ({ ...prev, form: error.message }));
      setLoading(false);
      return;
    }

    router.push("/admin/announcements");
    router.refresh();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-serif font-bold text-white">New Announcement</h1>
        <p className="text-navy-400 text-sm">Create a new church announcement</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-navy-800 border border-navy-700/50 rounded-xl p-6 lg:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField label="Title" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="Announcement title"
            />
          </FormField>

          <FormField label="Category" error={errors.category}>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            >
              <option value="General">General</option>
              <option value="Ministry">Ministry</option>
              <option value="Event">Event</option>
              <option value="Prayer">Prayer</option>
              <option value="Urgent">Urgent</option>
            </select>
          </FormField>
        </div>

        <div>
          <FormField label="Content" error={errors.content}>
            <RichTextEditor
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
              placeholder="Write your announcement content here..."
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField label="Date" error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
          </FormField>

          <FormField label="Featured Image" error={errors.image}>
            <FileUpload
              folder="announcements"
              onUpload={(url) => setForm({ ...form, image: url })}
              onDelete={() => setForm({ ...form, image: null })}
              existingUrl={form.image}
            />
          </FormField>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_pinned}
              onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
              className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-gold-500 focus:ring-gold-500/50"
            />
            <span className="text-sm text-navy-300">Pin announcement</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-gold-500 focus:ring-gold-500/50"
            />
            <span className="text-sm text-navy-300">Publish immediately</span>
          </label>
        </div>

        {errors.form && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {errors.form}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gold-500 text-navy-900 rounded-lg font-medium hover:bg-gold-400 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Announcement"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/announcements")}
            className="px-6 py-2.5 text-navy-400 hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}
