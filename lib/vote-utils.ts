// Vote data types
export type Vote = {
    id: string
    electionId: string
    voterId: string
    votes: Record<string, string> // position -> candidateId
    timestamp: string
  }
  
  /**
   * Add a new vote to localStorage
   * @param electionId The ID of the election
   * @param voterId The ID of the voter
   * @param votes Object mapping positions to candidate IDs
   * @returns The created vote object
   */
  export function addVote(
    electionId: string,
    voterId: string,
    votes: Record<string, string>
  ): Vote {
    // Get existing votes
    const existingVotesJSON = localStorage.getItem('votes')
    const existingVotes: Vote[] = existingVotesJSON 
      ? JSON.parse(existingVotesJSON) 
      : []
  
    // Check if voter has already voted in this election
    const hasVoted = existingVotes.some(
      vote => vote.electionId === electionId && vote.voterId === voterId
    )
  
    if (hasVoted) {
      throw new Error('Voter has already cast a vote in this election')
    }
  
    // Create new vote
    const newVote: Vote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      electionId,
      voterId,
      votes,
      timestamp: new Date().toISOString()
    }
  
    // Add to votes and save
    existingVotes.push(newVote)
    localStorage.setItem('votes', JSON.stringify(existingVotes))
  
    return newVote
  }
  
  /**
   * Check if a voter has already voted in an election
   * @param electionId The ID of the election
   * @param voterId The ID of the voter
   * @returns True if the voter has already voted, false otherwise
   */
  export function hasVoted(electionId: string, voterId: string): boolean {
    const existingVotesJSON = localStorage.getItem('votes')
    
    if (!existingVotesJSON) return false
    
    const existingVotes: Vote[] = JSON.parse(existingVotesJSON)
    
    return existingVotes.some(
      vote => vote.electionId === electionId && vote.voterId === voterId
    )
  }
  
  /**
   * Get votes for a specific election
   * @param electionId The ID of the election
   * @returns Array of votes for the election
   */
  export function getElectionVotes(electionId: string): Vote[] {
    const existingVotesJSON = localStorage.getItem('votes')
    
    if (!existingVotesJSON) return []
    
    const existingVotes: Vote[] = JSON.parse(existingVotesJSON)
    
    return existingVotes.filter(vote => vote.electionId === electionId)
  }
  
  /**
   * Get a vote by voter ID and election ID
   * @param electionId The ID of the election
   * @param voterId The ID of the voter
   * @returns The vote or null if not found
   */
  export function getVote(electionId: string, voterId: string): Vote | null {
    const existingVotesJSON = localStorage.getItem('votes')
    
    if (!existingVotesJSON) return null
    
    const existingVotes: Vote[] = JSON.parse(existingVotesJSON)
    
    return existingVotes.find(
      vote => vote.electionId === electionId && vote.voterId === voterId
    ) || null
  }
  
  /**
   * Count votes for each candidate in an election
   * @param electionId The ID of the election
   * @returns Object mapping positions to candidate vote counts
   */
  export function countVotes(
    electionId: string
  ): Record<string, Record<string, number>> {
    const votes = getElectionVotes(electionId)
    const results: Record<string, Record<string, number>> = {}
    
    // Process each vote
    votes.forEach(vote => {
      Object.entries(vote.votes).forEach(([position, candidateId]) => {
        // Initialize position object if needed
        if (!results[position]) {
          results[position] = {}
        }
        
        // Initialize candidate count if needed
        if (!results[position][candidateId]) {
          results[position][candidateId] = 0
        }
        
        // Increment count
        results[position][candidateId]++
      })
    })
    
    return results
  }
  
  /**
   * Get the total number of votes for an election
   * @param electionId The ID of the election
   * @returns The total number of votes
   */
  export function getTotalVotes(electionId: string): number {
    return getElectionVotes(electionId).length
  } 