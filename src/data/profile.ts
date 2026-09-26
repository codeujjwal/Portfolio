/**
 * Everything the site says lives here.
 * Edit this file to change content: the home page, resume page, structured data,
 * llms.txt and sitemap all read from it.
 */

export const person = {
  name: 'Ujjwal Sharma',
  first: 'Ujjwal',
  last: 'Sharma',
  handle: 'codeujjwal',
  role: 'Forward Deployed Engineer',
  headline: 'Forward deployed engineer building AI voice agents at Lemu AI.',
  description:
    'Ujjwal Sharma is a forward deployed engineer in Delhi with 5+ years across fintech, ERP and field apps. He builds AI voice agents at Lemu AI and AI workflows at Asian Footwears.',
  email: 'hello@codeujjwal.in',
  site: 'https://codeujjwal.in',
  photo: '/images/ujjwal-sharma.jpg',
  avatar: '/images/ujjwal-avatar-160.webp',
  location: { city: 'Delhi', region: 'Delhi', country: 'IN', lat: '28.6139° N', lng: '77.2090° E', tz: 'Asia/Kolkata' },
  since: 'June 2021',
  links: {
    linkedin: 'https://www.linkedin.com/in/codeujjwal',
    github: 'https://github.com/codeujjwal',
  },
  googleVerification: 'w6PdVhuRWH2q-wZ66mmBNl61UCMpw1ZgEY7EC1x8wu8',
};

export const hero = {
  caption: 'I turn how a business actually runs into software its people want to use.',
  facts: [
    { k: 'Now', v: 'Building Lemu AI', href: 'https://lemuai.com' },
    { k: 'Day job', v: 'FDE, Asian Footwears', href: 'https://asianfootwears.com' },
    { k: 'Since', v: 'June 2021 · Delhi' },
  ],
};

/**
 * The 20-second intro.
 * Drop your recording at public/audio/intro.mp3 and the play button uses it:
 * the name and waveform follow your real voice. Optional: public/audio/intro.vtt
 * with cue timings for exact captions. Without a VTT, these lines are spread
 * across the recording by word count. Without an mp3, the intro plays silently.
 */
export const intro = {
  audio: '/audio/intro.mp3',
  cues: '/audio/intro.vtt',
  lines: [
    'I started coding in tenth grade.',
    'By my second year of college, I was shipping it for a living.',
    "Five years on, I've built CRMs, payment flows, lending tools and sales trackers.",
    "Today I'm building Lemu AI, where voice agents pick up the phone and get real work done.",
    'Want to build something?',
    'Send me a postcard.',
  ],
};

export const transcript = [
  { who: 'you', t: '00:02', say: 'So what do you actually do?' },
  { who: 'me', t: '00:05', say: 'I sit with the people who run the business, find the work that eats their day, and ship software that takes it off their plate.' },
  { who: 'you', t: '00:14', say: 'And lately?' },
  { who: 'me', t: '00:16', say: "Lately that software talks. At Lemu AI we build voice agents that pull up the customer's history, follow the company's workflow and get it done while the caller is still on the line." },
  { who: 'you', t: '00:29', say: 'And before that?' },
  { who: 'me', t: '00:31', say: 'Fintech and manufacturing. A lending platform carrying ₹400+ crore in loans, a jewellery marketplace with 1,000+ listings, and the ERP, sales and distributor apps a footwear company runs on.' },
] as const;

export const method = {
  thesis: "Forward deployed engineer. I go where the problem is, work next to the people who have it, and ship until it's solved.",
  steps: [
    { n: '01', t: 'Embed', d: 'Sit with the people doing the work, on their floor and in their tools.' },
    { n: '02', t: 'Find', d: 'Find the task that eats the most hours or costs the most money.' },
    { n: '03', t: 'Ship', d: 'Prototype in days, put it in real hands, fix what breaks.' },
    { n: '04', t: 'Hold', d: 'Stay until it runs without me, then hand it over with docs.' },
  ],
};

export type Figure = { value: number; prefix?: string; suffix?: string; label: string };
export type Deployment = {
  no: string;
  company: string;
  url?: string;
  place: string;
  coords?: string;
  when: string;
  start: string; // ISO month, for structured data and the resume
  end?: string;
  headline: string;
  roles: { title: string; years: string }[];
  brief: string;
  listLabel: string;
  items: { t: string; d: string }[];
  figs?: Figure[];
  stack: string[];
};

