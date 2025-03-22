import type { Campaign, Candidate, Result } from "./types"

export const mockCampaigns: Campaign[] = [
  {
    id: "campaign1",
    title: "CICS Student Council Election 2025",
    description: "Annual election for the College of Informatics and Computing Sciences Student Council",
    deadline: "2025-04-15T23:59:59",
    positions: ["President", "Vice President", "Secretary", "Treasurer", "Public Relations Officer"],
    hasVoted: false,
  },
  {
    id: "campaign2",
    title: "Department Representatives Election",
    description: "Election for department representatives for the academic year 2024-2025",
    deadline: "2025-03-30T23:59:59",
    positions: ["IT Department Rep", "CS Department Rep", "IS Department Rep"],
    hasVoted: true,
  },
  {
    id: "campaign3",
    title: "Student Publication Board Election",
    description: "Election for the student publication board members",
    deadline: "2024-12-15T23:59:59", // Past election
    positions: ["Editor-in-Chief", "Associate Editor", "News Editor", "Features Editor"],
    hasVoted: true,
  },
]

export const mockCandidates: Candidate[] = [
  // Campaign 1 - President
  {
    id: "candidate1",
    campaignId: "campaign1",
    name: "Juan Dela Cruz",
    course: "BS Computer Science",
    position: "President",
    platform: "Enhance student welfare and promote academic excellence",
  },
  {
    id: "candidate2",
    campaignId: "campaign1",
    name: "Maria Santos",
    course: "BS Information Technology",
    position: "President",
    platform: "Create more opportunities for student growth and development",
  },

  // Campaign 1 - Vice President
  {
    id: "candidate3",
    campaignId: "campaign1",
    name: "Pedro Reyes",
    course: "BS Information Systems",
    position: "Vice President",
    platform: "Improve student services and facilities",
  },
  {
    id: "candidate4",
    campaignId: "campaign1",
    name: "Ana Gonzales",
    course: "BS Computer Science",
    position: "Vice President",
    platform: "Strengthen student representation in academic affairs",
  },

  // Campaign 1 - Secretary
  {
    id: "candidate5",
    campaignId: "campaign1",
    name: "Luis Mendoza",
    course: "BS Information Technology",
    position: "Secretary",
    platform: "Enhance communication between students and administration",
  },
  {
    id: "candidate6",
    campaignId: "campaign1",
    name: "Sofia Reyes",
    course: "BS Information Systems",
    position: "Secretary",
    platform: "Improve documentation and transparency in council activities",
  },

  // Campaign 1 - Treasurer
  {
    id: "candidate7",
    campaignId: "campaign1",
    name: "Miguel Torres",
    course: "BS Computer Science",
    position: "Treasurer",
    platform: "Ensure responsible management of student funds",
  },
  {
    id: "candidate8",
    campaignId: "campaign1",
    name: "Isabella Garcia",
    course: "BS Information Technology",
    position: "Treasurer",
    platform: "Increase funding for student activities and events",
  },

  // Campaign 1 - PRO
  {
    id: "candidate9",
    campaignId: "campaign1",
    name: "Gabriel Lim",
    course: "BS Information Systems",
    position: "Public Relations Officer",
    platform: "Strengthen partnerships with industry and alumni",
  },
  {
    id: "candidate10",
    campaignId: "campaign1",
    name: "Sophia Cruz",
    course: "BS Computer Science",
    position: "Public Relations Officer",
    platform: "Improve social media presence and student engagement",
  },

  // Campaign 2 candidates
  {
    id: "candidate11",
    campaignId: "campaign2",
    name: "Marco Diaz",
    course: "BS Information Technology",
    position: "IT Department Rep",
    platform: "Represent IT students' interests and concerns",
  },
  {
    id: "candidate12",
    campaignId: "campaign2",
    name: "Jasmine Reyes",
    course: "BS Information Technology",
    position: "IT Department Rep",
    platform: "Organize more IT-focused events and workshops",
  },
  {
    id: "candidate13",
    campaignId: "campaign2",
    name: "Carlos Tan",
    course: "BS Computer Science",
    position: "CS Department Rep",
    platform: "Advocate for more research opportunities for CS students",
  },
  {
    id: "candidate14",
    campaignId: "campaign2",
    name: "Diana Lee",
    course: "BS Computer Science",
    position: "CS Department Rep",
    platform: "Push for curriculum improvements and industry-relevant training",
  },
  {
    id: "candidate15",
    campaignId: "campaign2",
    name: "Rafael Santos",
    course: "BS Information Systems",
    position: "IS Department Rep",
    platform: "Bridge the gap between academic learning and industry needs",
  },
  {
    id: "candidate16",
    campaignId: "campaign2",
    name: "Bianca Reyes",
    course: "BS Information Systems",
    position: "IS Department Rep",
    platform: "Organize career-oriented activities for IS students",
  },

  // Campaign 3 candidates
  {
    id: "candidate17",
    campaignId: "campaign3",
    name: "Antonio Mercado",
    course: "BS Computer Science",
    position: "Editor-in-Chief",
    platform: "Elevate the quality of student publications",
  },
  {
    id: "candidate18",
    campaignId: "campaign3",
    name: "Camille Lim",
    course: "BS Information Technology",
    position: "Editor-in-Chief",
    platform: "Increase digital presence of student publications",
  },
  {
    id: "candidate19",
    campaignId: "campaign3",
    name: "David Garcia",
    course: "BS Information Systems",
    position: "Associate Editor",
    platform: "Ensure high editorial standards and quality content",
  },
  {
    id: "candidate20",
    campaignId: "campaign3",
    name: "Elena Santos",
    course: "BS Computer Science",
    position: "News Editor",
    platform: "Provide timely and relevant news to the student body",
  },
  {
    id: "candidate21",
    campaignId: "campaign3",
    name: "Francis Torres",
    course: "BS Information Technology",
    position: "Features Editor",
    platform: "Highlight student achievements and college initiatives",
  },
]

