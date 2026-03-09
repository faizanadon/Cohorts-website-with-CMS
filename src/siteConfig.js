// ============================================================
// COHORTS — SITE CONFIG
// Single source of truth. Update here → updates everywhere.
// ============================================================

export const brand = {
  name: "Cohorts",
  productName: "Retreat OS",
  tagline: "The Operating System for Transformational Retreats",
  taglineSub: "Centralize participants, payments, staff, vendors, and automation in one platform.",
  domain: "app.cohorts.co",
  email: "hello@cohorts.co",
  ctaLabel: "Book a Retreat OS Simulation",
  ctaLabelShort: "Book Simulation",
  ctaUrl: "/contact",
  categoryName: "Retreat Operating System",
  heroHeadline: ["Run Premium Retreats", "Without Chaos"],
  heroSub: "Cohorts is the retreat operating system that centralizes participants, payments, communication, staff, vendors and automation in one platform.",
  year: "2025",
  twitterHandle: "@cohorts",
};

// ============================================================
// PRICING — 3-tier structure (corrected from JSX inline data)
// ============================================================
export const pricing = {
  currency: "USD",
  currencySymbol: "$",
  founderSeatsRemaining: 20,
  guarantee: "90-day results guarantee",
  note: "Founder pricing. Limited seats. Ends when full.",
  plans: [
    {
      id: "starter",
      name: "Retreat Starter OS",
      price: 1997,
      interval: "one-time",
      badge: null,
      highlight: false,
      description: "For retreat operators running 1–4 retreats per year who need to get organised fast.",
      features: [
        "Full Retreat OS setup",
        "Participant management module",
        "Payment collection & plans",
        "3 automation sequences",
        "2 weeks onboarding support",
        "SOP templates library",
      ],
      cta: "Apply for Founder Access",
      ctaUrl: "/contact",
    },
    {
      id: "founder",
      name: "Retreat Founder OS",
      price: 4997,
      interval: "one-time",
      badge: "Most Popular",
      highlight: true,
      description: "For scaling retreat businesses running 5–12 retreats per year ready to install a full OS.",
      features: [
        "Everything in Starter, plus:",
        "Full Marketing OS",
        "Sales automation system",
        "Staff & vendor management",
        "Analytics & reporting dashboard",
        "10 custom automation sequences",
        "4 weeks onboarding + implementation",
        "Priority support",
      ],
      cta: "Apply for Founder Access",
      ctaUrl: "/contact",
    },
    {
      id: "enterprise",
      name: "Retreat Enterprise OS",
      price: 9997,
      interval: "one-time",
      badge: "Full Build",
      highlight: false,
      description: "For established retreat businesses running 12+ retreats per year or multiple brands.",
      features: [
        "Everything in Founder, plus:",
        "Multi-retreat / multi-brand setup",
        "Custom integrations built",
        "Done-for-you automation build",
        "Quarterly strategy sessions",
        "Dedicated OS manager",
        "8 weeks full implementation",
        "Lifetime updates",
      ],
      cta: "Book Enterprise Consultation",
      ctaUrl: "/contact",
    },
  ],
  implementation: {
    name: "Done-For-You Implementation",
    price: 2997,
    description: "We build and configure your entire OS. You show up to the handover call.",
  },
  roiStats: [
    { label: "Average revenue increase year 1", value: "340%" },
    { label: "Hours saved per retreat on admin", value: "12hrs" },
    { label: "Payback period after install", value: "< 1 retreat" },
  ],
};

