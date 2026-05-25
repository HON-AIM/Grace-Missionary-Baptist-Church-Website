"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { eventSchema, EventInput } from "@/lib/validations";
import FormField from "@/components/admin/FormField";
import FileUpload from "@/components/FileUpload";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState<EventInput>({
    title: "",
    description: "",
    flyer: null,
    date: new Date().toISOString().split("T")[0],
    time: "",
    location: "",
    is_published: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = eventSchema.safeParse(form);
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
    const { error } = await supabase.from("events").insert([form]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/events");
    router.refresh();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-serif font-bold text-white">New Event</h1>
        <p className="text-navy-400 text-sm">Create a new church event</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-navy-800 border border-navy-700/50 rounded-xl p-6 space-y-5"
      >
          <FormField label="Event Title" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="Event title"
            />
          </FormField>

        <FormField label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
            placeholder="Event description"
          />
        </FormField>

        <FormField label="Event Flyer" error={errors.flyer}>
          <FileUpload
            folder="events"
            onUpload={(url) => setForm({ ...form, flyer: url })}
            onDelete={() => setForm({ ...form, flyer: null })}
            existingUrl={form.flyer}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Event Date" error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
          </FormField>

          <FormField label="Event Time">
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
          </FormField>

          <FormField label="Location">
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="Event location"
            />
          </FormField>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-gold-500 focus:ring-gold-500/50"
          />
          <span className="text-sm text-navy-300">Publish immediately</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gold-500 text-navy-900 rounded-lg font-medium hover:bg-gold-400 disabled:opacity-50 transition-all"
          >
            {loading ? "Saving..." : "Save Event"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="px-6 py-2.5 text-navy-400 hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}
