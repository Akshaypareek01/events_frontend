import Link from "next/link";
import Image from "next/image";
// import { MarketingShell } from "@/components/layout/MarketingShell";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    // <MarketingShell>
      <div className="flex h-screen overflow-hidden">

        {/* ── LEFT PANEL (40%) ── */}
        <div className="relative hidden w-2/5 shrink-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-6 lg:px-10 overflow-hidden">
          <Image
            src="/orangebg.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-white/70 bg-white/85 p-3 shadow-lg backdrop-blur">
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm">
                <p className="text-center text-xl font-semibold tracking-wide text-black">Powered by</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 shadow-sm">
                <div className="mx-auto flex w-fit flex-col items-center rounded-xl bg-white px-4 py-3 shadow-md">
                  <Image
                    src="/adaptive-icon.png"
                    alt="Samsara logo"
                    width={34}
                    height={34}
                    className="h-8 w-8 object-contain"
                  />
                  <p className="mt-1.5 text-xs font-medium text-gray-800">Samsara</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm">
                <p className="text-center text-xl font-semibold tracking-wide text-black">Co-Powered by</p>
              </div>
              <div className="rounded-xl border border-pink-100 bg-pink-50/60 p-3.5 shadow-sm">
                <div className="grid grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center rounded-xl bg-white px-2 py-2.5 shadow-md"
                    >
                      <Image
                        src="/adaptive-icon.png"
                        alt="Samsara logo"
                        width={30}
                        height={30}
                        className="h-7 w-7 object-contain"
                      />
                      <p className="mt-1 text-[11px] font-medium text-gray-800">Samsara</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (60%) ── */}
        <div className="relative flex w-full lg:w-3/5 bg-white overflow-hidden">

          {/* Monk — bottom-right corner */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-0">
            <Image
              src="/monk.png"
              alt="Yoga monk"
              width={190}
              height={280}
              className="object-contain object-bottom"
            />
          </div>

          {/* Scrollable form area */}
          <div className="relative z-10 flex w-full flex-col items-center overflow-y-auto px-8 py-8">

 {/* ── Back button ── */}
  <div className="w-full max-w-[500px]">
    <Link
      href="/"
      className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </Link>
  </div>

            <div className="w-full max-w-[500px]">

              {/* ── Header logos ── */}
              <div className="mb-6 flex items-center justify-center gap-8">

                {/* Ministry of Ayush */}
                <div className="flex flex-col items-center gap-1.5">
                  <Image
                    src="/ministeryofayush.png"
                    alt="Ministry of Ayush"
                    width={64}
                    height={64}
                    className="h-16 w-auto object-contain"
                  />
                  <span className="max-w-[64px] text-center text-[10px] leading-tight text-gray-500">
                    Ministry of Ayush<br />Govt. of India
                  </span>
                </div>

                {/* Samsara */}
                <div className="flex items-center">
                  <Image
                    src="/samsaralogomain.png"
                    alt="Samsara"
                    width={160}
                    height={64}
                    className="h-16 w-auto object-contain"
                  />
                </div>

                {/* International Yoga Day */}
                <div className="flex flex-col items-center gap-1.5">
                  <Image
                    src="/yogaday.png"
                    alt="International Day of Yoga"
                    width={64}
                    height={64}
                    className="h-16 w-auto object-contain"
                  />
                  <span className="max-w-[64px] text-center text-[10px] leading-tight text-gray-500">
                    International<br />Yoga Day
                  </span>
                </div>

              </div>

              {/* ── Page title ── */}
              <div className="mb-5 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Registration Form</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Please fill in all required information to create your account
                </p>
              </div>

              {/* ── Form card ── */}
              <div className="rounded-2xl border border-gray-100 bg-white px-7 py-6 shadow-md">
                <RegisterForm />
              </div>

              <p className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-500 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    // </MarketingShell> 
  );
}