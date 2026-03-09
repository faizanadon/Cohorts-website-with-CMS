-- ============================================================
-- COHORTS — SEED DATA
-- Mirrors current siteConfig.js exactly
-- Run AFTER schema.sql
-- ============================================================

-- BRAND SETTINGS
insert into site_settings (key, value) values
  ('brand', '{
    "name": "Cohorts",
    "productName": "Retreat OS",
    "tagline": "The Operating System for Transformational Retreats",
    "taglineSub": "Centralize participants, payments, staff, vendors, and automation in one platform.",
    "domain": "app.cohorts.co",
    "email": "hello@cohorts.co",
    "ctaLabel": "Book a Retreat OS Simulation",
    "ctaLabelShort": "Book Simulation",
    "categoryName": "Retreat Operating System",
    "heroHeadline": ["Run Premium Retreats", "Without Chaos"],
    "heroSub": "Cohorts is the retreat operating system that centralizes participants, payments, communication, staff, vendors and automation in one platform.",
    "year": "2025",
    "twitterHandle": "@cohorts"
  }'::jsonb),
  ('pricing_meta', '{
    "currency": "USD",
    "currencySymbol": "$",
    "founderSeatsRemaining": 20,
    "guarantee": "90-day results guarantee",
    "note": "Founder pricing. Limited seats. Ends when full.",
    "implementation": {
      "name": "Done-For-You Implementation",
      "price": 2997,
      "description": "We build and configure your entire OS. You show up to the handover call."
    },
    "roiStats": [
      { "label": "Average revenue increase year 1", "value": "340%" },
      { "label": "Hours saved per retreat on admin", "value": "12hrs" },
      { "label": "Payback period after install", "value": "< 1 retreat" }
    ]
  }'::jsonb)
on conflict (key) do update set value = excluded.value;

-- PRICING PLANS
insert into pricing_plans (id, name, price, interval, badge, highlight, description, features, cta, cta_url, sort_order) values
  ('starter', 'Retreat Starter OS', 1997, 'one-time', null, false,
   'For retreat operators running 1–4 retreats per year who need to get organised fast.',
   '["Full Retreat OS setup","Participant management module","Payment collection & plans","3 automation sequences","2 weeks onboarding support","SOP templates library"]'::jsonb,
   'Apply for Founder Access', '/contact', 1),
  ('founder', 'Retreat Founder OS', 4997, 'one-time', 'Most Popular', true,
   'For scaling retreat businesses running 5–12 retreats per year ready to install a full OS.',
   '["Everything in Starter, plus:","Full Marketing OS","Sales automation system","Staff & vendor management","Analytics & reporting dashboard","10 custom automation sequences","4 weeks onboarding + implementation","Priority support"]'::jsonb,
   'Apply for Founder Access', '/contact', 2),
  ('enterprise', 'Retreat Enterprise OS', 9997, 'one-time', 'Full Build', false,
   'For established retreat businesses running 12+ retreats per year or multiple brands.',
   '["Everything in Founder, plus:","Multi-retreat / multi-brand setup","Custom integrations built","Done-for-you automation build","Quarterly strategy sessions","Dedicated OS manager","8 weeks full implementation","Lifetime updates"]'::jsonb,
   'Book Enterprise Consultation', '/contact', 3)
on conflict (id) do update set name=excluded.name, price=excluded.price, highlight=excluded.highlight, features=excluded.features, updated_at=now();

-- PLATFORM MODULES
insert into platform_modules (id, name, icon, description, url, sort_order) values
  ('command-center', 'Retreat Command Center', '🧭', 'Your real-time operations dashboard. Every retreat, every metric, every team member — in one view.', '/platform/retreat-command-center', 1),
  ('participants',   'Participant Experience',  '👤', 'Branded participant portals, onboarding flows, pre-retreat info packs, and real-time comms.', '/platform/participant-experience', 2),
  ('payments',       'Payments & Revenue',      '💳', 'Payment plans, deposit collection, upsell sequences, automated reminders, refund management.', '/platform/payments-and-revenue', 3),
  ('automations',    'Automations & Marketing OS','⚡','Pre-built automation sequences for every stage of the retreat lifecycle. Set it, run it, scale it.', '/platform/automations-and-marketing', 4),
  ('staff',          'Staff & Vendor Management','🧑‍🤝‍🧑','Role assignments, SOPs, briefing docs, and coordination tools for your entire team and vendor network.', '/platform/staff-and-vendor-management', 5),
  ('analytics',      'Analytics & Reporting',   '📈', 'Revenue, profitability, participant LTV, satisfaction scores, and marketing ROI — all tracked automatically.', '/platform/analytics-and-reporting', 6),
  ('integrations',   'Integrations',            '🔌', 'Connect Stripe, Zapier, Mailchimp, Notion, Zoom, and 50+ tools. Everything flows into one system.', '/platform/integrations', 7),
  ('scaling',        'Retreat Scaling System',  '🚀', 'Clone retreats, automate setup, delegate with SOPs. Run 3x more retreats without hiring.', '/platform/retreat-scaling-system', 8)
