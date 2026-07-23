"use client";

import { useState } from "react";
import { Send, ChevronDown } from "lucide-react";
import type { ContactFormData } from "@/lib/contact";

type ContactFormProps = {
  services: string[];
};

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const initialState: FormState = {
  full_name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export default function ContactForm({ services }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const payload: ContactFormData = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      service: form.service || undefined,
      message: form.message.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to send message.");
      }

      setStatus("success");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message.");
    }
  };

  return (
    <div
      id="contact-form"
      className="scroll-mt-28 lg:scroll-mt-32 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.06)] px-6 py-7 md:px-8 md:py-8"
    >
      <h2 className="text-2xl md:text-[28px] font-bold text-[#1E293B] mb-2 font-heading">
        Request a Free Quote
      </h2>
      <p className="text-[#64748B] text-sm md:text-[15px] leading-relaxed mb-6">
        Fill in the form and we&apos;ll get back to you within 2 hours during business hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-sm font-semibold text-[#1E293B] mb-2 block">
              Full Name <span className="text-[#2563EB]">*</span>
            </span>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(event) => updateField("full_name", event.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1E293B] mb-2 block">
              Email Address <span className="text-[#2563EB]">*</span>
            </span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-sm font-semibold text-[#1E293B] mb-2 block">Phone Number</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+44 7700 000000"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1E293B] mb-2 block">Service Required</span>
            <div className="relative">
              <select
                value={form.service}
                onChange={(event) => updateField("service", event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-white"
              >
                <option value="">Select a service...</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                aria-hidden="true"
              />
            </div>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-[#1E293B] mb-2 block">Message</span>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Tell us about your requirements..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-y min-h-[140px]"
          />
        </label>

        {status === "success" && (
          <p className="text-sm font-medium text-green-600">
            Thank you. Your message has been sent successfully.
          </p>
        )}

        {status === "error" && errorMessage && (
          <p className="text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3.5 text-sm md:text-[15px] font-bold text-white transition-colors hover:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
