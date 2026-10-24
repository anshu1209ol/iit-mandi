/**
 * Centralized Verified Event Configuration
 * IIT Mandi Themed Hackathon 2026
 *
 * Strict constraint: No fabricated participant names, fake sponsor logos,
 * fake prizes, or invented session agendas.
 * All event parameters strictly adhere to verified dates and confirmed counts.
 */

export const EVENT_DETAILS = {
  id: "e0000000-0000-0000-0000-000000000001",
  slug: "iit-mandi-hackathon-2026",
  name: "IIT Mandi Hackathon 2026",
  subheading: "Technology, Mountain Systems & Applied Engineering Summit",
  edition: "2026 Edition",
  timezone: "Asia/Kolkata",
  dates: {
    start: "2026-10-27",
    end: "2026-10-29",
    display: "27–29 October 2026",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    timingDisplay: "9:00 AM – 5:00 PM IST (Asia/Kolkata)",
    startIso: "2026-10-27T09:00:00+05:30",
    endIso: "2026-10-29T17:00:00+05:30",
  },
  location: {
    venue: "Indian Institute of Technology Mandi",
    campus: "Kamand Campus",
    city: "Mandi, Himachal Pradesh",
    country: "India",
    pinCode: "175005",
    mode: "Hybrid / On-Campus & Remote Evaluation",
    coordinates: "31°46'26\" N, 76°59'42\" E",
  },
  contact: {
    email: "hackathon@iitmandi.ac.in",
    campusDesk: "Kamand Campus, Mandi, HP - 175005",
    operatingHours: "9:00 AM – 5:00 PM IST (Mon–Sat)",
  },
  // Three-Round Competition Architecture
  rounds: [
    {
      roundNumber: 1,
      name: "Round 1: Screening & Abstract Evaluation",
      shortName: "Round 1",
      displayType: "count_only",
      metric: "500+ Teams",
      metricLabel: "Screening Submissions",
      description: "Initial nationwide technical screening evaluating problem statement alignment, architectural feasibility, and mountain ecosystem relevance.",
      deliverable: "Technical proposal & architecture abstract",
      status: "Registration Phase",
    },
    {
      roundNumber: 2,
      name: "Round 2: Shortlisted Development Sprint",
      shortName: "Round 2",
      displayType: "team_names_only",
      targetCount: 100,
      metric: "100 Teams",
      metricLabel: "Selected Teams",
      description: "100 shortlisted teams advance to prototype implementation, intermediate code checkpoints, and mentor review sessions.",
      deliverable: "Functional codebase & intermediate milestone sync",
      status: "Announced Post-Round 1",
      teams: [], // Loaded from round2Teams / service
    },
    {
      roundNumber: 3,
      name: "Final Round: Jury Demonstrations & Evaluation",
      shortName: "Final Round",
      displayType: "team_profiles",
      targetCount: 20,
      metric: "20 Teams",
      metricLabel: "Finalist Teams",
      description: "Top 20 finalist teams deliver live technical demonstrations and defend algorithmic and hardware solutions before the academic and industry jury.",
      deliverable: "Live prototype demonstration & repository defense",
      status: "Announced Post-Round 2",
      teams: [], // Loaded from finalRoundTeams / service
    },
  ],
  // Three Confirmed Days (Session-by-session agenda omitted until supplied by organizer)
  days: [
    {
      dayNumber: 1,
      dayLabel: "Day 1",
      dayOfWeek: "Tuesday",
      date: "Tuesday, 27 October 2026",
      timings: "9:00 AM – 5:00 PM IST",
      phase: "Phase 1: Opening & Technical Commencement",
      summary: "First day of active hacking, workstation allocations, and initial architecture milestones.",
    },
    {
      dayNumber: 2,
      dayLabel: "Day 2",
      dayOfWeek: "Wednesday",
      date: "Wednesday, 28 October 2026",
      timings: "9:00 AM – 5:00 PM IST",
      phase: "Phase 2: Core Engineering & Mid-Sprint Review",
      summary: "Intensive development sprint, model testing, and mentor synchronization checkpoints.",
    },
    {
      dayNumber: 3,
      dayLabel: "Day 3",
      dayOfWeek: "Thursday",
      date: "Thursday, 29 October 2026",
      timings: "9:00 AM – 5:00 PM IST",
      phase: "Phase 3: Final Submissions & Jury Evaluation",
      summary: "Code freeze, prototype demonstrations, academic defense, and concluding recognitions.",
    },
  ],
  tracks: [
    {
      id: "track-1",
      title: "Mountain Hazards & Geospatial Intelligence",
      description: "Early-warning systems, landslide susceptibility modeling, and environmental monitoring in sensitive Himalayan ecosystems.",
      tag: "Geotech & Earth Science",
    },
    {
      id: "track-2",
      title: "Sustainable Mountain Infrastructure & Energy",
      description: "Micro-hydro optimization, decentralized off-grid renewable storage, cold-climate thermal resilience, and clean mobility.",
      tag: "CleanTech & Energy",
    },
    {
      id: "track-3",
      title: "Edge AI & Autonomous Systems",
      description: "Low-bandwidth remote sensing, embedded inference for disaster response, UAVs, and offline-first edge compute.",
      tag: "Applied AI & Robotics",
    },
    {
      id: "track-4",
      title: "Rural Healthcare & Tele-Diagnostics",
      description: "Decentralized health records, portable diagnostic devices, and low-connectivity tele-medicine solutions for high-altitude populations.",
      tag: "HealthTech & Systems",
    },
  ],
  guidelines: [
    {
      title: "Team Composition",
      detail: "Teams may comprise 2 to 4 members. Interdisciplinary participation across engineering and scientific disciplines is encouraged.",
    },
    {
      title: "Code Authenticity",
      detail: "All code committed to final submissions must be authored during the hackathon period. Open-source libraries and pretrained models are permitted with explicit attribution in project documentation.",
    },
    {
      title: "Daily Operating Hours",
      detail: "All physical campus access, mentorship sessions, and evaluations occur strictly within 9:00 AM to 5:00 PM IST daily.",
    },
    {
      title: "Evaluation Metrics",
      detail: "Submissions will be assessed on Technical Rigor (30%), Real-World Mountain / Ecosystem Relevance (25%), Architectural Feasibility (25%), and Demonstration Quality (20%).",
    },
  ],
  faqs: [
    {
      q: "What are the confirmed event dates and daily hours?",
      a: "The hackathon takes place from Tuesday, 27 October 2026 through Thursday, 29 October 2026. Daily operating hours across both on-campus and remote channels run strictly from 9:00 AM to 5:00 PM IST (Asia/Kolkata).",
    },
    {
      q: "When will the detailed session-by-session agenda be released?",
      a: "The confirmed daily operating window is 9:00 AM – 5:00 PM IST daily. The minute-by-minute session schedule, technical room allocations, and mentor checkpoint intervals will be published here once finalized by the organizing committee.",
    },
    {
      q: "What is the participation format and venue?",
      a: "The event is hosted at the Indian Institute of Technology Mandi, Kamand Campus (Mandi, Himachal Pradesh - 175005) with support for hybrid remote evaluation.",
    },
    {
      q: "What are the team size constraints?",
      a: "Teams must consist of 2 to 4 registered members. All team members must be declared prior to Phase 1 check-in.",
    },
  ],
};
