"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const role = searchParams.get("role") || "voter"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast({
        title: "Missing Username",
        description: "Please enter your username",
        variant: "destructive",
      })
      return
    }

    if (!password.trim()) {
      toast({
        title: "Missing Password",
        description: "Please enter your password",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // In a real application, this would be an API call to authenticate
      // For this demo, we're just simulating a successful login
      
      // Mock authentication - in real app would verify with Supabase Auth
      if (role === "admin" && username === "admin" && password === "password") {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify({
          id: "admin-123",
          username,
          role: "admin",
          name: "Admin User",
        }))

        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        })

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)
      } else if (role === "voter" && username && password) {
        // For demo purposes, any username/password works for voters
        localStorage.setItem("user", JSON.stringify({
          id: `voter-${Date.now()}`,
          username,
          role: "voter",
          name: username,
        }))

        toast({
          title: "Login Successful",
          description: "Welcome to CICS Select!",
        })

        // Redirect to voter dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "There was a problem logging in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            {role === "admin" ? "Admin Login" : "Student Login"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="username"
                  placeholder={role === "admin" ? "Admin username" : "Student ID"}
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

