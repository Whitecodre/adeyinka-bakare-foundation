"use client";

import { useState } from "react";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { Section, SectionHeading } from "@/components/public/section";
import { CTABanner } from "@/components/public/cta-banner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    skills: "",
    intentions: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: "success", message: "Thank you for reaching out! We'll get back to you soon." });
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          subject: "",
          skills: "",
          intentions: "",
          message: "",
        });
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Get in Touch"
        description="Have questions or want to get involved? We'd love to hear from you."
      />

      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          <Reveal className="lg:col-span-2">
            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-xl ${
                  submitStatus.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-[#e9ddd3]">
              <div className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold text-[#2d1816] mb-2">
                    Full Name <span className="text-[#aa322b]">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#2d1816] mb-2">
                    Email Address <span className="text-[#aa322b]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#2d1816] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#2d1816] mb-2">
                    Subject <span className="text-[#aa322b]">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="membership">Membership Information</option>
                    <option value="volunteer">Volunteer Opportunities</option>
                    <option value="scholarship">Scholarship Information</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-semibold text-[#2d1816] mb-2">
                    Your Skills
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    rows={3}
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8] resize-none"
                    placeholder="Tell us about your skills (e.g., programming, design, writing, project management...)"
                  />
                </div>

                <div>
                  <label htmlFor="intentions" className="block text-sm font-semibold text-[#2d1816] mb-2">
                    What do you hope to achieve by joining ABF?
                  </label>
                  <textarea
                    id="intentions"
                    name="intentions"
                    rows={3}
                    value={formData.intentions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8] resize-none"
                    placeholder="Share your goals and what you hope to gain from being part of the fellowship..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#2d1816] mb-2">
                    Your Message <span className="text-[#aa322b]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8] resize-none"
                    placeholder="How can we help you?..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#aa322b] to-[#922821] text-white font-semibold py-4 px-6 rounded-xl hover:from-[#922821] hover:to-[#7a221b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal direction="right" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ddd3]">
              <h3 className="text-lg font-bold text-[#2d1816] mb-4 font-['Libre_Baskerville']">
                Quick Contact
              </h3>
              <div className="space-y-3 text-sm text-[#2d1816]/70">
                <p>
                  <span className="font-semibold text-[#2d1816]">Email:</span> info@abf.org
                </p>
                <p>
                  <span className="font-semibold text-[#2d1816]">Phone:</span> +234 XXX XXX XXXX
                </p>
                <p>
                  <span className="font-semibold text-[#2d1816]">Location:</span> Department of Information Technology, University of Ilorin
                </p>
              </div>
            </div>

            <div className="bg-[#aa322b]/5 rounded-2xl p-6 border border-[#aa322b]/10">
              <h3 className="text-lg font-bold text-[#2d1816] mb-4 font-['Libre_Baskerville']">
                Response Time
              </h3>
              <p className="text-sm text-[#2d1816]/70">
                We typically respond to inquiries within 24-48 hours. For urgent matters, please include "URGENT" in your subject line.
              </p>
            </div>

            <div className="bg-[#f8c84d]/10 rounded-2xl p-6 border border-[#f8c84d]/20">
              <h3 className="text-lg font-bold text-[#2d1816] mb-4 font-['Libre_Baskerville']">
                Want to Join ABF?
              </h3>
              <p className="text-sm text-[#2d1816]/70 mb-4">
                Become part of our community and access scholarship opportunities, mentorship programmes, and career development resources.
              </p>
              <a
                href="/get-involved"
                className="inline-flex items-center px-4 py-2 bg-[#f8c84d] text-[#2d1816] font-semibold rounded-xl hover:bg-[#ffe08a] transition-colors"
              >
                Get Involved
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      <CTABanner
        title="Ready to join ABF?"
        description="Become part of a fellowship that supports students to achieve their academic and career goals."
        primary={{ label: "Join the Fellowship", href: "/get-involved" }}
        secondary={{ label: "View Programmes", href: "/programmes" }}
      />
    </>
  );
}
