"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Redirect based on role
      if (parsedUser.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          CICS <span className="text-blue-600 dark:text-blue-400">Select</span>
        </h1>
        <p className="mx-auto mb-8 max-w-md text-gray-600 dark:text-gray-300">
          The official voting platform for the College of Information and Computing Sciences
        </p>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-8">
          <Card className="flex flex-col items-center justify-center p-6 transition-all hover:shadow-md">
            <h2 className="mb-4 text-xl font-bold">Student Login</h2>
            <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Vote for your candidates using your student credentials
            </p>
            <Button onClick={() => router.push("/login?role=voter")}>
              Login as Student
            </Button>
          </Card>

          <Card className="flex flex-col items-center justify-center p-6 transition-all hover:shadow-md">
            <h2 className="mb-4 text-xl font-bold">Administrator</h2>
            <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Create and manage election campaigns
            </p>
            <Button variant="outline" onClick={() => router.push("/login?role=admin")}>
              Login as Admin
            </Button>
          </Card>
        </div>
      </div>
    </main>
  )
}