export const deployments: Deployment[] = [
  {
    no: '05',
    company: 'Lemu AI',
    url: 'https://lemuai.com',
    place: 'Delhi',
    coords: '28.6139° N 77.2090° E',
    when: 'Jul 2026 → Now',
    start: '2026-07',
    headline: 'Voice agents that finish the job.',
    roles: [{ title: 'Builder', years: '2026 →' }],
    brief:
      'Lemu lets businesses build AI voice agents that understand context, take actions and follow up. Teams design the conversation visually, connect their data and watch every call from first prompt to closed call.',
    listLabel: 'The product',
    items: [
      { t: 'Visual workflow builder', d: 'Design a conversation with start, agent and end nodes.' },
      { t: 'Context from your stack', d: 'CRMs, APIs and tables, plus Slack, Jira, HubSpot and Salesforce.' },
      { t: 'Memory across calls', d: 'Agents carry context from one conversation to the next.' },
      { t: 'Watch every run', d: 'Live monitoring and full transcripts for every call.' },
    ],
    stack: ['Voice', 'LLMs', 'Agents', 'Integrations'],
  },
  {
    no: '04',
    company: 'Asian Footwears',
    url: 'https://asianfootwears.com',
    place: 'Gurugram',
    coords: '28.4595° N 77.0266° E',
    when: 'Jan 2025 → Now',
    start: '2025-01',
    headline: 'The software a footwear company runs on.',
    roles: [
      { title: 'Forward Deployed Engineer', years: '2026 →' },
      { title: 'Senior Software Engineer', years: '2025' },
    ],
    brief:
      'Embedded with business and product teams to turn operational problems into production software. In 2026 the work moved to AI applications and agentic workflows.',
    listLabel: 'Shipped',
    items: [
      { t: 'Udyog', d: 'Vendor app on iOS and Android for bidding on material requirements.' },
      { t: 'SalesTrack', d: 'Field sales with GPS tracking, attendance and order management.' },
      { t: 'Tashan', d: 'Distributor portal on mobile and web: orders, transactions, schemes.' },
      { t: 'ERP + reports', d: 'User and role management, attendance and 20+ features, plus company-wide analytics.' },
    ],
    figs: [
      { value: 20, suffix: '+', label: 'ERP modules' },
      { value: 4, label: 'Apps shipped' },
    ],
    stack: ['React', 'React Native', 'TypeScript', 'Node', 'AI agents'],
  },
  {
    no: '03',
    company: 'Ruptok Fintech',
    place: 'Delhi',
    coords: '28.6139° N 77.2090° E',
    when: 'Oct 2022 → Dec 2024',
    start: '2022-10',
    end: '2024-12',
    headline: 'Money, gold and loans at scale.',
    roles: [{ title: 'Software Engineer', years: '2022 – 24' }],
    brief:
      'Led frontend across accounting, invoicing and payments SaaS, and managed a team of four frontend engineers on planning, reviews and delivery.',
    listLabel: 'Shipped',
    items: [
      { t: 'Lender platform', d: 'Loan operations for a book worth ₹400+ crore.' },
      { t: 'Jewellery marketplace', d: 'Buy, sell and lend gold, with 1,000+ products listed.' },
      { t: 'Fracto Pay', d: 'Corporate payments: UPI, cards and net banking in one flow.' },
      { t: 'AI OCR', d: 'Pulls structured data out of business documents.' },
    ],
    figs: [
      { value: 400, prefix: '₹', suffix: 'Cr+', label: 'Loans managed' },
      { value: 1000, suffix: '+', label: 'Products listed' },
      { value: 300, suffix: '+', label: 'Staff on workflows' },
    ],
    stack: ['React', 'Redux', 'TypeScript', 'UPI', 'OCR'],
  },
  {
    no: '02',
    company: 'Squareware',
    place: 'Remote',
    when: 'Nov 2021 → Sep 2022',
    start: '2021-11',
    end: '2022-09',
    headline: 'Foundations: components, state, tests.',
    roles: [{ title: 'Frontend Developer', years: '2021 – 22' }],
    brief:
      'Built the habits everything after rests on: reusable parts, predictable state and tests that catch regressions before users do.',
    listLabel: 'Shipped',
    items: [
      { t: 'Component libraries', d: 'Modular frontend architecture for faster, consistent delivery.' },
      { t: 'Redux', d: 'State management for complex, data-driven workflows.' },
      { t: 'Jest + Cypress', d: 'Unit and end-to-end testing practice across the app.' },
    ],
    stack: ['React', 'Redux', 'Jest', 'Cypress'],
  },
  {
    no: '01',
    company: 'RedPositive',
    place: 'Delhi',
    coords: '28.6139° N 77.2090° E',
    when: 'Jun 2021 → Nov 2021',
    start: '2021-06',
    end: '2021-11',
    headline: 'First deploy.',
    roles: [{ title: 'Frontend Intern', years: '2021' }],
    brief: 'Six months shipping frontend features to production, debugging live issues and running regression tests.',
    listLabel: 'Shipped',
    items: [
      { t: 'Production features', d: 'Frontend work on live web applications.' },
      { t: 'Stability', d: 'Debugging and regression testing on every release.' },
    ],
    stack: ['JavaScript', 'React', 'Git'],
  },
];