on conflict (id) do update set name=excluded.name, icon=excluded.icon, description=excluded.description, updated_at=now();

-- SOLUTIONS
insert into solutions (id, name, slug, icon, color, description, sort_order) values
  ('operations', 'Retreat Operations System', 'retreat-operations-system', '⚙️', '#4f46e5', 'End the spreadsheet chaos. Install a single operations command layer across your entire retreat.', 1),
  ('marketing',  'Retreat Marketing System',  'retreat-marketing-system',  '📣', '#7c3aed', 'Fill your seats without burning out. Automated email flows, waitlists, and re-engagement.', 2),
  ('sales',      'Retreat Sales System',      'retreat-sales-system',      '💰', '#0ea5e9', 'Convert enquiries to bookings with structured sales flows, upsells, and follow-up sequences.', 3),
  ('automation', 'Retreat Automation System', 'retreat-automation-system', '⚡', '#10b981', 'Replace the 47 manual tasks with automation. From booking to post-retreat review requests.', 4),
  ('scaling',    'Retreat Scaling System',    'retreat-scaling-system',    '📈', '#f59e0b', 'Go from 4 retreats a year to 12. SOPs, delegation frameworks, and repeatability built-in.', 5),
  ('crisis',     'Retreat Crisis Control',    'retreat-crisis-control',    '🛡️', '#ef4444', 'When things go wrong: cancellation flows, refund management, emergency comms — handled.', 6)
on conflict (id) do update set name=excluded.name, description=excluded.description, color=excluded.color, updated_at=now();

-- RETREAT TYPES
insert into retreat_types (id, label, emoji, color, slug, description, sort_order) values
  ('yoga',       'Yoga',         '🧘', '#7c3aed', 'yoga-retreat-software',         'The most competitive retreat category in the world. Yoga retreat operators need participant management, payment plans, and marketing automation to stand out.', 1),
  ('wellness',   'Wellness',     '🌿', '#10b981', 'wellness-retreat-software',     'Multi-day wellness retreats require complex logistics, dietary management, practitioner coordination, and premium participant communication.', 2),
  ('meditation', 'Meditation',   '🕯️', '#6366f1', 'meditation-retreat-software',   'Silence retreats, Vipassana-style programs, and mindfulness immersions — operated with automated precision and minimal interruption.', 3),
  ('corporate',  'Corporate',    '💼', '#0ea5e9', 'corporate-retreat-software',    'Corporate retreats demand enterprise-grade invoicing, stakeholder reporting, and seamless coordination across large groups.', 4),
  ('spiritual',  'Spiritual',    '✨', '#f59e0b', 'spiritual-retreat-software',    'Build sacred containers without administrative chaos. From vision quests to ceremonies — operated with precision.', 5),
  ('fitness',    'Fitness',      '💪', '#ef4444', 'fitness-retreat-software',      'Manage training schedules, dietary requirements, and high-volume participant cohorts across multiple retreats per month.', 6),
  ('leadership', 'Leadership',   '🎯', '#4f46e5', 'leadership-retreat-software',   'Run executive-level retreat programs with enterprise invoicing, stakeholder portals, and premium participant experiences.', 7),
  ('luxury',     'Luxury',       '💎', '#d4af37', 'luxury-retreat-software',       'Deliver white-glove retreat experiences with automated concierge touchpoints, VIP portals, and premium communication.', 8),
  ('coaching',   'Coaching',     '🎓', '#f97316', 'coaching-retreat-software',     'From 1:1 intensives to group coaching retreats — automate intake, session management, and follow-up sequences.', 9),
  ('nomad',      'Digital Nomad','🌍', '#06b6d4', 'digital-nomad-retreat-software','Run location-independent retreats across multiple countries with multi-currency support and remote team management.', 10)
on conflict (id) do update set label=excluded.label, description=excluded.description, color=excluded.color, updated_at=now();

