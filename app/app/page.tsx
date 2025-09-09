import { TweetAnalyzer } from "@/components/tweet-analyzer"
import { TweetComposer } from "@/components/tweet-composer"
import { ViralityDashboard } from "@/components/virality-dashboard"
import { Header } from "@/components/header"
import { UserMenu } from "@/components/user-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TestTube } from "lucide-react"

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Twitter Virality Analyzer</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze your tweets with our AI-powered algorithm to predict virality and get actionable suggestions for
              better engagement.
            </p>
          </div>

          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="analyze">Analyze Tweet</TabsTrigger>
              <TabsTrigger value="compose">AI Composer</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
            
            {/* A/B Testing Link */}
            <div className="mb-6 text-center">
              <Link href="/ab-testing">
                <Button variant="outline" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  A/B Testing Lab
                </Button>
              </Link>
            </div>
            <TabsContent value="analyze">
              <TweetAnalyzer />
            </TabsContent>
            <TabsContent value="compose">
              <TweetComposer />
            </TabsContent>
            <TabsContent value="dashboard">
              <ViralityDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
