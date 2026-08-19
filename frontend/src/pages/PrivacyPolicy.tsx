import {
  ShieldCheck,
  HeartPulse,
  Database,
  Eye,
  Share2,
  LockKeyhole,
  Mail,
} from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      number: "01",
      title: "Introduction",
      icon: ShieldCheck,
      content: (
        <p>
          Welcome to <strong>PressureGuard Care</strong>. We are committed to
          protecting your personal information and your right to privacy. This
          Privacy Policy explains how we collect, use, and share your
          information when you use our mental health and wellness platform.
        </p>
      ),
    },
    {
      number: "02",
      title: "Services Provided",
      icon: HeartPulse,
      content: (
        <p>
          PressureGuard Care provides a variety of features to support your
          mental wellbeing, including connecting you to therapists, AI chat
          support, mood and journal tracking, a wellness library containing
          breathing exercises, meditation, sleep aids, and articles, streak
          tracking, push notifications, and access to crisis helplines and
          trusted contacts.
        </p>
      ),
    },
    {
      number: "03",
      title: "Information We Collect",
      icon: Database,
      content: (
        <>
          <p className="mb-4">
            To provide these services, we collect the following types of
            information:
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Account Data:</strong> Name, email, and login details
                when you create an account.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Health & Wellness Data:</strong> Data you actively
                input, including your daily moods, personal journal entries,
                and app usage streaks.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>AI Chat Data:</strong> Questions, prompts, and
                interactions you have with our AI chat assistant regarding
                therapy or general wellbeing.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Location Data:</strong> We may collect location data,
                for example through Google Maps, to help you find and connect
                with nearby therapists.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Contacts & Support:</strong> Information regarding
                Trusted Contacts you add to the app for crisis support and your
                access to helpline contacts.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Usage Data:</strong> Information on how you interact
                with our Wellness Library and notifications.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "04",
      title: "How We Use Your Information",
      icon: Eye,
      content: (
        <>
          <p className="mb-4">
            We use your information strictly to provide and improve the
            PressureGuard Care experience:
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                To facilitate connections between you and professional
                therapists.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>To generate personalized AI chat responses.</span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                To track your wellness journey through moods, journals, and
                streaks.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                To send relevant notifications such as reminders or wellness
                tips.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                To provide quick access to trusted contacts and crisis support
                during emergencies.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "05",
      title: "Sharing Your Information",
      icon: Share2,
      content: (
        <>
          <p className="mb-4">
            We do not sell your personal data. We only share information in the
            following circumstances:
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>
                With professional therapists when you explicitly choose to
                connect with them for services.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>
                With third-party service providers, such as Google Maps or AI
                hosting providers, strictly to facilitate app features.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>
                To comply with legal obligations or protect the safety of our
                users.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "06",
      title: "Data Security",
      icon: LockKeyhole,
      content: (
        <p>
          Because PressureGuard Care handles sensitive wellness and journal
          data, we use industry-standard encryption and security measures to
          protect your personal information. However, please remember that no
          electronic transmission over the internet is 100% secure.
        </p>
      ),
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
            <ShieldCheck size={18} />
            Your Privacy Matters
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Learn how <strong>PressureGuard Care</strong> collects, uses, and
            protects your information.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: July 30, 2026
          </p>
        </div>

        {/* Policy Card */}
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
                    {/* Number */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-md">
                      {section.number}
                    </div>

                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Icon size={21} />
                        </div>

                        <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
                          {section.title}
                        </h2>
                      </div>

                      <div className="leading-7 text-slate-600">
                        {section.content}
                      </div>
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
                <h2 className="text-xl font-semibold">7. Contact Us</h2>

                <p className="mt-2 leading-7 text-white/90">
                  If you have questions, comments, or concerns about this
                  policy or your data privacy, please contact us through the
                  Support Screen in the app or email us at
                </p>

                <a
                  href="mailto:privacy@pressureguardcare.com"
                  className="mt-3 inline-flex rounded-lg bg-white px-4 py-2 font-medium text-emerald-700 transition hover:scale-105 hover:shadow-md"
                >
                  privacy@pressureguardcare.com
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          © 2026 PressureGuard Care. Your privacy and wellbeing are important
          to us.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;