// ============================================================
// PLATFORM MODULES
// ============================================================
export const modules = [
  {
    id: "command-center",
    name: "Retreat Command Center",
    icon: "🧭",
    url: "/platform/retreat-command-center",
    desc: "Your real-time operations dashboard. Every retreat, every metric, every team member — in one view.",
  },
  {
    id: "participants",
    name: "Participant Experience",
    icon: "👤",
    url: "/platform/participant-experience",
    desc: "Branded participant portals, onboarding flows, pre-retreat info packs, and real-time comms.",
  },
  {
    id: "payments",
    name: "Payments & Revenue",
    icon: "💳",
    url: "/platform/payments-and-revenue",
    desc: "Payment plans, deposit collection, upsell sequences, automated reminders, refund management.",
  },
  {
    id: "automations",
    name: "Automations & Marketing OS",
    icon: "⚡",
    url: "/platform/automations-and-marketing",
    desc: "Pre-built automation sequences for every stage of the retreat lifecycle. Set it, run it, scale it.",
  },
  {
    id: "staff",
    name: "Staff & Vendor Management",
    icon: "🧑‍🤝‍🧑",
    url: "/platform/staff-and-vendor-management",
    desc: "Role assignments, SOPs, briefing docs, and coordination tools for your entire team and vendor network.",
  },
  {
    id: "analytics",
    name: "Analytics & Reporting",
    icon: "📈",
    url: "/platform/analytics-and-reporting",
    desc: "Revenue, profitability, participant LTV, satisfaction scores, and marketing ROI — all tracked automatically.",
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: "🔗",
    url: "/platform/integrations",
    desc: "Connects with your existing tools. Stripe, Zapier, email platforms, booking systems — plug it all in.",
  },
  {
    id: "scaling",
    name: "Retreat Scaling System",
    icon: "🚀",
    url: "/platform/retreat-scaling-system",
    desc: "Templates, SOPs, and playbooks that make every future retreat faster, better, and more profitable.",
  },
];

// ============================================================
// RETREAT TYPES
// ============================================================
export const retreatTypes = [
  { id: "yoga",       label: "Yoga",         emoji: "🧘", slug: "yoga-retreat-software",         color: "#7c3aed", desc: "Run repeatable yoga retreats without spreadsheets, WhatsApp chaos, or manual follow-ups. From Bali studios to Costa Rica jungles." },
  { id: "wellness",   label: "Wellness",      emoji: "🌿", slug: "wellness-retreat-software",     color: "#10b981", desc: "Automate the entire wellness retreat journey — from first booking to post-retreat upsell. Built for multi-day and destination formats." },
  { id: "meditation", label: "Meditation",    emoji: "🧠", slug: "meditation-retreat-software",   color: "#6366f1", desc: "Create deeply serene participant experiences with zero operational noise. Silent retreats deserve silent systems." },
  { id: "corporate",  label: "Corporate",     emoji: "🏢", slug: "corporate-retreat-software",    color: "#0ea5e9", desc: "Handle group bookings, invoicing, and stakeholder reporting for corporate off-sites and leadership programs at scale." },
  { id: "spiritual",  label: "Spiritual",     emoji: "✨", slug: "spiritual-retreat-software",    color: "#f59e0b", desc: "Build sacred containers without administrative chaos. From vision quests to ceremonies — operated with precision." },
  { id: "fitness",    label: "Fitness",       emoji: "💪", slug: "fitness-retreat-software",      color: "#ef4444", desc: "Manage training schedules, dietary requirements, and high-volume participant cohorts across multiple retreats per month." },
  { id: "leadership", label: "Leadership",    emoji: "🎯", slug: "leadership-retreat-software",   color: "#4f46e5", desc: "Run executive-level retreat programs with enterprise invoicing, stakeholder portals, and premium participant experiences." },
  { id: "luxury",     label: "Luxury",        emoji: "💎", slug: "luxury-retreat-software",       color: "#d4af37", desc: "Deliver white-glove retreat experiences with automated concierge touchpoints, VIP portals, and premium communication." },
  { id: "coaching",   label: "Coaching",      emoji: "🎓", slug: "coaching-retreat-software",     color: "#f97316", desc: "From 1:1 intensives to group coaching retreats — automate intake, session management, and follow-up sequences." },
  { id: "nomad",      label: "Digital Nomad", emoji: "🌍", slug: "digital-nomad-retreat-software", color: "#06b6d4", desc: "Run location-independent retreats across multiple countries with multi-currency support and remote team management." },
];

