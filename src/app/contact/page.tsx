"use client";

import { useState, type FormEvent, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaHeart,
  FaPaperPlane,
  FaCheck,
  FaPray,
  FaChurch,
  FaHandHoldingHeart,
} from "react-icons/fa";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

type FormStatus = "idle" | "submitting" | "success" | "error";
type FormType = "contact" | "prayer";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialForm: FormState = { name: "", email: "", phone: "", message: "" };

function sanitize(v: string): string {
  return v.replace(/[<>]/g, "").replace(/[\\{}[\]()]/g, "").trim().slice(0, 5000);
}

export default function ContactPage() {
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");
  const [prayerStatus, setPrayerStatus] = useState<FormStatus>("idle");
  const [contactForm, setContactForm] = useState<FormState>(initialForm);
  const [prayerForm, setPrayerForm] = useState<FormState>({ ...initialForm, name: "Prayer Request" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prayerErrors, setPrayerErrors] = useState<Record<string, string>>({});
  const contactRef = useRef<HTMLDivElement>(null);
  const prayerRef = useRef<HTMLDivElement>(null);

  const validate = (data: FormState, type: FormType) => {
    const errs: Record<string, string> = {};
    const name = sanitize(data.name);
    if (!name || name.length < 2) errs.name = "Name is required";
    const email = sanitize(data.email);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Valid email is required";
    if (type === "contact" && (!sanitize(data.message) || sanitize(data.message).length < 10))
      errs.message = "Message must be at least 10 characters";
    if (type === "prayer" && (!sanitize(data.message) || sanitize(data.message).length < 5))
      errs.message = "Please share your prayer request";
    return errs;
  };

  const handleSubmit = async (
    e: FormEvent,
    type: FormType,
    form: FormState,
    setStatus: (s: FormStatus) => void,
    setForm: (f: FormState) => void,
    setErrs: (e: Record<string, string>) => void
  ) => {
    e.preventDefault();
    const v = validate(form, type);
    setErrs(v);
    if (Object.keys(v).length > 0) return;

    setStatus("submitting");
    try {
      let token = "";
      try {
        const grecaptcha = (window as any).grecaptcha;
        if (grecaptcha?.execute) {
          token = await grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            { action: type === "contact" ? "contact_form" : "prayer_request" }
          );
        }
      } catch {}

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: sanitize(form.name),
          email: sanitize(form.email),
          phone: sanitize(form.phone),
          message: sanitize(form.message),
          recaptchaToken: token,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Header />
      <main>
        {/* ===== HERO BANNER ===== */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-navy-900">
          <div className="absolute inset-0">
            <img
              src="/images/GMBC_logo.jpg"
              alt=""
              className="h-full w-full object-cover opacity-10 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/70 to-navy-900" />
          </div>
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gold-500/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 mb-6">
                Get in Touch
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                We&apos;d Love to
                <br />
                <span className="text-gold-400">Hear From You</span>
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
                Whether you have a question, need prayer, or want to know more about GMBC &mdash; we&apos;re here.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== MAIN CONTACT SECTION ===== */}
        <SectionWrapper className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
              {/* ---- CONTACT FORM ---- */}
              <div className="lg:col-span-3" ref={contactRef}>
                <motion.div {...fadeUp}>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Send a Message
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800 mt-3">
                    Contact Us
                  </h2>
                  <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                  <p className="mt-4 text-base text-navy-500 max-w-xl">
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                  </p>
                </motion.div>

                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-8 rounded-2xl border border-navy-100/50 bg-white p-6 md:p-8 shadow-lg"
                >
                  {contactStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <FaCheck className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 font-serif text-xl font-bold text-navy-800">Message Sent!</h3>
                      <p className="mt-2 text-sm text-navy-500">
                        Thank you for reaching out. We&apos;ll respond shortly.
                      </p>
                      <button
                        onClick={() => { setContactStatus("idle"); setContactForm(initialForm); setErrors({}); }}
                        className="mt-6 rounded-full bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gold-500 hover:text-navy-900"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={(e) => handleSubmit(e, "contact", contactForm, setContactStatus, setContactForm, setErrors)}
                      noValidate
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          id="contact-name"
                          label="Full Name *"
                          value={contactForm.name}
                          error={errors.name}
                          placeholder="Your name"
                          onChange={(v) => { setContactForm((p) => ({ ...p, name: v })); setErrors((p) => ({ ...p, name: "" })); }}
                        />
                        <FormField
                          id="contact-email"
                          label="Email Address *"
                          type="email"
                          value={contactForm.email}
                          error={errors.email}
                          placeholder="your@email.com"
                          onChange={(v) => { setContactForm((p) => ({ ...p, email: v })); setErrors((p) => ({ ...p, email: "" })); }}
                        />
                      </div>
                      <FormField
                        id="contact-phone"
                        label="Phone Number"
                        type="tel"
                        value={contactForm.phone}
                        placeholder="+234 800 000 0000"
                        onChange={(v) => setContactForm((p) => ({ ...p, phone: v }))}
                      />
                      <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-navy-700 mb-1.5">
                          Message *
                        </label>
                        <textarea
                          id="contact-message"
                          rows={5}
                          value={contactForm.message}
                          onChange={(e) => { setContactForm((p) => ({ ...p, message: e.target.value })); setErrors((p) => ({ ...p, message: "" })); }}
                          className={`w-full rounded-xl border ${errors.message ? "border-red-400" : "border-navy-200"} bg-cream px-4 py-3 text-sm text-navy-800 placeholder-navy-400 transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-200 focus:outline-none resize-none`}
                          placeholder="Write your message here..."
                        />
                        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                      </div>
                      <SubmitButton status={contactStatus} label="Send Message" icon={<FaPaperPlane className="h-4 w-4" />} />
                      {contactStatus === "error" && (
                        <p className="text-center text-sm text-red-500">Something went wrong. Please try again.</p>
                      )}
                    </form>
                  )}
                </motion.div>
              </div>

              {/* ---- SIDEBAR ---- */}
              <aside className="lg:col-span-2 space-y-6">
                {/* Church Info */}
                <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-2xl border border-navy-100/50 bg-white p-6 shadow-lg">
                  <h3 className="font-serif text-xl font-bold text-navy-800 mb-6 flex items-center gap-2">
                    <FaChurch className="h-5 w-5 text-gold-500" />
                    Church Information
                  </h3>
                  <div className="space-y-5">
                    {[
                      { icon: FaMapMarkerAlt, label: "Address", value: "Grace Missionary Baptist Church" },
                      { icon: FaPhone, label: "Phone", value: "+234 (0) 123 456 7890" },
                      { icon: FaEnvelope, label: "Email", value: "info@gmbc.org" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</p>
                          <p className="text-sm font-medium text-navy-700">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Service Times */}
                <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-2xl border border-navy-100/50 bg-white p-6 shadow-lg">
                  <h3 className="font-serif text-xl font-bold text-navy-800 mb-6 flex items-center gap-2">
                    <FaClock className="h-5 w-5 text-gold-500" />
                    Service Times
                  </h3>
                  <div className="space-y-4">
                    {[
                      { day: "Sunday School", time: "8:00 AM – 9:00 AM" },
                      { day: "Sunday Service", time: "9:00 AM – 11:30 AM" },
                      { day: "Wed. Midweek Prayer", time: "5:30 PM – 7:00 PM" },
                      { day: "Thursday Bible Study", time: "5:00 PM – 7:00 PM" },
                      { day: "Monthly Vigil", time: "Last Friday — 12 Midnight" },
                    ].map((s) => (
                      <div key={s.day} className="border-l-2 border-gold-400 pl-3">
                        <p className="text-sm font-medium text-navy-800">{s.day}</p>
                        <p className="text-xs font-semibold text-gold-600">{s.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Bank Details */}
                <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }} className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
                      <FaHandHoldingHeart className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">Give &amp; Support</h3>
                  </div>
                  <p className="text-sm text-white/60 mb-4">
                    Support the ministry through your generous giving.
                  </p>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:bg-white/[0.06]">
                      <p className="text-xs font-medium uppercase tracking-wider text-gold-400/70">Bank</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">Polaris Bank</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:bg-white/[0.06]">
                      <p className="text-xs font-medium uppercase tracking-wider text-gold-400/70">Account Number</p>
                      <p className="mt-0.5 text-base font-bold tracking-wider text-white font-mono">1140235436</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:bg-white/[0.06]">
                      <p className="text-xs font-medium uppercase tracking-wider text-gold-400/70">Account Name</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">Association of Grace Missionary Baptist</p>
                    </div>
                  </div>
                </motion.div>
              </aside>
            </div>
          </div>
        </SectionWrapper>

        {/* ===== PRAYER REQUEST SECTION ===== */}
        <SectionWrapper className="py-20 md:py-28 bg-cream" id="prayer">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Prayer
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3 leading-tight">
                  Share a
                  <br />
                  <span className="text-gold-600">Prayer Request</span>
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-6 text-base leading-relaxed text-navy-600">
                  We believe in the power of prayer. Share your prayer request with
                  us, and our prayer team will stand with you in faith.
                </p>
                <div className="mt-6 flex items-center gap-4 rounded-xl bg-gold-50 border border-gold-200/50 p-4">
                  <FaPray className="h-6 w-6 text-gold-600 shrink-0" />
                  <p className="text-sm text-navy-600 italic">
                    &ldquo;The effectual fervent prayer of a righteous man availeth much.&rdquo;
                    <span className="block text-xs text-gold-600 mt-0.5">James 5:16 (KJV)</span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                ref={prayerRef}
              >
                <div className="rounded-2xl border border-navy-100/50 bg-white p-6 md:p-8 shadow-lg">
                  {prayerStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                        <FaPray className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 font-serif text-xl font-bold text-navy-800">Prayer Received</h3>
                      <p className="mt-2 text-sm text-navy-500">
                        Thank you for trusting us with your prayer request. We will pray with you.
                      </p>
                      <button
                        onClick={() => { setPrayerStatus("idle"); setPrayerForm(initialForm); setPrayerErrors({}); }}
                        className="mt-6 rounded-full bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gold-500 hover:text-navy-900"
                      >
                        Submit Another Request
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={(e) => handleSubmit(e, "prayer", prayerForm, setPrayerStatus, setPrayerForm, setPrayerErrors)}
                      noValidate
                      className="space-y-5"
                    >
                      <h3 className="font-serif text-xl font-bold text-navy-800 flex items-center gap-2">
                        <FaPray className="h-5 w-5 text-gold-500" />
                        Prayer Request Form
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          id="prayer-name"
                          label="Your Name *"
                          value={prayerForm.name}
                          error={prayerErrors.name}
                          placeholder="Your name"
                          onChange={(v) => { setPrayerForm((p) => ({ ...p, name: v })); setPrayerErrors((p) => ({ ...p, name: "" })); }}
                        />
                        <FormField
                          id="prayer-email"
                          label="Email Address *"
                          type="email"
                          value={prayerForm.email}
                          error={prayerErrors.email}
                          placeholder="your@email.com"
                          onChange={(v) => { setPrayerForm((p) => ({ ...p, email: v })); setPrayerErrors((p) => ({ ...p, email: "" })); }}
                        />
                      </div>
                      <FormField
                        id="prayer-phone"
                        label="Phone Number"
                        type="tel"
                        value={prayerForm.phone}
                        placeholder="+234 800 000 0000"
                        onChange={(v) => setPrayerForm((p) => ({ ...p, phone: v }))}
                      />
                      <div>
                        <label htmlFor="prayer-message" className="block text-sm font-medium text-navy-700 mb-1.5">
                          Prayer Request *
                        </label>
                        <textarea
                          id="prayer-message"
                          rows={4}
                          value={prayerForm.message}
                          onChange={(e) => { setPrayerForm((p) => ({ ...p, message: e.target.value })); setPrayerErrors((p) => ({ ...p, message: "" })); }}
                          className={`w-full rounded-xl border ${prayerErrors.message ? "border-red-400" : "border-navy-200"} bg-cream px-4 py-3 text-sm text-navy-800 placeholder-navy-400 transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-200 focus:outline-none resize-none`}
                          placeholder="Share your prayer request..."
                        />
                        {prayerErrors.message && <p className="mt-1 text-xs text-red-500">{prayerErrors.message}</p>}
                      </div>
                      <SubmitButton status={prayerStatus} label="Submit Prayer Request" icon={<FaPray className="h-4 w-4" />} />
                      {prayerStatus === "error" && (
                        <p className="text-center text-sm text-red-500">Something went wrong. Please try again.</p>
                      )}
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* ===== GOOGLE MAP PLACEHOLDER ===== */}
        <SectionWrapper className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Find Us
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                  Visit Our Church
                </h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-4 text-base text-navy-500 max-w-xl mx-auto">
                  We would be honored to have you worship with us.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="relative w-full h-[380px] md:h-[450px] bg-navy-50 flex items-center justify-center">
                <img
                  src="/images/GMBC_logo.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-10"
                />
                <div className="relative z-10 text-center px-6">
                  <FaMapMarkerAlt className="mx-auto h-10 w-10 text-gold-500 mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-navy-800">Grace Missionary Baptist Church</h3>
                  <p className="mt-2 text-navy-500">[Church Location Address]</p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-all hover:bg-gold-400 hover:shadow-lg"
                    >
                      <FaMapMarkerAlt className="h-4 w-4" />
                      Open in Google Maps
                    </a>
                  </div>
                  <p className="mt-4 text-xs text-navy-400">
                    Google Maps integration coming soon &mdash; configure your API key in the dashboard.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ===== CLOSING CTA ===== */}
        <SectionWrapper className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-500" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <motion.div {...fadeUp}>
              <FaHeart className="mx-auto h-8 w-8 text-navy-900/40" />
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold text-navy-900">
                We Look Forward to Meeting You
              </h2>
              <p className="mt-3 text-navy-800/80 max-w-xl mx-auto">
                Come and experience the love, joy, and peace of worshipping together at GMBC.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#prayer"
                  className="rounded-full bg-navy-900 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-navy-900"
                >
                  Submit Prayer Request
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="rounded-full border-2 border-navy-900/30 bg-white/20 px-8 py-3.5 font-semibold text-navy-900 backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
                >
                  Back to Top
                </a>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

/* ---- Reusable form field ---- */
function FormField({
  id,
  label,
  type = "text",
  value,
  error,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy-700 mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border ${error ? "border-red-400" : "border-navy-200"} bg-cream px-4 py-3 text-sm text-navy-800 placeholder-navy-400 transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-200 focus:outline-none resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border ${error ? "border-red-400" : "border-navy-200"} bg-cream px-4 py-3 text-sm text-navy-800 placeholder-navy-400 transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-200 focus:outline-none`}
          placeholder={placeholder}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ---- Reusable submit button ---- */
function SubmitButton({ status, label, icon }: { status: FormStatus; label: string; icon: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={status === "submitting"}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-gold-500 hover:text-navy-900 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {status === "submitting" ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
          </svg>
          Sending...
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}
