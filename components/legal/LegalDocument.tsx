import Link from "next/link";

export type LegalBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "label"; text: string }
  | { kind: "list"; items: readonly string[] }
  | {
      kind: "table";
      headers: readonly [string, string];
      rows: readonly (readonly [string, string])[];
    };

export type LegalSection = {
  title: string;
  blocks: readonly LegalBlock[];
};

export type LegalPage = {
  kicker: string;
  title: string;
  effectiveDate: string;
  intro: readonly string[];
  sections: readonly LegalSection[];
  relatedHref: string;
  relatedLabel: string;
};

const EMAIL = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

/**
 * Renders plain legal copy and turns email addresses into mailto links.
 */
function RichText({ text }: { text: string }) {
  const parts = text.split(EMAIL);
  return (
    <>
      {parts.map((part, index) =>
        part.includes("@") ? (
          <a key={`${part}-${index}`} href={`mailto:${part}`} className="text-orange-600 underline hover:text-orange-700">
            {part}
          </a>
        ) : (
          <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Renders one block inside a legal section.
 */
function LegalBlockView({ block }: { block: LegalBlock }) {
  if (block.kind === "label") {
    return <p className="pt-2 text-sm font-semibold text-gray-900">{block.text}</p>;
  }
  if (block.kind === "list") {
    return (
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700">
        {block.items.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.kind === "table") {
    return (
      <div className="overflow-x-auto rounded-xl border border-orange-100">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead className="bg-[#fbf6ef] text-gray-900">
            <tr>
              {block.headers.map((header) => (
                <th key={header} scope="col" className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row[0]} className="border-t border-orange-100">
                <th scope="row" className="px-4 py-3 font-medium text-gray-800">
                  {row[0]}
                </th>
                <td className="px-4 py-3 text-gray-700">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <p className="text-sm leading-6 text-gray-700">
      <RichText text={block.text} />
    </p>
  );
}

/**
 * Shared layout for the Event Terms and Event Privacy Policy pages.
 */
export function LegalDocument({
  kicker,
  title,
  effectiveDate,
  intro,
  sections,
  relatedHref,
  relatedLabel,
}: LegalPage) {
  return (
    <div className="min-h-screen bg-[#f4f1ec] px-4 py-10 text-gray-900 sm:px-6">
      <article className="mx-auto w-full max-w-3xl rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-10">
        <header className="mb-8 space-y-3 border-b border-orange-100 pb-6">
          <p className="text-xs font-bold tracking-[0.16em] text-orange-700">{kicker}</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium sm:text-4xl">{title}</h1>
          <p className="text-sm text-gray-600">{effectiveDate}</p>
          <p className="text-sm text-gray-600">Samsaraa WellTek Pvt. Ltd. · Brand: Samsara Wellness</p>
        </header>

        <div className="space-y-4">
          {intro.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-6 text-gray-700">
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-2" aria-labelledby={section.title}>
              <h2 id={section.title} className="text-base font-semibold text-gray-900">
                {section.title}
              </h2>
              {section.blocks.map((block, index) => (
                <LegalBlockView key={`${section.title}-${index}`} block={block} />
              ))}
            </section>
          ))}
        </div>

        <nav aria-label="Related policies" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-orange-100 pt-6 text-sm font-medium">
          <Link href={relatedHref} className="text-orange-600 underline hover:text-orange-700">
            {relatedLabel}
          </Link>
          <Link href="/register" className="text-orange-600 underline hover:text-orange-700">
            Back to registration
          </Link>
        </nav>
      </article>
    </div>
  );
}