export const toolkit = {
  tapes: [
    ['AI agents', 'Voice', 'LLM workflows', 'OCR'],
    ['React', 'React Native', 'TypeScript', 'Node'],
    ['ERP', 'Fintech', 'UPI', 'Field apps', 'Reporting'],
  ],
  caps: [
    { h: 'AI and agents', items: ['Voice agents', 'Agentic workflows', 'LLM apps (Gemini and others)', 'Document OCR'] },
    { h: 'Product engineering', items: ['React, React Native', 'TypeScript, Node.js', 'Redux, MobX', 'iOS and Android releases'] },
    { h: 'Delivery', items: ['Jest, Cypress, Maestro', 'Performance work', 'API integrations', 'Leading small teams'] },
  ],
};

export const projects: { name: string; url?: string; d: string }[] = [
  { name: 'SPOCN', url: 'https://spocn.in/', d: 'The AI friend you need. Voice conversations in Hindi and English with companions that remember you.' },
  { name: 'unspocn', url: 'https://unspocn.com/', d: "A clarity tool for couples. Compare your answers side by side and find the conversations you've been avoiding." },
  { name: 'Resumind', url: 'https://resumind.in/', d: 'AI resume builder and cover letter generator, with an ATS check.' },
];

/**
 * The workbench: things that shipped, as objects you can pick up.
 * The object artwork lives in src/components/Workbench.astro (keyed by id);
 * the story that opens on tap comes from here. Items with `live: true` are
 * products with a public link: their story gets a Visit button, and they land
 * first and sit on top. Items without `live` show no link at all.
 */
