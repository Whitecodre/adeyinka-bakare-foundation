"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    level: "",
    session: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/public/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: "success", message: "Thank you for registering! We'll review your application and get back to you." });
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          department: "",
          level: "",
          session: "",
        });
        setTimeout(() => router.push("/"), 3000);
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
    <div className="min-h-screen bg-[#fffdf8] py-12 md:py-20">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
          <div className="mb-8">
            <a
              href="/get-involved"
              className="inline-flex items-center text-[#922821] hover:text-[#aa322b] mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Get Involved
            </a>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2d1816] mb-4 font-['Libre_Baskerville']">
              Become a Member
            </h1>
            <p className="text-lg text-[#2d1816]/70">
              Join our community of IT students and access exclusive benefits and opportunities.
            </p>
          </div>

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
              {/* Full Name */}
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

              {/* Email */}
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

              {/* Phone (WhatsApp) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#2d1816] mb-2">
                  Phone Number (WhatsApp) <span className="text-[#aa322b]">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-[#2d1816] mb-2">
                  Department <span className="text-[#aa322b]">*</span>
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                  placeholder="e.g., Computer Science"
                />
              </div>

              {/* Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-semibold text-[#2d1816] mb-2">
                  Level <span className="text-[#aa322b]">*</span>
                </label>
                <select
                  id="level"
                  name="level"
                  required
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                >
                  <option value="">Select your level</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>

              {/* Session */}
              <div>
                <label htmlFor="session" className="block text-sm font-semibold text-[#2d1816] mb-2">
                  Session <span className="text-[#aa322b]">*</span>
                </label>
                <input
                  type="text"
                  id="session"
                  name="session"
                  required
                  value={formData.session}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#e9ddd3] focus:outline-none focus:ring-2 focus:ring-[#aa322b]/20 focus:border-[#aa322b] transition-all bg-[#fffdf8]"
                  placeholder="e.g., 2024/2025"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#f8c84d] to-[#ffe08a] text-[#2d1816] font-semibold py-4 px-6 rounded-xl hover:from-[#ffe08a] hover:to-[#f8c84d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? "Submitting..." : "Register as Member"}
              </button>
            </div>
          </form>

          <div className="mt-8 bg-[#aa322b]/5 rounded-2xl p-6 border border-[#aa322b]/10">
            <h3 className="text-lg font-semibold text-[#2d1816] mb-3 font-['Libre_Baskerville']">
              Member Benefits
            </h3>
            <ul className="space-y-2 text-[#2d1816]/80">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#aa322b] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access to scholarship programs
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#aa322b] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mentorship from industry professionals
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#aa322b] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Career development and placement support
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#aa322b] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Networking with fellow IT students
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#aa322b] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Exclusive workshops and training sessions
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}
