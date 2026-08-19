import {
  FileCheck,
  UserCheck,
  UserRound,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Copyright,
  HeartPulse,
  Ban,
  Scale,
  RefreshCw,
  Mail,
} from "lucide-react";

const TermsNConditions = () => {
  const sections = [
    {
      number: "01",
      title: "Acceptance of Terms",
      icon: FileCheck,
      content: [
        "By accessing or using PressureGuard Care, you agree to comply with these Terms and Conditions.",
      ],
    },
    {
      number: "02",
      title: "Eligibility",
      icon: UserCheck,
      content: [
        "You must be legally eligible to use this platform according to the laws applicable in your country.",
      ],
    },
    {
      number: "03",
      title: "User Accounts",
      icon: UserRound,
      content: [
        "You are responsible for maintaining the confidentiality of your account and authentication credentials.",
      ],
    },
    {
      number: "04",
      title: "User Responsibilities",
      icon: ShieldCheck,
      content: ["Users agree to use PressureGuard Care responsibly."],
      list: [
        "Provide accurate information",
        "Respect therapists",
        "Respect other users",
        "Do not abuse the platform",
        "Do not upload harmful content",
        "Do not violate applicable laws",
      ],
    },
    {
      number: "05",
      title: "Therapy Sessions",
      icon: CalendarCheck,
      content: [
        "Appointments are subject to therapist availability.",
        "Cancellation and rescheduling policies may apply.",
      ],
    },
    {
      number: "06",
      title: "Payments & Subscriptions",
      icon: CreditCard,
      content: ["Paid subscriptions are billed according to your selected plan."],
      list: [
        "Monthly plans",
        "Annual plans",
        "Automatic renewals",
        "Cancellation options",
        "Refund policies where applicable",
      ],
    },
    {
      number: "07",
      title: "Intellectual Property",
      icon: Copyright,
      content: [
        "All software, branding, graphics, logos, and content belong to PressureGuard Care unless otherwise stated.",
      ],
    },
    {
      number: "08",
      title: "Medical Disclaimer",
      icon: HeartPulse,
      content: [
        "PressureGuard Care is designed to support emotional wellness.",
        "The application is not intended to diagnose, treat, or cure medical conditions.",
        "Always consult qualified healthcare professionals for medical advice.",
      ],
    },
    {
      number: "09",
      title: "Account Suspension",
      icon: Ban,
      content: [
        "We reserve the right to suspend or terminate accounts involved in fraud, abuse, harassment, or activities that violate these Terms.",
      ],
    },
    {
      number: "10",
      title: "Limitation of Liability",
      icon: Scale,
      content: [
        "PressureGuard Care shall not be liable for indirect, incidental, or consequential damages resulting from the use of the platform.",
      ],
    },
    {
      number: "11",
      title: "Changes to Terms",
      icon: RefreshCw,
      content: [
        "These Terms may be updated periodically. Continued use of PressureGuard Care constitutes acceptance of the updated Terms.",
      ],
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 px-4 py-12 md:px-6 md:py-20">
      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur-md">
            <FileCheck size={18} />
            Please Read Carefully
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Please review the terms and conditions that govern your use of{" "}
            <strong>PressureGuard Care</strong>.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: July 30, 2026
          </p>
        </div>

        {/* Terms Card */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl md:p-10">
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <section
                  key={section.number}
                  className="group rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Section Number */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-md">
                      {section.number}
                    </div>

                    <div className="flex-1">
                      {/* Section Heading */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Icon size={21} />
                        </div>

                        <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
                          {section.title}
                        </h2>
                      </div>

                      {/* Section Content */}
                      <div className="space-y-3 leading-7 text-slate-600">
                        {section.content.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </div>

                      {/* Optional List */}
                      {section.list && (
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                          {section.list.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                            >
                              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Contact Section */}
          <section className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-6 text-white shadow-lg md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Mail size={26} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  12. Contact Information
                </h2>

                <p className="mt-2 leading-7 text-white/90">
                  If you have questions or concerns regarding these Terms &
                  Conditions, please contact our support team.
                </p>

                <a
                  href="mailto:support@pressureguardcare.com"
                  className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 font-medium text-emerald-700 transition hover:scale-105 hover:shadow-md"
                >
                  support@pressureguardcare.com
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          © 2026 PressureGuard Care. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default TermsNConditions;