import {
  ShieldCheck,
  HeartPulse,
  Database,
  Activity,
  Share2,
  LockKeyhole,
  UserCheck,
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
          protecting the privacy and security of patients, caregivers, and
          healthcare professionals who use our platform. This Privacy Policy
          explains how we collect, use, store, and share information when you
          use PressureGuard Care.
        </p>
      ),
    },
    {
      number: "02",
      title: "About PressureGuard Care",
      icon: HeartPulse,
      content: (
        <p>
          PressureGuard Care is a health monitoring and pressure injury
          prevention platform designed to help patients, caregivers, and
          healthcare professionals monitor daily health activities, track
          patient conditions, identify potential warning signs, and support
          better care decisions.
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
            To provide our services, we may collect the following types of
            information:
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Account Information:</strong> Such as your name, email
                address, login credentials, and account details.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Patient Health Information:</strong> Information
                entered into the platform, including body position, skin
                condition, mobility, health observations, vital signs, and
                other relevant care information.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Care and Monitoring Data:</strong> Information related
                to repositioning schedules, skin care activities, care plans,
                reminders, and patient progress.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong>Usage Information:</strong> Information about how you
                interact with PressureGuard Care and its features.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "04",
      title: "How We Use Your Information",
      icon: Activity,
      content: (
        <>
          <p className="mb-4">
            We use the information collected through PressureGuard Care to:
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>Provide and maintain the PressureGuard Care platform.</span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                Help monitor daily patient health activities and observations.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                Track patient progress and historical health trends.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                Provide reminders related to repositioning, skin care, and
                other care activities.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                Help healthcare providers access relevant patient information
                when authorized.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <span>
                Improve the functionality, performance, and security of our
                platform.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      number: "05",
      title: "Sharing of Information",
      icon: Share2,
      content: (
        <>
          <p className="mb-4">
            We do not sell your personal or patient information. Information
            may only be shared in the following situations:
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>
                With authorized healthcare professionals involved in the
                patient's care.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>
                With caregivers or authorized users who have been granted
                access to the patient's information.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>
                With trusted service providers when necessary to operate and
                maintain PressureGuard Care.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <span>
                When required by applicable law or when necessary to protect
                the safety and security of users.
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
          We take appropriate security measures to help protect personal and
          health-related information from unauthorized access, loss, misuse, or
          disclosure. Access to sensitive information is intended to be limited
          to authorized users. However, no electronic storage system or
          transmission over the internet can be guaranteed to be completely
          secure.
        </p>
      ),
    },
    {
      number: "07",
      title: "Authorized Access",
      icon: UserCheck,
      content: (
        <p>
          Access to patient information is intended to be provided only to
          authorized patients, caregivers, healthcare professionals, and other
          approved users based on their role and permissions within the
          PressureGuard Care platform.
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
        </div>

        {/* Policy Sections */}
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
                      {/* Section Title */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Icon size={21} />
                        </div>

                        <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
                          {section.title}
                        </h2>
                      </div>

                      {/* Section Content */}
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
                <h2 className="text-xl font-semibold">8. Contact Us</h2>

                <p className="mt-2 leading-7 text-white/90">
                  If you have questions, comments, or concerns about this
                  Privacy Policy or how PressureGuard Care handles your
                  information, please contact our support team.
                </p>

                <a
                  href="mailto:support@pressureguardcare.com"
                  className="mt-3 inline-flex rounded-lg bg-white px-4 py-2 font-medium text-emerald-700 transition hover:scale-105 hover:shadow-md"
                >
                  support@pressureguardcare.com
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          © 2026 PressureGuard Care. Your privacy and health information are
          important to us.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;