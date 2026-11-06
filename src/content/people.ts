/**
 * The instructor profile and student testimonials.
 *
 * IMPORTANT: the testimonials below are samples. Entries marked `sample: true`
 * are shown in development only and are automatically hidden in production
 * builds, so the live site never displays invented reviews. Replace them with
 * real testimonials (with the student's permission) and remove the flag.
 */

export const instructor = {
  name: "Alex Morgan",
  role: "Founder & Lead Instructor",
  /** Optional portrait in /public, e.g. "/images/instructor.jpg". A monogram is shown otherwise. */
  photo: "" as string,
  shortBio:
    "Software engineer, architect and teacher. For more than fifteen years Alex has helped people learn to build software properly — first inside engineering teams, now one student and one small group at a time.",
  bio: [
    "Alex began teaching informally while leading engineering teams, running internal workshops on design and code quality. What started as an occasional session became the most rewarding part of the job — and eventually the job itself.",
    "Scavelo Learning Studio was founded on a simple conviction: people learn best when someone who knows the subject deeply takes the time to teach them personally. Every program is prepared, taught and followed up by Alex, live, in small numbers.",
    "Lessons are delivered with carefully designed PowerPoint presentations and supported between sessions in a private Slack workspace, so students always have a place to ask questions and share progress.",
  ],
  credentials: [
    "15+ years in professional software engineering",
    "Former engineering lead and solution architect",
    "MSc in Computer Science",
    "Mentor and speaker at developer communities",
  ],
  stats: [
    { value: "15+", label: "Years in industry" },
    { value: "1:1", label: "Or groups of up to 10" },
    { value: "100%", label: "Live, instructor-led" },
  ],
  quote: "Good teaching is a conversation. My job is to listen carefully, explain clearly, and never let a question go unanswered.",
  sample: true,
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  programSlug?: string;
  format?: "PRIVATE" | "GROUP";
  featured?: boolean;
  sample?: boolean;
};

const allTestimonials: Testimonial[] = [
  {
    quote:
      "Every lesson felt prepared for me specifically. I had tried courses before, but having someone explain the why — and answer my questions on Slack the same evening — changed everything.",
    name: "Giulia R.",
    role: "Private student, Java Foundations",
    programSlug: "java-foundations",
    format: "PRIVATE",
    featured: true,
    sample: true,
  },
  {
    quote:
      "The group was small enough that nobody could hide, and that was the point. The discussions were as valuable as the slides.",
    name: "Marc D.",
    role: "Group student, Modern Software Architecture",
    programSlug: "modern-software-architecture",
    format: "GROUP",
    featured: true,
    sample: true,
  },
  {
    quote:
      "Clear, calm and incredibly well organised. The presentations are beautiful and I still go back to them months later.",
    name: "Sofia L.",
    role: "Group student, Data Analysis with Python",
    programSlug: "data-analysis-with-python",
    format: "GROUP",
    featured: true,
    sample: true,
  },
  {
    quote: "Five focused sessions and two mock interviews later, I accepted an offer I would not have dared to apply for.",
    name: "Daniel K.",
    role: "Private student, Interview Preparation",
    programSlug: "technical-interview-preparation",
    format: "PRIVATE",
    sample: true,
  },
];

export const testimonials: Testimonial[] =
  process.env.NODE_ENV === "production" ? allTestimonials.filter((t) => !t.sample) : allTestimonials;