export type DeskItem = { id: string; k: string; t: string; role: string; body: string; did: string[]; stack: string[]; url?: string; live?: boolean };
export const desk: DeskItem[] = [
  { id: 'lemu', k: '2026 → now · Lemu AI', t: 'Lemu AI', role: 'Builder · Delhi', url: 'https://lemuai.com', live: true,
    body: "Voice agents businesses build and deploy to handle calls end to end. Teams design the conversation visually, connect their data, and every call ends with the work done.",
    did: ['Visual workflow builder for conversations', 'Context from CRMs, APIs and tables', 'Memory across calls, live monitoring and transcripts'], stack: ['Voice', 'LLMs', 'Agents', 'Integrations'] },
  { id: 'spocn', k: 'Own product · CodeUjjwal Technologies', t: 'SPOCN', role: 'Founder · builder', url: 'https://spocn.in/', live: true,
    body: 'The AI friend you need. Pick a companion with its own voice and personality and just talk, in Hindi or English. It remembers what you told it last time.',
    did: ['Voice-first conversations with natural pacing', 'Eight companions, each with its own voice and style', 'Memory across conversations, kept private', 'The first conversation needs no sign-up'], stack: ['Voice AI', 'LLMs', 'Memory', 'UPI'] },
  { id: 'unspocn', k: 'Side project · latest', t: 'unspocn', role: 'Founder · builder', url: 'https://unspocn.com/', live: true,
    body: "A clarity tool for couples. Both partners answer on their own, then see their answers side by side: the hidden assumptions, what each expects from the future, and the conversations they've been avoiding.",
    did: ['Side-by-side comparison of both answers', 'Five conversation starters picked for the two of you', 'Downloadable PDF report, one purchase for both people'], stack: [] },
  { id: 'resume', k: 'Side project', t: 'Resumind', role: 'Founder · builder', url: 'https://resumind.in/', live: true,
    body: 'An AI resume builder and cover letter generator, with an ATS check that points out what to fix before you apply.',
    did: ['Resume builder with templates', 'Cover letters written for the job', 'ATS check with specific fixes, not generic tips'], stack: ['React', 'PrimeReact', 'Node', 'Gemini'] },
  { id: 'upi', k: '2024 · Ruptok Fintech', t: 'Fracto Pay', role: 'Software Engineer · Delhi', url: 'https://www.fractopay.in/', live: true,
    body: 'A corporate payments platform that brings UPI, cards and net banking into one payment experience.',
    did: ['One payment flow across three rails', 'Led frontend for the SaaS suite: accounting, invoicing, payments'], stack: ['React', 'Redux', 'UPI', 'Payments'] },
  { id: 'erp', k: '2025 · Asian Footwears', t: 'ERP modules', role: 'Senior Software Engineer · Gurugram', url: 'https://asianfootwears.com', live: true,
    body: 'Internal ERP for a footwear manufacturer: user and role management, attendance and 20+ other features, plus a reports app with analytics across the business.',
    did: ['20+ ERP features shipped', 'Company-wide reports web app', 'Worked directly with operations teams'], stack: ['React', 'TypeScript', 'Node'] },
  { id: 'gold', k: '2022 – 2023 · Ruptok Fintech', t: 'Jewellery marketplace', role: 'Software Engineer · Delhi', url: 'https://app.ruptok.com/', live: true,
    body: 'An India-focused marketplace for buying, selling and lending against jewellery, built and scaled to 1,000+ listed products.',
    did: ['Built and scaled the storefront', '1,000+ products listed'], stack: ['React', 'Redux'] },
  { id: 'receipt', k: '2025 · Asian Footwears', t: 'Tashan', role: 'Senior Software Engineer · Gurugram', url: 'https://play.google.com/store/apps/details?id=com.asianlive.tashan&hl=en', live: true,
    body: 'A distributor portal on mobile and web for order tracking, transactions and scheme management.',
    did: ['Orders, transactions and schemes in one place', 'Shipped on mobile and web'], stack: ['React', 'React Native', 'TypeScript'] },
  { id: 'map', k: '2025 · Asian Footwears', t: 'SalesTrack', role: 'Senior Software Engineer · Gurugram', url: 'https://play.google.com/store/apps/details?id=com.asianlive.salestrack&hl=en', live: true,
    body: 'An app for the field sales team with GPS tracking, attendance and order management.',
    did: ['Live location and check-ins', 'Orders placed from the field'], stack: ['React Native', 'Maps', 'Node'] },
  { id: 'ledger', k: '2022 – 2024 · Ruptok Fintech', t: 'Lender platform', role: 'Software Engineer · Delhi',
    body: 'Internal platform for loan operations worth ₹400+ crore, with workflows used by 300+ employees across departments.',
    did: ['₹400+ crore in loans managed through it', 'Workflows for 300+ staff', 'Led a team of four frontend engineers'], stack: ['React', 'TypeScript', 'Redux'] },
];

/**
 * Education. `logo` is the file name (without extension) to look for in
 * public/images/edu/ — drop walsh.svg (or .png / .webp) there and it appears on the card.
 * Until a logo file exists, the card shows a monogram seal instead.
 */
export const education = [
  { years: '2026 – 2029 · In progress', degree: 'Doctor of Business Administration, AI & ML', school: 'Walsh College', logo: 'walsh', mono: 'WC' },
  { years: '2024 – 2025', degree: 'Master of Science, Computer Science', school: 'Woolf University', logo: 'woolf', mono: 'W' },
  { years: '2019 – 2023', degree: 'B.Tech, Computer Science', school: 'Dr. A.P.J. Abdul Kalam Technical University', logo: 'aktu', mono: 'AKTU' },
];

export const certifications = ['React: The Complete Guide', 'Complete Front-End Development', 'JavaScript: From Zero to Hero'];

export const contact = {
  heading: 'Have something that needs shipping?',
  blurb: "Tell me what's slowing your team down. I usually reply within a day, from Delhi.",
  topics: ['Lemu AI', 'A role', 'A project', 'Something else'],
};

export const nav = [
  { label: 'Work', href: '/#deployments' },
  { label: 'Method', href: '/#method' },
  { label: 'Education', href: '/#education' },
  { label: 'Resume', href: '/resume/' },
  { label: 'Contact', href: '/#contact' },
];