export const mockResults: Result[] = [
  // Campaign 1 results
  {
    campaignId: "campaign1",
    position: "President",
    candidateId: "candidate1",
    votes: 245,
  },
  {
    campaignId: "campaign1",
    position: "President",
    candidateId: "candidate2",
    votes: 198,
  },
  {
    campaignId: "campaign1",
    position: "Vice President",
    candidateId: "candidate3",
    votes: 210,
  },
  {
    campaignId: "campaign1",
    position: "Vice President",
    candidateId: "candidate4",
    votes: 233,
  },
  {
    campaignId: "campaign1",
    position: "Secretary",
    candidateId: "candidate5",
    votes: 189,
  },
  {
    campaignId: "campaign1",
    position: "Secretary",
    candidateId: "candidate6",
    votes: 254,
  },
  {
    campaignId: "campaign1",
    position: "Treasurer",
    candidateId: "candidate7",
    votes: 267,
  },
  {
    campaignId: "campaign1",
    position: "Treasurer",
    candidateId: "candidate8",
    votes: 176,
  },
  {
    campaignId: "campaign1",
    position: "Public Relations Officer",
    candidateId: "candidate9",
    votes: 201,
  },
  {
    campaignId: "campaign1",
    position: "Public Relations Officer",
    candidateId: "candidate10",
    votes: 242,
  },

  // Campaign 2 results
  {
    campaignId: "campaign2",
    position: "IT Department Rep",
    candidateId: "candidate11",
    votes: 156,
  },
  {
    campaignId: "campaign2",
    position: "IT Department Rep",
    candidateId: "candidate12",
    votes: 143,
  },
  {
    campaignId: "campaign2",
    position: "CS Department Rep",
    candidateId: "candidate13",
    votes: 128,
  },
  {
    campaignId: "campaign2",
    position: "CS Department Rep",
    candidateId: "candidate14",
    votes: 135,
  },
  {
    campaignId: "campaign2",
    position: "IS Department Rep",
    candidateId: "candidate15",
    votes: 112,
  },
  {
    campaignId: "campaign2",
    position: "IS Department Rep",
    candidateId: "candidate16",
    votes: 98,
  },

  // Campaign 3 results
  {
    campaignId: "campaign3",
    position: "Editor-in-Chief",
    candidateId: "candidate17",
    votes: 187,
  },
  {
    campaignId: "campaign3",
    position: "Editor-in-Chief",
    candidateId: "candidate18",
    votes: 203,
  },
  {
    campaignId: "campaign3",
    position: "Associate Editor",
    candidateId: "candidate19",
    votes: 231,
  },
  {
    campaignId: "campaign3",
    position: "News Editor",
    candidateId: "candidate20",
    votes: 245,
  },
  {
    campaignId: "campaign3",
    position: "Features Editor",
    candidateId: "candidate21",
    votes: 219,
  },
]

