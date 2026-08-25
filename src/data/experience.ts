/**
 * The timeline on /experience. Newest first, ordered by end date to match a
 * resume — the UNSW tutoring overlaps the Loch Safety role.
 *
 * `logo` is a path in public/logos/. Leave it off and the timeline falls back
 * to a monogram tile, which is what Loch Safety gets: the company wound up in
 * 2024 and never had a logo online.
 */
export interface Role {
  firm: string;
  title: string;
  location?: string;
  /** Shown verbatim, so the range reads the way it does on the resume. */
  period: string;
  /** Sorting and the `datetime` attribute; the month the role started. */
  start: string;
  logo?: string;
  /** Falls back to the first letters of the firm name. */
  monogram?: string;
}

export const ROLES: Role[] = [
  {
    firm: "Jane Street",
    title: "Strategy and Product Intern",
    location: "Hong Kong",
    period: "May 2026 – Aug 2026",
    start: "2026-05",
    logo: "/logos/jane-street.svg",
  },
  {
    firm: "TikTok",
    title: "iOS Mobile Engineer Intern",
    location: "Sydney",
    period: "Feb 2026 – May 2026",
    start: "2026-02",
    logo: "/logos/tiktok.png",
  },
  {
    firm: "Google",
    title: "Software Engineer Intern",
    location: "Sydney",
    period: "Nov 2025 – Feb 2026",
    start: "2025-11",
    logo: "/logos/google.svg",
  },
  {
    firm: "UNSW School of Computer Science",
    title: "Seminar Tutor",
    location: "Sydney",
    period: "Jan 2024 – Nov 2025",
    start: "2024-01",
    logo: "/logos/unsw.png",
  },
  {
    firm: "Loch Safety",
    title: "Full-Stack Developer",
    location: "Sydney",
    period: "May 2024 – Nov 2024",
    start: "2024-05",
    monogram: "LS",
  },
];
