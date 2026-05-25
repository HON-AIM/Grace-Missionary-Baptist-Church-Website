"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineTemplate,
  HiOutlineCheckCircle,
  HiOutlineEye,
} from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { homepageSettingsSchema } from "@/lib/validations";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { HomepageSettings } from "@/lib/types";

const DEFAULT_SETTINGS = {
  hero_title: "",
  hero_subtitle: "",
  weekly_scripture: "",
  weekly_scripture_ref: "",
  pastor_message: "",
  announcement_banner: "",
  announcement_banner_active: false,
};

export default function HomepageSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSettings = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("homepage_settings")
      .select("*")
      .limit(1)
      .single();
    if (data) {
      setSettings({
        hero_title: data.hero_title || "",
        hero_subtitle: data.hero_subtitle || "",
        weekly_scripture: data.weekly_scripture || "",
        weekly_scripture_ref: data.weekly_scripture_ref || "",
        pastor_message: data.pastor_message || "",
        announcement_banner: data.announcement_banner || "",
        announcement_banner_active: data.announcement_banner_active ?? false,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (vals: typeof settings) => {
    setSaving(true);
    const supabase = createClient();
    const { data: existing } = await supabase
      .from("homepage_settings")
      .select("id")
      .limit(1)
      .single();

    if (existing) {
      await supabase.from("homepage_settings").update(vals).eq("id", existing.id);
    } else {
      await supabase.from("homepage_settings").insert([vals]);
    }

    setSaving(false);
    setDirty(false);
    setLastSaved(new Date());
  };

  const updateField = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const next = { ...settings, [key]: value };
      saveSettings(next);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleManualSave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    saveSettings(settings);
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4"
      >
        <div className="flex items-center gap-3 flex-1">
          <HiOutlineTemplate className="w-6 h-6 text-gold-500 shrink-0" />
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Homepage Settings
            </h1>
            <p className="text-navy-400 text-sm">
              Manage homepage content dynamically
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-xs text-gold-400 font-medium animate-pulse">
              Unsaved changes
            </span>
          )}
          {lastSaved && !dirty && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <HiOutlineCheckCircle className="w-3.5 h-3.5" />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleManualSave}
            disabled={saving || !dirty}
            className="px-5 py-2 bg-gold-500 text-navy-900 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <SettingsCard
          label="Hero Section"
          hint="Main headline and subtitle shown at the top of the homepage"
          delay={0}
        >
          <FormField label="Hero Title">
            <input
              type="text"
              value={settings.hero_title}
              onChange={(e) => updateField("hero_title", e.target.value)}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="Embracing Faith, Compassion & Togetherness"
            />
          </FormField>
          <FormField label="Hero Subtitle">
            <textarea
              value={settings.hero_subtitle}
              onChange={(e) => updateField("hero_subtitle", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
              placeholder="A fellowship-driven church focused on worship, prayer, biblical teaching, and community impact."
            />
          </FormField>
        </SettingsCard>

        <PreviewCard label="Hero Preview" delay={0.05}>
          <div className="bg-navy-900 rounded-lg p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-gold-400/70 mb-2">
              Welcome to Grace Missionary Baptist Church
            </p>
            <p className="font-serif text-sm font-bold text-white leading-tight">
              {settings.hero_title || "Your hero title here"}
            </p>
            <p className="text-[10px] text-white/60 mt-1 line-clamp-2">
              {settings.hero_subtitle || "Your hero subtitle here"}
            </p>
          </div>
        </PreviewCard>

        {/* Weekly Scripture */}
        <SettingsCard
          label="Weekly Scripture"
          hint="Featured Bible verse displayed as a banner on the homepage"
          delay={0.1}
        >
          <FormField label="Scripture Text">
            <textarea
              value={settings.weekly_scripture}
              onChange={(e) => updateField("weekly_scripture", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
              placeholder="Go ye therefore, and teach all nations..."
            />
          </FormField>
          <FormField label="Scripture Reference">
            <input
              type="text"
              value={settings.weekly_scripture_ref}
              onChange={(e) => updateField("weekly_scripture_ref", e.target.value)}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              placeholder="Matthew 28:19-20 (KJV)"
            />
          </FormField>
        </SettingsCard>

        <PreviewCard label="Scripture Preview" delay={0.15}>
          <div className="bg-navy-900 rounded-lg p-4 text-center">
            <span className="font-serif text-3xl text-gold-500/20 leading-none block -mb-4">
              &ldquo;
            </span>
            <p className="font-serif text-xs italic text-white/80 leading-relaxed px-2">
              {settings.weekly_scripture || "Your weekly scripture text here"}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              <p className="text-[10px] font-semibold text-gold-300">
                {settings.weekly_scripture_ref || "Reference"}
              </p>
            </div>
          </div>
        </PreviewCard>

        {/* Pastor Message */}
        <SettingsCard
          label="Pastor's Welcome"
          hint="Welcome message from the pastor shown on the homepage"
          delay={0.2}
        >
          <FormField label="Message">
            <RichTextEditor
              value={settings.pastor_message}
              onChange={(value) => updateField("pastor_message", value)}
              placeholder="Write the pastor's welcome message..."
              minRows={6}
            />
          </FormField>
        </SettingsCard>

        <PreviewCard label="Pastor Message Preview" delay={0.25}>
          <div className="bg-gradient-to-br from-cream to-white rounded-lg p-4 border border-navy-100/50">
            <p className="text-[10px] uppercase tracking-wider text-gold-600 font-semibold mb-1">
              Pastor&apos;s Welcome
            </p>
            <p className="font-serif text-xs font-bold text-navy-800">
              A Warm Welcome to You
            </p>
            <div className="mt-2 text-[10px] text-navy-500 leading-relaxed line-clamp-4">
              {settings.pastor_message
                ? settings.pastor_message.replace(/[*_~`]/g, "")
                : "Your pastor's welcome message here..."}
            </div>
          </div>
        </PreviewCard>

        {/* Announcement Banner */}
        <SettingsCard
          label="Announcement Banner"
          hint="A prominent announcement bar shown at the top of the homepage"
          delay={0.3}
        >
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={settings.announcement_banner_active}
              onChange={(e) =>
                updateField("announcement_banner_active", e.target.checked)
              }
              className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-gold-500 focus:ring-gold-500/50"
            />
            <span className="text-sm text-navy-300">Show banner on homepage</span>
          </label>
          <FormField label="Banner Text">
            <textarea
              value={settings.announcement_banner}
              onChange={(e) =>
                updateField("announcement_banner", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
              placeholder="Join us this Sunday for our special worship service!"
            />
          </FormField>
        </SettingsCard>

        <PreviewCard label="Banner Preview" delay={0.35}>
          <div
            className={`rounded-lg p-3 text-center ${
              settings.announcement_banner_active
                ? "bg-gold-500"
                : "bg-navy-700/50"
            }`}
          >
            <p
              className={`text-xs font-medium ${
                settings.announcement_banner_active
                  ? "text-navy-900"
                  : "text-navy-500"
              }`}
            >
              {settings.announcement_banner_active
                ? settings.announcement_banner || "Banner is active but empty"
                : "Banner is hidden"}
            </p>
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

function SettingsCard({
  label,
  hint,
  delay,
  children,
}: {
  label: string;
  hint: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 space-y-4"
    >
      <div>
        <h3 className="text-base font-semibold text-white">{label}</h3>
        <p className="text-navy-500 text-xs mt-0.5">{hint}</p>
      </div>
      {children}
    </motion.div>
  );
}

function PreviewCard({
  label,
  delay,
  children,
}: {
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-navy-800/50 border border-navy-700/30 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineEye className="w-3.5 h-3.5 text-navy-500" />
        <p className="text-xs font-medium text-navy-500 uppercase tracking-wider">
          {label}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-navy-300">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
