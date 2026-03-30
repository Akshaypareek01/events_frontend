import Image from "next/image";
import Link from "next/link";

type SearchParams = Promise<{ kind?: string }>;

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { kind } = await searchParams;
  const corporate = kind === "corporate";

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-800">
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden sm:block">
        <Image
          src="/monk.png"
          alt=""
          width={190}
          height={280}
          className="object-contain object-bottom opacity-90"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[500px] flex-col px-6 py-10 sm:px-8 sm:py-12">
        <Link
          href="/register"
          className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-orange-500"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to registration
        </Link>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-2xl border border-gray-100 bg-white px-7 py-8 shadow-md">
            <h1 className="text-2xl font-bold text-gray-900">Registration Complete</h1>
            {corporate ? (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
                <p>
                  You&apos;re successfully registered for the 80-Day Yoga Mahotsav through your organisation. Your
                  corporate access is now active—no payment required.
                </p>
                <p>
                  Please check your inbox for a confirmation email. Then, sign in using the same email address you
                  used to register. We&apos;ll send you a one-time code to access your dashboard.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Registration saved for the <strong className="font-semibold text-gray-800">80-day</strong> program.
                Complete payment (₹499 + 18% GST = ₹588.82) when prompted — you&apos;ll get a link by email. After
                payment, sign in from the login page with your email.
              </p>
            )}
            <Link
              href="/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:bg-orange-700"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Need help?{" "}
            <Link href="/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
