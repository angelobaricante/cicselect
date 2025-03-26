"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Home() {
  useEffect(() => {
    // Clear any previous user session when landing on the home page
    localStorage.removeItem("user")
    
    // Welcome message
    toast.info("Welcome to CICSelect", {
      description: "Please choose your login method to continue.",
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">CICSelect</h1>
        <p className="mb-10 text-base text-gray-600 dark:text-gray-300 sm:text-lg md:text-xl">
          Online Voting System for CICS-SC
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="h-12 text-base">
            <Link href="/login?role=voter">Student Login</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="h-12 text-base">
            <Link href="/login?role=admin">Admin Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

