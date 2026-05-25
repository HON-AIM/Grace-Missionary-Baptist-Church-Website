"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { sermonSchema, SermonInput } from "@/lib/validations";
import FormField from "@/components/admin/FormField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUpload from "@/components/FileUpload";

export default function NewSermonPage() {
  const router = useRouter();
  const [form, setForm] = useState<SermonInput>({
    title: "",
    pastor: "",
    scripture: "",
    youtube_url: "",
    description: "",
    thumbnail: null,
    date: new Date().toISOString().split("T")[0],
    is_published: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = sermonSchema.safeParse(form);
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
    const { error } = await supabase.from("sermons").insert([form]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/sermons");
    router.refresh();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-serif font-bold text-white">
          New Sermon
        </h1>
        <p className="text-navy-400 text-sm">Add a new sermon message</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-navy-800 border border-navy-700/50 rounded-xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Sermon Title" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="Sermon title"
            />
          </FormField>

          <FormField label="Pastor Name" error={errors.pastor}>
            <input
              type="text"
              value={form.pastor}
              onChange={(e) => setForm({ ...form, pastor: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="Pastor name"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Scripture Reference">
            <input
              type="text"
              value={form.scripture}
              onChange={(e) => setForm({ ...form, scripture: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="e.g. John 3:16"
            />
          </FormField>

          <FormField label="YouTube URL">
            <input
              type="url"
              value={form.youtube_url}
              onChange={(e) =>
                setForm({ ...form, youtube_url: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="https://youtube.com/watch?v=..."
            />
          </FormField>
        </div>

        <FormField label="Description">
          <RichTextEditor
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
            placeholder="Sermon description and summary..."
          />
        </FormField>

        <FormField label="Thumbnail Image" error={errors.thumbnail}>
          <FileUpload
            folder="sermons"
            onUpload={(url) => setForm({ ...form, thumbnail: url })}
            onDelete={() => setForm({ ...form, thumbnail: null })}
            existingUrl={form.thumbnail}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date" error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
          </FormField>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
              setForm({ ...form, is_published: e.target.checked })
            }
            className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-gold-500 focus:ring-gold-500/50"
          />
          <span className="text-sm text-navy-300">Publish immediately</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || errors.thumbnail != null}
            className="px-6 py-2.5 bg-gold-500 text-navy-900 rounded-lg font-medium hover:bg-gold-400 disabled:opacity-50 transition-all"
          >
            {loading ? "Saving..." : "Save Sermon"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/sermons")}
            className="px-6 py-2.5 text-navy-400 hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}
