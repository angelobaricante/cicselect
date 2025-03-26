"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import type { Result } from "@/lib/types"
import { Vote, getElectionVotes, getTotalVotes } from "@/lib/vote-utils"

type LocalCandidate = {
  id: string
  name: string
  course: string
  position: string
  platform?: string
}

type Election = {
  id: string
  title: string
  deadline: string
  positions: string[]
  candidates: LocalCandidate[]
  createdAt: string
  status: 'active' | 'completed' | 'upcoming'
}

// Process vote data into results format
const processVotes = (election: Election, votes: Vote[]): Record<string, Result[]> => {
  const resultsByPosition: Record<string, Result[]> = {}
  
  // Initialize results structure
  election.positions.forEach(position => {
    resultsByPosition[position] = []
    
    // Get candidates for this position
    const positionCandidates = election.candidates.filter(c => c.position === position)
    
    // Create a result entry for each candidate with zero votes initially
    positionCandidates.forEach(candidate => {
      resultsByPosition[position].push({
        campaignId: election.id,
        position,
        candidateId: candidate.id,
        votes: 0
      })
    })
  })
  
  // Count votes for each candidate
  votes.forEach(vote => {
    Object.entries(vote.votes).forEach(([position, candidateId]) => {
      const candidateResult = resultsByPosition[position]?.find(
        result => result.candidateId === candidateId
      )
      
      if (candidateResult) {
        candidateResult.votes++
      }
    })
  })
  
  // Sort each position's results by vote count (descending)
  Object.keys(resultsByPosition).forEach(position => {
    resultsByPosition[position].sort((a, b) => b.votes - a.votes)
  })
  
  return resultsByPosition
}

export default function AdminResultsPage() {
  const router = useRouter()
  const params = useParams()
  const [election, setElection] = useState<Election | null>(null)
  const [results, setResults] = useState<Record<string, Result[]>>({})
  const [loading, setLoading] = useState(true)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login?role=admin")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/login?role=admin")
      return
    }
    
    // Get election data from localStorage
    const electionsData = localStorage.getItem('elections')
    if (!electionsData) {
      toast.error("No Elections Found", {
        description: "No elections data available."
      })
      router.push("/admin/dashboard")
      return
    }

    const elections: Election[] = JSON.parse(electionsData)
    const electionId = params.id as string
    const foundElection = elections.find((e) => e.id === electionId)

    if (!foundElection) {
      toast.error("Not Found", {
        description: "The requested election could not be found"
      })
      router.push("/admin/dashboard")
      return
    }

    setElection(foundElection)
    
    // Check if there are candidates
    if (foundElection.candidates.length === 0) {
      toast.error("No Candidates", {
        description: "This election has no candidates to show results for"
      })
    }
    
    // Get votes data using the utility function
    const electionVotes = getElectionVotes(electionId)
    const voteCount = getTotalVotes(electionId)
    setTotalVotes(voteCount)
    
    // Process votes into results
    const processedResults = processVotes(foundElection, electionVotes)
    setResults(processedResults)
    
    setLoading(false)
  }, [params.id, router])

  const handleExportResults = () => {
    if (!election) return
    
    // Create CSV content
    let csvContent = "Position,Candidate Name,Course,Votes\n"
    
    Object.entries(results).forEach(([position, positionResults]) => {
      positionResults.forEach(result => {
        const candidate = election.candidates.find(c => c.id === result.candidateId)
        if (candidate) {
          csvContent += `"${position}","${candidate.name}","${candidate.course}",${result.votes}\n`
        }
      })
    })
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${election.title}_results.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success("Results Exported", {
      description: "Election results have been exported as CSV"
    })
  }

  if (loading) return <div className="p-4">Loading...</div>

  // Find the maximum votes for each position to calculate percentages
  const maxVotesByPosition: Record<string, number> = {}
  Object.entries(results).forEach(([position, positionResults]) => {
    maxVotesByPosition[position] = Math.max(...positionResults.map((r) => r.votes), 1)
  })

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/dashboard")}>
            Back
          </Button>
          <h1 className="text-xl font-bold">Results: {election?.title}</h1>
          <Button size="sm" onClick={handleExportResults}>
            Export
          </Button>
        </div>
        
        <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-lg font-medium">Total Votes: {totalVotes}</p>
          <p className="text-sm text-gray-500">
            {election?.status === 'completed' 
              ? 'Voting has ended' 
              : 'Voting is still in progress'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {election?.positions.map((position) => (
            <div key={position} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <h2 className="mb-3 font-medium">{position}</h2>

              <div className="space-y-3">
                {results[position]?.map((result, idx) => {
                  const candidate = election.candidates.find((c) => c.id === result.candidateId)
                  const percentage = maxVotesByPosition[position] > 0
                    ? Math.round((result.votes / maxVotesByPosition[position]) * 100)
                    : 0

                  return (
                    <div key={result.candidateId} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="truncate pr-2">
                          {candidate?.name}
                          {idx === 0 && result.votes > 0 && election?.status === 'completed' && (
                            <span className="ml-1 text-xs text-green-600 dark:text-green-400">(Winner)</span>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-xs text-gray-500">
                          {result.votes} {maxVotesByPosition[position] > 0 ? `(${percentage}%)` : ''}
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
                
                {(!results[position] || results[position].length === 0) && (
                  <div className="text-center text-sm text-gray-500">
                    No candidates for this position
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

