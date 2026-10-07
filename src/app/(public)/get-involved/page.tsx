import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Involved | Adeyinka Bakare Fellowship",
  description: "Join the Adeyinka Bakare Fellowship as a volunteer or member",
};

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen bg-[#fffdf8]">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#aa322b]/10 text-[#922821] text-sm font-semibold rounded-full mb-4">
              Get Involved
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2d1816] mb-4 font-['Libre_Baskerville']">
              Join the Fellowship
            </h1>
            <p className="text-lg text-[#2d1816]/70 max-w-2xl mx-auto">
              Become part of our community and help empower IT students at the University of Ilorin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Volunteer Card */}
            <a
              href="/get-involved/volunteer"
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e9ddd3] hover:border-[#aa322b]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#aa322b]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-[#aa322b]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#aa322b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#2d1816] mb-3 font-['Libre_Baskerville']">
                  Volunteer
                </h2>
                <p className="text-[#2d1816]/70 mb-4">
                  Share your time and skills to support our mission and help students succeed.
                </p>
                <div className="flex items-center text-[#aa322b] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Apply as Volunteer
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Member Card */}
            <a
              href="/get-involved/member"
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e9ddd3] hover:border-[#f8c84d]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f8c84d]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-[#f8c84d]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#f8c84d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#2d1816] mb-3 font-['Libre_Baskerville']">
                  Become a Member
                </h2>
                <p className="text-[#2d1816]/70 mb-4">
                  Join our community of IT students and access exclusive benefits and opportunities.
                </p>
                <div className="flex items-center text-[#f8c84d] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Apply as Member
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e9ddd3]">
            <h3 className="text-xl font-bold text-[#2d1816] mb-4 font-['Libre_Baskerville']">
              Why Join ABF?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#aa322b] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#2d1816]/80">Access to scholarship opportunities</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#aa322b] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#2d1816]/80">Mentorship from industry professionals</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#aa322b] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#2d1816]/80">Career development and placement support</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#aa322b] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#2d1816]/80">Networking with fellow IT students</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#aa322b] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#2d1816]/80">Skill building workshops and training</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}
