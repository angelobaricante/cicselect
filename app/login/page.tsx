"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { addVote, hasVoted } from "@/lib/vote-utils"

// Initialize sample data
const initializeData = () => {
  // Create admin user if it doesn't exist
  if (!localStorage.getItem('user')) {
    // We don't auto-login the user, just ensure the data exists
  }
  
  // Create sample election if none exist
  const electionsData = localStorage.getItem('elections')
  if (!electionsData || JSON.parse(electionsData).length === 0) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const sampleElection = {
      id: `election_${Date.now()}`,
      title: 'Sample Student Council Election 2025',
      deadline: tomorrow.toISOString().split('T')[0],
      positions: ['President', 'Vice President', 'Secretary'],
      candidates: [
        {
          id: `candidate_${Date.now()}_1`,
          name: 'John Smith',
          course: 'BS Computer Science',
          position: 'President',
          platform: 'Improve campus facilities and student services'
        },
        {
          id: `candidate_${Date.now()}_2`,
          name: 'Maria Garcia',
          course: 'BS Information Technology',
          position: 'President',
          platform: 'Focus on academic excellence and research opportunities'
        },
        {
          id: `candidate_${Date.now()}_3`,
          name: 'David Lee',
          course: 'BS Information Systems',
          position: 'Vice President',
          platform: 'Enhance student organizations and activities'
        }
      ],
      createdAt: new Date().toISOString(),
      status: 'upcoming'
    }
    
    localStorage.setItem('elections', JSON.stringify([sampleElection]))
    
    // Add demo votes for the sample election
    initializeDemoVotes(sampleElection)
  }
}

type DemoElection = {
  id: string
  positions: string[]
  candidates: Array<{
    id: string
    position: string
    [key: string]: unknown
  }>
}

// Initialize demo votes
const initializeDemoVotes = (election: DemoElection) => {
  // Check if votes already exist
  const votesData = localStorage.getItem('votes')
  if (votesData && JSON.parse(votesData).length > 0) {
    return // Already have votes
  }
  
  // Generate 20 fake student voters
  const students = Array.from({ length: 20 }, (_, i) => ({
    id: `SR${100000 + i}`,
    name: `Student ${i + 1}`,
    course: 'BS Computer Science'
  }))
  
  // Get candidates by position
  const candidatesByPosition: Record<string, typeof election.candidates> = {}
  election.positions.forEach((position: string) => {
    candidatesByPosition[position] = election.candidates
      .filter((c) => c.position === position)
  })
  
  // Record votes
  students.forEach(student => {
    try {
      // Create vote object with random selections
      const votes: Record<string, string> = {}
      
      // For each position, randomly select a candidate
      election.positions.forEach((position: string) => {
        const candidates = candidatesByPosition[position]
        if (candidates && candidates.length > 0) {
          // Randomly select a candidate
          const randomIndex = Math.floor(Math.random() * candidates.length)
          votes[position] = candidates[randomIndex].id
        }
      })
      
      // Only add vote if all positions have a selection
      if (Object.keys(votes).length === election.positions.length) {
        // Don't check if already voted since this is initial data
        if (!hasVoted(election.id, student.id)) {
          addVote(election.id, student.id, votes)
        }
      }
    } catch (error) {
      console.error('Error adding demo vote:', error)
    }
  })
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState("voter")
  const [srCode, setSrCode] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    // Initialize demo data
    initializeData()
    
    const roleParam = searchParams.get("role")
    if (roleParam === "admin" || roleParam === "voter") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!srCode.trim()) {
      toast.error("Missing SR Code", {
        description: "Please enter your SR Code."
      })
      return
    }

    if (!password.trim()) {
      toast.error("Missing Password", {
        description: "Please enter your password."
      })
      return
    }

    // For admin
    if (role === "admin") {
      // Validate admin credentials
      if (srCode !== "admin") {
        toast.error("Invalid Admin ID", {
          description: "The admin ID you entered is not recognized."
        })
        return
      }
      
      if (password !== "admin") {
        toast.error("Invalid Password", {
          description: "The password you entered is incorrect."
        })
        return
      }

      // Store admin user data
      const userData = {
        srCode: "admin",
        role: "admin",
        name: "Admin User"
      }
      localStorage.setItem("user", JSON.stringify(userData))
      
      toast.success("Login Successful! 👋", {
        description: "Welcome back, Admin!"
      })
      
      router.push("/admin/dashboard")
      return
    }
    
    // For voters
    // Validate SR Code format for voters
    if (!srCode.toUpperCase().startsWith("SR")) {
      toast.error("Invalid SR Code", {
        description: "SR Code must start with 'SR'."
      })
      return
    }

    // For voters in demo mode, we accept a specific password
    if (password !== "password") {
      toast.error("Invalid Password", {
        description: "For demo purposes, please use 'password' as your password."
      })
      return
    }

    // Store voter data
    const userData = {
      srCode: srCode.toUpperCase(),
      role: "voter",
      name: `Voter ${srCode.toUpperCase()}`
    }
    localStorage.setItem("user", JSON.stringify(userData))

    toast.success("Login Successful! 👋", {
      description: "Welcome to CICSelect!"
    })

    router.push("/voter/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-xl font-bold">{role === "voter" ? "Student Login" : "Admin Login"}</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="srCode">{role === "voter" ? "SR Code" : "Admin ID"}</Label>
            <Input
              id="srCode"
              placeholder={role === "voter" ? "SR12345678" : "admin"}
              value={srCode}
              onChange={(e) => setSrCode(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              {role === "voter" ? "Demo: use any SR code starting with 'SR'" : "Demo: use 'admin'"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-xs text-gray-500">{role === "voter" ? "Demo: use 'password'" : "Demo: use 'admin'"}</p>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push(`/login?role=${role === "voter" ? "admin" : "voter"}`)}
          >
            Switch to {role === "voter" ? "Admin" : "Student"} Login
          </Button>
        </form>
      </div>
    </div>
  )
}

