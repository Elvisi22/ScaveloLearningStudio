/**
 * Advertised group classes. Enrollment is handled personally by the instructor,
 * so update `seatsTaken` and `status` here as places are confirmed.
 */

export type ClassStatus = "UPCOMING" | "ENROLLMENT_OPEN" | "FULLY_BOOKED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type GroupClass = {
  id: string;
  programSlug: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  schedule: string;
  timezone: string;
  sessions: number;
  capacity: number;
  seatsTaken: number;
  enrollmentDeadline: string; // YYYY-MM-DD
  /** Overrides the program's group price for this class when set. */
  price?: number;
  status: ClassStatus;
};

export const groupClasses: GroupClass[] = [
  {
    id: "java-foundations-jan-2027",
    programSlug: "java-foundations",
    name: "Java Foundations — Winter cohort",
    startDate: "2027-01-12",
    endDate: "2027-02-11",
    schedule: "Tuesdays & Thursdays · 18:30 – 20:00",
    timezone: "Europe/Tirane",
    sessions: 10,
    capacity: 8,
    seatsTaken: 5,
    enrollmentDeadline: "2027-01-05",
    status: "ENROLLMENT_OPEN",
  },
  {
    id: "presenting-jan-2027",
    programSlug: "presenting-technical-ideas",
    name: "Presenting Technical Ideas — January workshop",
    startDate: "2027-01-20",
    endDate: "2027-02-24",
    schedule: "Wednesdays · 18:00 – 19:30",
    timezone: "Europe/Tirane",
    sessions: 6,
    capacity: 8,
    seatsTaken: 2,
    enrollmentDeadline: "2027-01-13",
    status: "ENROLLMENT_OPEN",
  },
  {
    id: "data-analysis-feb-2027",
    programSlug: "data-analysis-with-python",
    name: "Data Analysis with Python — February cohort",
    startDate: "2027-02-01",
    endDate: "2027-03-03",
    schedule: "Mondays & Wednesdays · 19:00 – 20:30",
    timezone: "Europe/Tirane",
    sessions: 10,
    capacity: 10,
    seatsTaken: 3,
    enrollmentDeadline: "2027-01-25",
    status: "ENROLLMENT_OPEN",
  },
  {
    id: "architecture-spring-2027",
    programSlug: "modern-software-architecture",
    name: "Modern Software Architecture — Spring seminar",
    startDate: "2027-03-06",
    endDate: "2027-04-24",
    schedule: "Saturdays · 10:00 – 12:00",
    timezone: "Europe/Tirane",
    sessions: 8,
    capacity: 6,
    seatsTaken: 6,
    enrollmentDeadline: "2027-02-27",
    status: "FULLY_BOOKED",
  },
  {
    id: "spring-boot-apr-2027",
    programSlug: "spring-boot-in-practice",
    name: "Spring Boot in Practice — April cohort",
    startDate: "2027-04-13",
    endDate: "2027-05-20",
    schedule: "Tuesdays & Thursdays · 19:00 – 20:30",
    timezone: "Europe/Tirane",
    sessions: 12,
    capacity: 8,
    seatsTaken: 0,
    enrollmentDeadline: "2027-04-06",
    status: "UPCOMING",
  },
];

export const CLASS_STATUS_LABELS: Record<ClassStatus, string> = {
  UPCOMING: "Opening soon",
  ENROLLMENT_OPEN: "Enrollment open",
  FULLY_BOOKED: "Fully booked",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
