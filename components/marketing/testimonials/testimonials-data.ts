export type Testimonial = {
  name: string;
  company: string;
  country: string;
  content: string;
  fullContent: string;
  image?: string;
  video?: string;
  videoPoster?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ciaran Harris",
    company: "CogniStream",
    country: "Ireland",
    image: "/stories/ciaran.jpeg",
    content:
      "Financial admin stopped being a source of friction. Rootly actually works the way you'd expect modern software to work.",
    fullContent:
      "Company\nCogniStream is an AI-moderated qualitative research platform.\n\nChallenge\nLegacy tools were difficult to connect and painful to use.\n\nImpact\nFinancial admin stopped being a source of friction, with a cleaner routine every week.\n\nFavorite features\nReceipt scanning and matching, plus practical AI assistance for finance questions.",
  },
  {
    name: "Vitalie Rosescu",
    company: "Awwwocado",
    country: "Netherlands",
    image: "/stories/vitalie.jpg",
    content:
      "All in one platform for freelancers looking to create clear insights on income and expenses.",
    fullContent:
      "Company\nAwwwocado is a Webflow development business.\n\nChallenge\nExisting software lacked clear visibility into paid and pending invoices.\n\nImpact\nA single view for income, invoices, and expenses made operations much easier.\n\nFavorite features\nInvoice workflows, shareable invoice links, and automated expense intake.",
  },
  {
    name: "Pawel Michalski",
    company: "VC Leaders",
    country: "Poland",
    image: "/stories/pawel.jpeg",
    content:
      "Invoice reconciliation used to take a full day each month and was always stressful.",
    fullContent:
      "Company\nVC Leaders helps venture capitalists build better VC firms.\n\nChallenge\nMonthly invoice reconciliation took too long and consumed analysis time.\n\nImpact\nRootly reduced reconciliation by 1-2 man-days per month and improved visibility.\n\nFavorite features\nAccounts payable tracking, reconciliation workflows, and financial dashboards.",
  },
  {
    name: "Facu Montanaro",
    company: "Kundo Studio",
    country: "Argentina",
    image: "/stories/facu.jpeg",
    content:
      "Managing invoicing, projects, and finances across tools slowed my daily work.",
    fullContent:
      "Company\nKundo Studio helps startups and founders with growth and product launches.\n\nChallenge\nWorking across disconnected tools made daily finance operations slower.\n\nImpact\nRootly centralized invoicing, projects, and tracking into one workflow.\n\nFavorite features\nInvoicing and time tracking as core daily tools.",
  },
  {
    name: "Nick Speer",
    company: "Speer Technologies",
    country: "United States",
    image: "/stories/speer.jpeg",
    content:
      "Rootly is bookkeeping software without the fluff. It's a ledger with modern tooling and integrations.",
    fullContent:
      "Company\nSpeer Technologies is an AI consulting firm in the United States.\n\nChallenge\nWeekends were spent cleaning books and working around clunky tools.\n\nImpact\nSwitching from QuickBooks to Rootly created day-to-day control and clarity.\n\nFavorite features\nAuto-categorization and clear export flows for advisor collaboration.",
  },
  {
    name: "Richard Poelderl",
    company: "Conduct",
    country: "Germany",
    image: "/stories/richard.jpeg",
    content:
      "My previous accounting setup was fragmented and didn't support my bank.",
    fullContent:
      "Company\nConduct helps teams focus product development while outsourcing growth execution.\n\nChallenge\nHis previous accounting tool required manual exports and fragmented workflows.\n\nImpact\nRootly made invoicing easier and simplified sharing clean data with tax advisors.\n\nFavorite features\nBank sync, invoicing, and accounting-ready CSV exports.",
  },
  {
    name: "Ivo Dukov",
    company: "Smarch",
    country: "Bulgaria",
    content:
      "Everything lives in one place now - customers, invoices, documents, and financial analytics.",
    fullContent:
      "Company\nSmarch is a software development agency specializing in e-commerce and web applications.\n\nChallenge\nFinancial documents and invoice workflows were scattered and repetitive.\n\nImpact\nTemplates, analytics, and storage reduced repetitive admin work substantially.\n\nFavorite features\nInvoice templates that remove repetitive billing setup.",
  },
  {
    name: "Guy Solan",
    company: "Thetis Medical",
    country: "United Kingdom",
    image: "/stories/guy.jpeg",
    content:
      "Without Rootly, I had no real visibility into our cash and relied entirely on my accountant.",
    fullContent:
      "Company\nThetis Medical is a medical device company.\n\nChallenge\nThere was no clear, direct visibility into cash and financial status.\n\nImpact\nRootly gave clear visibility without requiring deep accounting software expertise.\n\nFavorite features\nCash-flow visibility and straightforward weekly oversight.",
    video:
      "https://customer-oh6t55xltlgrfayh.cloudflarestream.com/5b86803383964d52ee6834fd289f4f4e/manifest/video.m3u8",
    videoPoster: "https://cdn.rootly.ai/guy-cover.png",
  },
];

export const homepageTestimonials: Testimonial[] = testimonials.filter((testimonial) =>
  ["Pawel Michalski", "Facu Montanaro", "Richard Poelderl", "Guy Solan"].includes(
    testimonial.name,
  ),
);

export function parseStructuredContent(content: string) {
  const sections = content.split("\n\n");
  const structured: { label: string; text: string }[] = [];

  for (const rawSection of sections) {
    const section = rawSection.trim();
    if (!section) continue;

    const lines = section.split("\n");
    const firstLine = lines[0]?.trim() ?? "";
    const isLabel =
      firstLine.length > 0 && firstLine.length < 30 && /^[A-Z][a-z\s]+$/.test(firstLine) && lines.length > 1;

    if (isLabel) {
      structured.push({
        label: firstLine,
        text: lines.slice(1).join("\n").trim(),
      });
      continue;
    }

    if (structured.length > 0) {
      const last = structured[structured.length - 1];
      if (last) last.text = `${last.text}\n\n${section}`;
    } else {
      structured.push({ label: "", text: section });
    }
  }

  return structured;
}