-- LOCATIONS
insert into locations (id, label, slug, region, sort_order) values
  ('usa',        'USA',        'retreat-software-usa',        'Americas', 1),
  ('uk',         'UK',         'retreat-software-uk',         'Europe',   2),
  ('australia',  'Australia',  'retreat-software-australia',  'Oceania',  3),
  ('canada',     'Canada',     'retreat-software-canada',     'Americas', 4),
  ('europe',     'Europe',     'retreat-software-europe',     'Europe',   5),
  ('bali',       'Bali',       'retreat-software-bali',       'Asia',     6),
  ('costa-rica', 'Costa Rica', 'retreat-software-costa-rica', 'Americas', 7),
  ('mexico',     'Mexico',     'retreat-software-mexico',     'Americas', 8),
  ('thailand',   'Thailand',   'retreat-software-thailand',   'Asia',     9),
  ('portugal',   'Portugal',   'retreat-software-portugal',   'Europe',   10)
on conflict (id) do update set label=excluded.label, region=excluded.region, updated_at=now();

-- GUIDES
insert into guides (id, title, description, icon, pages, color, sort_order) values
  ('operations', 'Retreat Operations Guide',  'The complete guide to systemizing your retreat operations — from participant management to vendor coordination.', '📋', '48 pages', '#4f46e5', 1),
  ('marketing',  'Retreat Marketing Guide',   'How to fill retreat seats consistently with automated funnels, email sequences, and referral programs.', '📣', '36 pages', '#7c3aed', 2),
  ('pricing',    'Retreat Pricing Guide',     'Pricing strategy, payment structures, and upsell frameworks for premium retreat businesses.', '💰', '28 pages', '#10b981', 3),
  ('automation', 'Retreat Automation Guide',  'Step-by-step automation playbook for every touchpoint in the participant journey.', '⚡', '42 pages', '#0ea5e9', 4),
  ('business',   'Retreat Business Guide',    'Building a scalable retreat business from first cohort to 10+ retreats per year.', '🚀', '56 pages', '#f59e0b', 5)
on conflict (id) do update set title=excluded.title, description=excluded.description, updated_at=now();

-- BLOG POSTS
insert into blog_posts (title, category, read_time, published) values
  ('Why Most Retreat Businesses Fail (And How to Fix It)',   'Operations', '8 min',  true),
  ('The Hidden Cost of Manual Retreat Management',            'Operations', '6 min',  true),
  ('How to Fill Retreat Seats Consistently',                 'Marketing',  '10 min', true),
  ('Retreat Pricing Benchmarks 2025',                        'Pricing',    '12 min', true),
  ('Cohorts vs WeTravel — Full Comparison',                  'Technology', '7 min',  true),
  ('How to Automate Your Entire Retreat Business',           'Automation', '14 min', true),
  ('The Retreat Operations Blueprint',                        'Operations', '18 min', true),
  ('Retreat Upsell Strategies That Actually Work',           'Marketing',  '9 min',  true),
  ('Why WhatsApp Retreat Management Breaks at Scale',        'Operations', '5 min',  true),
  ('Retreat Industry Statistics 2025',                       'Data',       '11 min', true),
  ('Cohorts vs Eventbrite — Which Is Right for Retreats?',  'Technology', '8 min',  true),
  ('How to Scale from 4 Retreats a Year to 12',             'Growth',     '13 min', true);

-- TESTIMONIALS
insert into testimonials (name, role, location, initials, color, quote, metric, sort_order) values
  ('Sara R.',  'Yoga Retreat Owner',         'Bali',       'SR', '#4f46e5', 'Before Cohorts, I was managing 40 participants across WhatsApp, email, and 3 spreadsheets. Now everything runs through one system. My last retreat made 60% more revenue than the one before it.', '+60% revenue', 1),
  ('James M.', 'Wellness Retreat Founder',   'Costa Rica', 'JM', '#6366f1', 'The automation alone saved us 15 hours per retreat. But the real win was the participant experience — people are shocked by how professional and seamless it feels from booking to arrival.', '15hrs saved / retreat', 2),
  ('Aiko K.',  'Corporate Retreat Director', 'London',     'AK', '#4338ca', 'We went from running 4 retreats a year to 11. Cohorts made that possible. The scaling system is what separated us from every other retreat operator we know.', '4 → 11 retreats/year', 3);

-- STATS
insert into site_stats (value, label, sort_order) values
  ('340%',  'Average revenue increase in year 1', 1),
  ('12hrs', 'Saved per retreat on admin work',    2),
  ('94%',   'Participant satisfaction rate',      3),
  ('500+',  'Retreats live on the OS',            4);
