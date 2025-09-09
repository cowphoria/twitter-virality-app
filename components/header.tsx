"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Twitter } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ViralTweet</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/app">
              <Button variant={pathname === "/app" ? "default" : "ghost"} size="sm">
                Analyze
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="ghost" size="sm">
                Compose
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Twitter className="w-4 h-4 mr-2" />
              Connect Twitter
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
