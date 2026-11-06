import { programCovers } from "./media";

/**
 * The program catalogue. Each entry gets its own landing page at /programs/[slug].
 * Prices are indicative and shown publicly; set `price` to null for "on request".
 */

export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type CoverTone = "ivory" | "charcoal" | "claret" | "sand" | "slate";

export type Price = { amount: number; unit: string } | null;

export type Program = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  level: Level;
  shortDescription: string;
  description: string[];
  objectives: string[];
  audience: string[];
  prerequisites: string[];
  curriculum: { title: string; description: string }[];
  duration: string;
  lessonCount: number;
  sessionMinutes: number;
  formats: {
    private: { available: boolean; price: Price };
    group: { available: boolean; price: Price };
  };
  /** When false the program stays visible but applications become "express interest". */
  acceptingApplications: boolean;
  featured: boolean;
  coverTone: CoverTone;
  /** Cover photo: a path in /public (e.g. "/images/programs/java.jpg") or an allowed remote URL. Generated artwork is used when absent. */
  coverImage?: string;
};

const catalogue: Program[] = [
  {
    slug: "java-foundations",
    title: "Java Foundations",
    tagline: "From first principles to confident, idiomatic Java.",
    category: "Software Engineering",
    level: "BEGINNER",
    shortDescription:
      "A rigorous, friendly introduction to programming with Java — the language, the tooling and the habits of a professional developer.",
    description: [
      "Java Foundations is designed for people who want to understand programming properly, not just copy examples. We start with how a program actually runs and build up, lesson by lesson, to writing well-structured object-oriented code you can be proud of.",
      "Every session is taught live, with a carefully prepared presentation, worked examples and short exercises you complete during and between lessons. Questions are answered in the moment — and in Slack between sessions.",
    ],
    objectives: [
      "Write, compile and debug Java programs with confidence",
      "Understand types, control flow, methods and collections",
      "Design small programs with classes, interfaces and encapsulation",
      "Use exceptions, generics and the standard library idiomatically",
      "Read and write unit tests with JUnit",
      "Develop the habits that make code readable for others",
    ],
    audience: [
      "Complete beginners who want a structured, serious start",
      "Self-taught learners who want to fill the gaps",
      "Professionals moving into a technical role",
    ],
    prerequisites: ["No prior programming experience required", "A laptop able to run a modern code editor"],
    curriculum: [
      { title: "How programs run", description: "The JVM, the toolchain and your first program, explained properly." },
      { title: "Thinking in types", description: "Variables, primitives, strings and the decisions a compiler makes for you." },
      { title: "Control flow", description: "Conditions, loops and breaking problems into steps." },
      { title: "Methods & structure", description: "Writing small, named pieces of logic that compose well." },
      { title: "Objects & classes", description: "Modelling the world with state and behaviour." },
      { title: "Collections & generics", description: "Lists, maps and sets — choosing the right structure." },
      { title: "Errors & testing", description: "Exceptions, defensive code and your first unit tests." },
      { title: "A complete project", description: "Bringing it together in a small application you design yourself." },
    ],
    duration: "5 weeks",
    lessonCount: 10,
    sessionMinutes: 90,
    formats: {
      private: { available: true, price: { amount: 75, unit: "per lesson" } },
      group: { available: true, price: { amount: 490, unit: "full program" } },
    },
    acceptingApplications: true,
    featured: true,
    coverTone: "claret",
  },
  {
    slug: "spring-boot-in-practice",
    title: "Spring Boot in Practice",
    tagline: "Build production-grade services the way teams actually do.",
    category: "Software Engineering",
    level: "INTERMEDIATE",
    shortDescription:
      "Design, build and test real REST services with Spring Boot — from project setup to persistence, security and deployment.",
    description: [
      "This program takes you beyond tutorials. Together we build a realistic service step by step, discussing the decisions experienced engineers make along the way: structure, configuration, data access, validation, security and testing.",
      "Lessons combine concise conceptual explanations with live, guided implementation. You leave with a working codebase and a clear mental model of how the pieces fit.",
    ],
    objectives: [
      "Structure a Spring Boot application for long-term maintainability",
      "Expose clean, well-validated REST APIs",
      "Persist data with Spring Data JPA and manage migrations",
      "Secure endpoints with Spring Security",
      "Write meaningful unit, slice and integration tests",
      "Package and prepare a service for deployment",
    ],
    audience: ["Java developers moving into backend work", "Engineers who learned Spring informally", "Teams wanting a shared foundation"],
    prerequisites: ["Comfortable with core Java and object-oriented design", "Basic familiarity with SQL is helpful"],
    curriculum: [
      { title: "Anatomy of a Spring Boot app", description: "Auto-configuration, dependency injection and project layout." },
      { title: "Designing the API", description: "Resources, DTOs, validation and error handling." },
      { title: "Persistence", description: "Entities, repositories, transactions and schema migrations." },
      { title: "Security", description: "Authentication, authorisation and common pitfalls." },
      { title: "Testing strategy", description: "What to test, where, and how to keep tests fast." },
      { title: "Ready for production", description: "Configuration, observability and packaging." },
    ],
    duration: "6 weeks",
    lessonCount: 12,
    sessionMinutes: 90,
    formats: {
      private: { available: true, price: { amount: 85, unit: "per lesson" } },
      group: { available: true, price: { amount: 690, unit: "full program" } },
    },
    acceptingApplications: true,
    featured: false,
    coverTone: "slate",
  },
  {
    slug: "modern-software-architecture",
    title: "Modern Software Architecture",
    tagline: "Make design decisions you can explain and defend.",
    category: "Software Engineering",
    level: "ADVANCED",
    shortDescription:
      "A seminar-style program on architecture for experienced engineers: boundaries, trade-offs, distributed systems and communicating design.",
    description: [
      "Architecture is the practice of making a few important decisions well. In this program we study the principles behind them — modularity, coupling, consistency and evolution — through real case studies and structured discussion.",
      "Sessions are deliberately small and conversational. You bring your own systems and questions; the instructor brings frameworks, examples and honest experience.",
    ],
    objectives: [
      "Reason clearly about trade-offs instead of following fashions",
      "Define module and service boundaries that age well",
      "Understand consistency, messaging and failure in distributed systems",
      "Document decisions with lightweight architecture records",
      "Present and defend a design to technical and non-technical audiences",
    ],
    audience: ["Senior engineers and tech leads", "Engineers stepping into an architect role", "Founders responsible for technical direction"],
    prerequisites: ["Several years of professional software development", "Experience working on a production system"],
    curriculum: [
      { title: "What architecture is for", description: "Decisions, constraints and the cost of change." },
      { title: "Boundaries & modularity", description: "Cohesion, coupling and the modular monolith." },
      { title: "Distributed systems, honestly", description: "Messaging, consistency and designing for failure." },
      { title: "Data architecture", description: "Ownership, integration patterns and evolution." },
      { title: "Decision records", description: "Capturing why, not just what." },
      { title: "Communicating design", description: "Diagrams, narratives and stakeholder conversations." },
    ],
    duration: "8 weeks",
    lessonCount: 8,
    sessionMinutes: 120,
    formats: {
      private: { available: true, price: null },
      group: { available: true, price: { amount: 890, unit: "full program" } },
    },
    acceptingApplications: true,
    featured: true,
    coverTone: "charcoal",
  },
  {
    slug: "data-analysis-with-python",
    title: "Data Analysis with Python",
    tagline: "Turn raw data into clear, defensible answers.",
    category: "Data & Analytics",
    level: "BEGINNER",
    shortDescription:
      "Learn to clean, explore, analyse and visualise data with Python, pandas and notebooks — and to communicate what you find.",
    description: [
      "This program teaches the full analytical workflow: asking a good question, preparing messy data, exploring it rigorously and presenting a conclusion others can trust.",
      "Each lesson works through a realistic dataset. You practise between sessions with guided exercises and share questions with the instructor in Slack.",
    ],
    objectives: [
      "Write clear Python for everyday data work",
      "Load, clean and reshape data with pandas",
      "Explore distributions, relationships and outliers",
      "Create honest, readable charts",
      "Summarise findings in a short, persuasive report",
    ],
    audience: ["Analysts moving beyond spreadsheets", "Researchers and students", "Professionals who work with data occasionally"],
    prerequisites: ["No programming experience required", "Comfort with basic arithmetic and spreadsheets"],
    curriculum: [
      { title: "Python for analysis", description: "Just enough Python, taught with data in mind." },
      { title: "Working with pandas", description: "Series, data frames, selection and transformation." },
      { title: "Cleaning data", description: "Missing values, types, duplicates and sanity checks." },
      { title: "Exploratory analysis", description: "Summaries, grouping and asking better questions." },
      { title: "Visualisation", description: "Choosing and designing charts that tell the truth." },
      { title: "Communicating results", description: "From notebook to a concise, credible report." },
    ],
    duration: "5 weeks",
    lessonCount: 10,
    sessionMinutes: 90,
    formats: {
      private: { available: true, price: { amount: 75, unit: "per lesson" } },
      group: { available: true, price: { amount: 520, unit: "full program" } },
    },
    acceptingApplications: true,
    featured: true,
    coverTone: "sand",
  },
  {
    slug: "technical-interview-preparation",
    title: "Technical Interview Preparation",
    tagline: "Walk into your next interview prepared and calm.",
    category: "Career & Communication",
    level: "INTERMEDIATE",
    shortDescription:
      "Personal coaching for coding, system design and behavioural interviews, built around the roles you are applying for.",
    description: [
      "Preparation works best when it is personal. We begin with an honest assessment of where you are, then plan sessions around your target companies, the interview formats you will face and the areas you want to strengthen.",
      "Sessions combine focused teaching with realistic mock interviews and detailed feedback, so every hour moves you measurably closer to an offer.",
    ],
    objectives: [
      "Approach coding problems with a repeatable method",
      "Communicate your reasoning clearly under time pressure",
      "Structure system design answers with confidence",
      "Tell concise, compelling stories about your experience",
      "Receive candid, specific feedback after every mock interview",
    ],
    audience: ["Developers preparing for a new role", "Engineers targeting senior positions", "Graduates entering the job market"],
    prerequisites: ["Working knowledge of at least one programming language"],
    curriculum: [
      { title: "Assessment & plan", description: "Where you are, where you are going, and how we get there." },
      { title: "Problem-solving method", description: "Patterns, complexity and thinking aloud." },
      { title: "System design", description: "A structure for open-ended design conversations." },
      { title: "Behavioural interviews", description: "Preparing stories that are true, specific and memorable." },
      { title: "Mock interviews", description: "Realistic practice with detailed debriefs." },
    ],
    duration: "Flexible",
    lessonCount: 5,
    sessionMinutes: 60,
    formats: {
      private: { available: true, price: { amount: 95, unit: "per lesson" } },
      group: { available: false, price: null },
    },
    acceptingApplications: true,
    featured: false,
    coverTone: "ivory",
  },
  {
    slug: "presenting-technical-ideas",
    title: "Presenting Technical Ideas",
    tagline: "Explain complex things simply — and be remembered for it.",
    category: "Career & Communication",
    level: "ALL_LEVELS",
    shortDescription:
      "A practical workshop on structuring, designing and delivering technical presentations that people understand and act on.",
    description: [
      "Great engineers are often judged by how well they explain their work. This workshop teaches a clear method for turning complex material into a story, designing slides that support rather than distract, and delivering with calm authority.",
      "You will present in every session and receive thoughtful feedback from the instructor and your peers in a supportive, small-group setting.",
    ],
    objectives: [
      "Structure any technical topic as a clear narrative",
      "Design clean, purposeful PowerPoint slides",
      "Use diagrams and examples to make ideas concrete",
      "Handle questions and challenges with composure",
      "Adapt one message to different audiences",
    ],
    audience: ["Engineers, analysts and technical leads", "Anyone who presents to colleagues or clients", "Students preparing a thesis defence"],
    prerequisites: ["None — all levels are welcome"],
    curriculum: [
      { title: "Finding the message", description: "What you want your audience to know, feel and do." },
      { title: "Structure", description: "Narrative patterns for technical material." },
      { title: "Slide design", description: "Typography, layout and restraint in PowerPoint." },
      { title: "Diagrams & data", description: "Showing systems and numbers clearly." },
      { title: "Delivery", description: "Voice, pace, presence and questions." },
      { title: "Final presentations", description: "A complete talk with detailed feedback." },
    ],
    duration: "6 weeks",
    lessonCount: 6,
    sessionMinutes: 90,
    formats: {
      private: { available: false, price: null },
      group: { available: true, price: { amount: 380, unit: "full program" } },
    },
    acceptingApplications: true,
    featured: false,
    coverTone: "ivory",
  },
];

/** Programs with their cover photograph (an explicit `coverImage` wins over the placeholder set in media.ts). */
export const programs: Program[] = catalogue.map((program) => ({ ...program, coverImage: program.coverImage ?? programCovers[program.slug] }));

export const LEVEL_LABELS: Record<Level, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All levels",
};
