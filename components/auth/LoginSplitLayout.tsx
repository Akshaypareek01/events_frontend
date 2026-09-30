import Image from "next/image";
import type { ReactNode } from "react";

/** Left hero image — shared by `/login` and `/teacher/login`. */
function LeftPanel() {
  return (
    <div className="relative hidden w-2/5 shrink-0 overflow-hidden bg-[#fbf6ef] lg:block">
      <Image
        src="/moon/hero.webp"
        alt="Woman sitting by moonlit water, hosting The Moon Within circle"
        fill
        className="object-contain object-center"
        priority
      />
    </div>
  );
}

type Props = { children: ReactNode };

/**
 * Split-screen auth shell: decorative left panel (lg+), white right column with logo,
 * and scrollable content. Shared by participant and teacher login.
 */
export function LoginSplitLayout({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden">
      <LeftPanel />

      <div className="relative flex w-full flex-col overflow-hidden bg-white lg:w-3/5">
        <a
          href="/"
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-orange-500"
        >
          Back
        </a>

        <div className="flex flex-1 flex-col overflow-y-auto px-8 py-8">
          <div className="flex justify-center">
            <Image
              src="/samsaralogomain.png"
              alt="Samsara"
              width={120}
              height={120}
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-6">
            <div className="w-full max-w-[500px]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