// ============================================================
// LOCATIONS
// ============================================================
export const locations = [
  { id: "usa",        label: "USA",        slug: "retreat-software-usa",        region: "Americas" },
  { id: "uk",         label: "UK",         slug: "retreat-software-uk",         region: "Europe" },
  { id: "australia",  label: "Australia",  slug: "retreat-software-australia",  region: "Oceania" },
  { id: "canada",     label: "Canada",     slug: "retreat-software-canada",     region: "Americas" },
  { id: "europe",     label: "Europe",     slug: "retreat-software-europe",     region: "Europe" },
  { id: "bali",       label: "Bali",       slug: "retreat-software-bali",       region: "Asia" },
  { id: "costa-rica", label: "Costa Rica", slug: "retreat-software-costa-rica", region: "Americas" },
  { id: "mexico",     label: "Mexico",     slug: "retreat-software-mexico",     region: "Americas" },
  { id: "thailand",   label: "Thailand",   slug: "retreat-software-thailand",   region: "Asia" },
  { id: "portugal",   label: "Portugal",   slug: "retreat-software-portugal",   region: "Europe" },
];

// SEO matrix — 100 pages
export const seoMatrix = retreatTypes.flatMap(type =>
  locations.map(location => ({
    type,
    location,
    slug: `/${type.slug}/${location.id}`,
    title: `${type.label} Retreat Software ${location.label}`,
    metaTitle: `${type.label} Retreat Management Software for ${location.label} | Cohorts`,
    metaDesc: `Run your ${type.label.toLowerCase()} retreat in ${location.label} without chaos. Cohorts is the retreat OS built for ${location.label}-based retreat operators.`,
  }))
);

// ============================================================
// SOLUTIONS
// ============================================================
export const solutions = [
  { id: "operations", name: "Retreat Operations System",  slug: "retreat-operations-system",  icon: "⚙️", color: "#4f46e5", desc: "End the spreadsheet chaos. Install a single operations command layer across your entire retreat." },
  { id: "marketing",  name: "Retreat Marketing System",   slug: "retreat-marketing-system",   icon: "📣", color: "#7c3aed", desc: "Fill your seats without burning out. Automated email flows, waitlists, and re-engagement." },
  { id: "sales",      name: "Retreat Sales System",       slug: "retreat-sales-system",       icon: "💰", color: "#0ea5e9", desc: "Convert enquiries to bookings with structured sales flows, upsells, and follow-up sequences." },
  { id: "automation", name: "Retreat Automation System",  slug: "retreat-automation-system",  icon: "⚡", color: "#10b981", desc: "Replace the 47 manual tasks with automation. From booking to post-retreat review requests." },
  { id: "scaling",    name: "Retreat Scaling System",     slug: "retreat-scaling-system",     icon: "📈", color: "#f59e0b", desc: "Go from 4 retreats a year to 12. SOPs, delegation frameworks, and repeatability built-in." },
  { id: "crisis",     name: "Retreat Crisis Control",     slug: "retreat-crisis-control",     icon: "🛡️", color: "#ef4444", desc: "When things go wrong: cancellation flows, refund management, emergency comms — handled." },
];

// ============================================================
// STATS & SOCIAL PROOF
// ============================================================
export const stats = [
  { value: "340%",  label: "Average revenue increase in year 1" },
  { value: "12hrs", label: "Saved per retreat on admin work" },
  { value: "94%",   label: "Participant satisfaction rate" },
  { value: "500+",  label: "Retreats live on the OS" },
];

export const testimonials = [
  {
    id: 1,
    quote: "Before Cohorts, I was managing 40 participants across WhatsApp, email, and 3 spreadsheets. Now everything runs through one system. My last retreat made 60% more revenue than the one before it.",
    name: "Sara R.",
    role: "Yoga Retreat Owner",
    location: "Bali",
    initials: "SR",
    color: "#4f46e5",
    metric: "+60% revenue",
  },
  {
    id: 2,
    quote: "The automation alone saved us 15 hours per retreat. But the real win was the participant experience — people are shocked by how professional and seamless it feels from booking to arrival.",
    name: "James M.",
    role: "Wellness Retreat Founder",
    location: "Costa Rica",
    initials: "JM",
    color: "#6366f1",
    metric: "15hrs saved / retreat",
  },
  {
    id: 3,
    quote: "We went from running 4 retreats a year to 11. Cohorts made that possible. The scaling system is what separated us from every other retreat operator we know.",
    name: "Aiko K.",
    role: "Corporate Retreat Director",
    location: "London",
    initials: "AK",
    color: "#4338ca",
    metric: "4 → 11 retreats/year",
  },
];

