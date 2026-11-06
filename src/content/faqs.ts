export type Faq = { question: string; answer: string; category: string; featured?: boolean };

export const faqs: Faq[] = [
  {
    category: "Getting started",
    featured: true,
    question: "How does Scavelo Learning Studio work?",
    answer:
      "You explore the programs on this website and submit an application for the one that interests you. The instructor reviews every application personally and contacts you to discuss your goals, the best format, scheduling and pricing. Once your place is confirmed, you are invited to the Slack workspace where your live lessons take place.",
  },
  {
    category: "Getting started",
    question: "Do I need to create an account?",
    answer:
      "No. There are no accounts or logins on this website. You only share the information in the application form, and everything after that is arranged personally with the instructor.",
  },
  {
    category: "Getting started",
    featured: true,
    question: "How do I enroll?",
    answer:
      "Submit an application for the program and format you prefer. Applying is free and non-binding. Enrollment is confirmed personally by the instructor after a short conversation — nothing is booked or charged automatically.",
  },
  {
    category: "Getting started",
    question: "How do I book a private lesson?",
    answer:
      "Choose “Private 1-on-1” in the application form, or use “Book a private lesson”. Share your availability and the instructor will propose times that suit you, together with the package that best fits your goals.",
  },
  {
    category: "Getting started",
    question: "What happens after I apply?",
    answer:
      "You receive your application reference on screen straight away. The instructor reviews your application and contacts you within two business days using your preferred contact method. If a program or class isn't the right fit, you'll be told honestly and pointed to a better option.",
  },
  {
    category: "Lessons & formats",
    featured: true,
    question: "Where are the lessons held?",
    answer:
      "Lessons take place live in Slack. The instructor presents from PowerPoint by sharing their screen in a Slack huddle, and all communication — questions, announcements and resources — stays in your Slack channel. You only need the free Slack app and a stable internet connection.",
  },
  {
    category: "Lessons & formats",
    featured: true,
    question: "What is the difference between private and group lessons?",
    answer:
      "Private lessons are one-to-one: the program, pace and schedule are built entirely around you. Group lessons are small cohorts that follow a structured schedule, with discussion and collaboration at the centre. Both are taught live by the instructor.",
  },
  {
    category: "Lessons & formats",
    question: "Are any lessons pre-recorded?",
    answer:
      "No. Every lesson is taught live by the instructor. This is a deliberate choice: live teaching means your questions are answered when they matter and the lesson adapts to you.",
  },
  {
    category: "Slack & materials",
    featured: true,
    question: "Why is Slack used?",
    answer:
      "Slack gives every student a calm, organised place to learn: live sessions in huddles, channels for each program and cohort, a private channel for one-to-one students, and direct access to the instructor between lessons. It's familiar, free to use and works on every device.",
  },
  {
    category: "Slack & materials",
    question: "How are PowerPoint presentations delivered?",
    answer:
      "The instructor teaches from carefully prepared PowerPoint presentations, shown live during the session. You don't need PowerPoint yourself. Where the instructor makes them available, presentations are shared afterwards in your Slack channel, usually as PDF.",
  },
  {
    category: "Slack & materials",
    question: "Can I access previous presentations?",
    answer:
      "Materials the instructor chooses to share stay available in your Slack channel, so you can return to them at any time during your program.",
  },
  {
    category: "Scheduling & policies",
    question: "How does payment work?",
    answer:
      "Nothing is paid on this website. Pricing is confirmed personally once your application has been reviewed, and payment details are shared directly by the instructor when your place is confirmed.",
  },
  {
    category: "Scheduling & policies",
    question: "Can I reschedule a lesson?",
    answer:
      "Private lessons can be rescheduled with reasonable notice, normally at least 24 hours. Group sessions follow a fixed schedule, so they can't be moved for individual students — but see below for what happens if you miss one.",
  },
  {
    category: "Scheduling & policies",
    question: "What happens if I miss a class?",
    answer:
      "Let the instructor know in Slack. You'll receive the session's materials where available and can bring any questions to the channel or the next session, so you never fall behind.",
  },
  {
    category: "Scheduling & policies",
    question: "How do I contact the instructor?",
    answer:
      "Before enrolling, send a message through the contact form and the instructor will reply personally. Once enrolled, you can reach the instructor directly in Slack.",
  },
];
