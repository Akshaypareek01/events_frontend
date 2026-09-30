import Link from "next/link";
import Image from "next/image";
// import { MarketingShell } from "@/components/layout/MarketingShell";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    // <MarketingShell>
      <div className="flex h-screen overflow-hidden">

        <div className="relative flex w-full overflow-hidden bg-white">

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
              <div className="mb-6 flex items-center justify-center">
                <Image
                  src="/samsaralogomain.png"
                  alt="Samsara"
                  width={160}
                  height={64}
                  className="h-16 w-auto object-contain"
                />
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