// ============================================================
// RESOURCES / GUIDES
// ============================================================
export const guides = [
  { id: "operations", title: "Retreat Operations Guide",  desc: "The complete guide to systemizing your retreat operations — from participant management to vendor coordination.", icon: "📋", pages: "48 pages", color: "#4f46e5" },
  { id: "marketing",  title: "Retreat Marketing Guide",   desc: "How to fill retreat seats consistently with automated funnels, email sequences, and referral programs.", icon: "📣", pages: "36 pages", color: "#7c3aed" },
  { id: "pricing",    title: "Retreat Pricing Guide",     desc: "Pricing strategy, payment structures, and upsell frameworks for premium retreat businesses.", icon: "💰", pages: "28 pages", color: "#10b981" },
  { id: "automation", title: "Retreat Automation Guide",  desc: "Step-by-step automation playbook for every touchpoint in the participant journey.", icon: "⚡", pages: "42 pages", color: "#0ea5e9" },
  { id: "business",   title: "Retreat Business Guide",    desc: "Building a scalable retreat business from first cohort to 10+ retreats per year.", icon: "🚀", pages: "56 pages", color: "#f59e0b" },
];

export const blogPosts = [
  { title: "Why Most Retreat Businesses Fail (And How to Fix It)",    cat: "Operations", read: "8 min" },
  { title: "The Hidden Cost of Manual Retreat Management",             cat: "Operations", read: "6 min" },
  { title: "How to Fill Retreat Seats Consistently",                  cat: "Marketing",  read: "10 min" },
  { title: "Retreat Pricing Benchmarks 2025",                         cat: "Pricing",    read: "12 min" },
  { title: "Cohorts vs WeTravel — Full Comparison",                   cat: "Technology", read: "7 min" },
  { title: "How to Automate Your Entire Retreat Business",            cat: "Automation", read: "14 min" },
  { title: "The Retreat Operations Blueprint",                         cat: "Operations", read: "18 min" },
  { title: "Retreat Upsell Strategies That Actually Work",            cat: "Marketing",  read: "9 min" },
  { title: "Why WhatsApp Retreat Management Breaks at Scale",         cat: "Operations", read: "5 min" },
  { title: "Retreat Industry Statistics 2025",                        cat: "Data",       read: "11 min" },
  { title: "Cohorts vs Eventbrite — Which Is Right for Retreats?",   cat: "Technology", read: "8 min" },
  { title: "How to Scale from 4 Retreats a Year to 12",              cat: "Growth",     read: "13 min" },
];

// ============================================================
// SEO DEFAULTS
// ============================================================
export const seo = {
  defaultTitle: `${brand.name} — ${brand.tagline}`,
  titleTemplate: `%s | ${brand.name}`,
  description: brand.taglineSub,
  ogImage: "/og-default.jpg",
  twitterHandle: brand.twitterHandle,
  siteUrl: `https://${brand.domain}`,
};

// ============================================================
// NAV STRUCTURE
// ============================================================
export const nav = {
  primary: [
    { label: "Platform",      url: "/platform",      page: "platform",      sub: modules.map(m => ({ label: m.name, page: "platform" })) },
    { label: "Solutions",     url: "/solutions",     page: "solutions",     sub: solutions.map(s => ({ label: s.name, page: "solutions" })) },
    { label: "Retreat Types", url: "/retreat-types", page: "retreat-types", sub: retreatTypes.map(r => ({ label: r.label, page: "retreat-types" })) },
    { label: "Locations",     url: "/locations",     page: "locations",     sub: locations.map(l => ({ label: l.label, page: "locations" })) },
    { label: "Pricing",       url: "/pricing",       page: "pricing",       sub: [] },
    { label: "Resources",     url: "/resources",     page: "resources",     sub: guides.map(g => ({ label: g.title, page: "resources" })) },
  ],
  secondary: [
    { label: "Blog",          url: "/blog",          page: "blog" },
    { label: "Case Studies",  url: "/case-studies",  page: "case-studies" },
    { label: "About",         url: "/about",         page: "about" },
  ],
  cta: {
    label: brand.ctaLabel,
    labelShort: brand.ctaLabelShort,
    url: brand.ctaUrl,
    page: "contact",
  },
};
