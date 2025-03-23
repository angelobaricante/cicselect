import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md text-center">
        {/* Logo and Title */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <Image src="/cicslogo.png" alt="CICS Logo" width={50} height={50} className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">CICSelect</h1>
        </div>

        <p className="mb-10 text-base text-white sm:text-lg md:text-xl">
          CICS Student Council Digital Voting System
        </p>
        
        {/* Login Buttons */}
        <div className="flex flex-col gap-3">
          {/* Student Login Button (Blue Background) */}
          <Button asChild size="lg" className="h-12 text-base bg-[#2a61aa] hover:bg-[#2f478d] text-white">
            <Link href="/login?role=voter">Student Login</Link>
          </Button>

          {/* Admin Login Button (Outlined, Blue Text) */}
          <Button variant="outline" asChild size="lg" className="h-12 text-base text-[#2a61aa] hover:text-[#2a61aa]">
            <Link href="/login?role=admin">Admin Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
