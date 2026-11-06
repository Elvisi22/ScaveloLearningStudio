/** Editorial copy used across the homepage and marketing pages. */

export const hero = {
  eyebrow: "Private academy · Instructor-led",
  title: "Learn directly from the instructor.",
  titleAccent: "Nothing in between.",
  subtitle:
    "Private 1-on-1 lessons and small group classes, taught live and in depth. Every program is shaped around the people in the room — never a pre-recorded course.",
  primaryCta: { label: "Explore programs", href: "/programs" },
  secondaryCta: { label: "Book a private lesson", href: "/apply?format=PRIVATE&intent=CONSULTATION" },
  highlights: ["Live, instructor-led sessions", "Private or small groups", "A dedicated Slack community"],
};

export const introduction = {
  eyebrow: "The approach",
  title: "An academy built around one conversation at a time.",
  body: "Scavelo Learning Studio exists for people who want more than content. Every lesson is prepared and delivered personally by the instructor, adapted to your level, and followed up between sessions. You are never a seat number.",
  pillars: [
    {
      title: "Taught, not streamed",
      body: "Every session is live and instructor-led. Questions are answered in the moment, and the lesson bends to what you need.",
    },
    {
      title: "Prepared with care",
      body: "Lessons are delivered through carefully built PowerPoint presentations — clear structure, worked examples and material worth revisiting.",
    },
    {
      title: "Supported in between",
      body: "A private Slack workspace keeps you close to the instructor and your peers: questions, resources and announcements in one calm place.",
    },
  ],
};

export const formats = {
  eyebrow: "Two ways to learn",
  title: "Choose the format that suits you.",
  body: "Both formats are taught live by the instructor with the same preparation and care. The difference is who is in the room.",
  private: {
    eyebrow: "Private 1-on-1",
    title: "Lessons shaped entirely around you.",
    body: "Your goals, your pace, your schedule. Private lessons give you the instructor's full attention and a program adapted to exactly where you are.",
    benefits: [
      "Personalised teaching built on your objectives",
      "Individual attention in every minute of the session",
      "Lessons adapted to your current level",
      "Flexible scheduling across time zones",
      "Direct communication with the instructor on Slack",
    ],
    cta: { label: "Apply for private lessons", href: "/apply?format=PRIVATE" },
    learnMore: "/private-lessons",
  },
  group: {
    eyebrow: "Small groups",
    title: "Learn alongside people as committed as you.",
    body: "Small, structured cohorts that meet on a fixed schedule. You learn from the instructor and from each other, with discussion at the centre of every session.",
    benefits: [
      "Collaborative discussions and shared problem-solving",
      "Structured sessions on a fixed schedule",
      "Group activities, exercises and peer review",
      "A dedicated Slack channel for your cohort",
      "Shared resources and session materials",
    ],
    cta: { label: "Apply for group lessons", href: "/apply?format=GROUP" },
    learnMore: "/group-classes",
  },
};

export const steps = {
  eyebrow: "How it works",
  title: "From first visit to first lesson.",
  items: [
    {
      title: "Explore the programs",
      body: "Browse the catalogue, compare private and group formats, and find the program that fits your goals.",
    },
    {
      title: "Submit your application",
      body: "Tell us about your level, objectives and availability. It takes about five minutes — no account, no payment.",
    },
    {
      title: "Speak with the instructor",
      body: "The instructor reviews every application personally and contacts you to discuss format, schedule and pricing.",
    },
    {
      title: "Begin on Slack",
      body: "Once confirmed, you're invited to the Slack workspace, where your live, PowerPoint-led sessions take place.",
    },
  ],
};

export const tools = {
  eyebrow: "Where learning happens",
  title: "Two familiar tools. One considered experience.",
  body: "There is no new platform to learn. Teaching happens in Slack, with lessons presented live from PowerPoint.",
  slack: {
    title: "Slack — your classroom and community",
    body: "Live sessions, questions, announcements and resources all live in a private Slack workspace shared with the instructor and your fellow students.",
    points: [
      "Live sessions held in Slack huddles",
      "A dedicated channel for each program and cohort",
      "A private channel for 1-on-1 students",
      "Announcements, reminders and shared resources",
    ],
  },
  powerpoint: {
    title: "PowerPoint — the lesson itself",
    body: "The instructor teaches live from carefully prepared presentations, designed for clarity and built to be revisited after the session.",
    points: [
      "Structured, visual explanations",
      "Worked examples and in-session exercises",
      "Slides shared after lessons at the instructor's discretion",
      "Every deck prepared for your group or for you",
    ],
  },
  note: "Access to Slack and lesson materials is arranged personally by the instructor once your place is confirmed.",
};

export const benefits = {
  eyebrow: "Why Scavelo",
  title: "The difference a teacher makes.",
  items: [
    { title: "Instructor-led, always", body: "No recordings, no assistants. You learn directly from the person who designed the program." },
    { title: "Adapted to your level", body: "Lessons start where you are — and move at the pace that lets ideas stick." },
    { title: "Small by design", body: "Groups are capped so that every student is seen, heard and challenged." },
    { title: "A calm community", body: "A focused Slack workspace without noise, where questions are always welcome." },
    { title: "Materials worth keeping", body: "Presentations and resources designed to be useful long after the lesson ends." },
    { title: "Personal follow-up", body: "Feedback, guidance and encouragement between sessions, not just during them." },
  ],
};

export const closing = {
  title: "Your place is waiting.",
  body: "Applications take about five minutes. The instructor will personally be in touch within two business days.",
  primary: { label: "Apply now", href: "/apply" },
  secondary: { label: "Ask a question", href: "/contact" },
};

export const privatePackages = [
  {
    id: "SINGLE",
    name: "Single lesson",
    lessons: 1,
    description: "A focused session on one topic, problem or question.",
    benefits: ["Ideal to try the format", "Targeted help on a specific need"],
  },
  {
    id: "PACK_3",
    name: "Three lessons",
    lessons: 3,
    description: "Enough time to work through a topic properly.",
    benefits: ["A short, structured plan", "Slack support between lessons"],
  },
  {
    id: "PACK_5",
    name: "Five lessons",
    lessons: 5,
    description: "The most popular choice for meaningful progress.",
    benefits: ["A personal learning plan", "Exercises and feedback", "Slack support between lessons"],
    highlight: true,
  },
  {
    id: "PACK_10",
    name: "Ten lessons",
    lessons: 10,
    description: "A complete program, taught entirely around you.",
    benefits: ["Full program at your pace", "Priority scheduling", "Detailed progress reviews"],
  },
] as const;

export type PrivatePackageId = (typeof privatePackages)[number]["id"];
