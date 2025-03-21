"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [role, setRole] = useState("voter")
  const [srCode, setSrCode] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "admin" || roleParam === "voter") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!srCode || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (role === "voter") {
      if (srCode.startsWith("SR") && password === "password") {
        localStorage.setItem("user", JSON.stringify({ srCode, role: "voter", name: "Student User", course: "BSIT" }))
        router.push("/voter/dashboard")
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid credentials",
          variant: "destructive",
        })
      }
    } else {
      if (srCode === "admin" && password === "admin") {
        localStorage.setItem("user", JSON.stringify({ srCode, role: "admin", name: "Admin User" }))
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid credentials",
          variant: "destructive",
        })
      }
    }
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

