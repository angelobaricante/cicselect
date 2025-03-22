export interface User {
  srCode: string
  name: string
  role: "voter" | "admin"
}

export interface Voter extends User {
  role: "voter"
  course: string
}

export interface Admin extends User {
  role: "admin"
}

export interface Campaign {
  id: string
  title: string
  description: string
  deadline: string
  positions: string[]
  hasVoted?: boolean // For UI purposes
}

export interface Candidate {
  id: string
  campaignId: string
  name: string
  course: string
  position: string
  platform?: string
}

export interface Entry {
  id: string
  campaignId: string
  voterSrCode: string
  timestamp: string
  votes: Record<string, string> // position -> candidateId
}

export interface Result {
  campaignId: string
  position: string
  candidateId: string
  votes: number
}

