"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity, Target, Zap, Clock } from "lucide-react"

interface DashboardData {
  totalTweets: number
  averageScore: number
  highPerformers: number
  improvementRate: number
  scoreDistribution: Array<{ range: string; count: number }>
  trendData: Array<{ date: string; score: number; tweets: number }>
  factorBreakdown: Array<{ factor: string; average: number; color: string }>
  recentAnalyses: Array<{
    id: string
    text: string
    score: number
    timestamp: string
    category: "high" | "medium" | "low"
  }>
}

// Mock data - in a real app this would come from your backend
const mockDashboardData: DashboardData = {
  totalTweets: 247,
  averageScore: 72,
  highPerformers: 89,
  improvementRate: 23,
  scoreDistribution: [
    { range: "0-20", count: 12 },
    { range: "21-40", count: 28 },
    { range: "41-60", count: 67 },
    { range: "61-80", count: 89 },
    { range: "81-100", count: 51 },
  ],
  trendData: [
    { date: "Mon", score: 68, tweets: 12 },
    { date: "Tue", score: 71, tweets: 18 },
    { date: "Wed", score: 69, tweets: 15 },
    { date: "Thu", score: 74, tweets: 22 },
    { date: "Fri", score: 76, tweets: 28 },
    { date: "Sat", score: 73, tweets: 19 },
    { date: "Sun", score: 72, tweets: 16 },
  ],
  factorBreakdown: [
    { factor: "Engagement", average: 75, color: "hsl(var(--chart-1))" },
    { factor: "Content", average: 68, color: "hsl(var(--chart-2))" },
    { factor: "Timing", average: 71, color: "hsl(var(--chart-3))" },
    { factor: "Hashtags", average: 73, color: "hsl(var(--chart-4))" },
    { factor: "Mentions", average: 69, color: "hsl(var(--chart-5))" },
  ],
  recentAnalyses: [
    {
      id: "1",
      text: "Just launched our new AI feature! What do you think about the future of artificial intelligence? #AI #Tech",
      score: 87,
      timestamp: "2 hours ago",
      category: "high",
    },
    {
      id: "2",
      text: "Working on some exciting updates. Stay tuned!",
      score: 45,
      timestamp: "4 hours ago",
      category: "low",
    },
    {
      id: "3",
      text: "The power of community-driven development never ceases to amaze me. What's your favorite open source project?",
      score: 78,
      timestamp: "6 hours ago",
      category: "high",
    },
    {
      id: "4",
      text: "Coffee break thoughts: Why do the best ideas always come when you're not actively trying to think of them?",
      score: 62,
      timestamp: "8 hours ago",
      category: "medium",
    },
  ],
}

export function ViralityDashboard() {
  const [data, setData] = useState<DashboardData>(mockDashboardData)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d")

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "High" }
    if (score >= 60) return { variant: "secondary" as const, text: "Good" }
    return { variant: "destructive" as const, text: "Low" }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "high":
        return "border-green-200 bg-green-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tweets Analyzed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTweets}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(data.averageScore)}`}>{data.averageScore}</div>
            <p className="text-xs text-muted-foreground">+5 points this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Performers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.highPerformers}</div>
            <p className="text-xs text-muted-foreground">Tweets scoring 80+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.improvementRate}%</div>
            <p className="text-xs text-muted-foreground">Using AI suggestions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Score Trend
            </CardTitle>
            <CardDescription>Your virality scores over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "score" ? `${value} points` : `${value} tweets`,
                    name === "score" ? "Average Score" : "Tweets Analyzed",
                  ]}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Score Distribution
            </CardTitle>
            <CardDescription>How your tweets perform across different score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} tweets`, "Count"]} />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Factor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Factor Performance Analysis
          </CardTitle>
          <CardDescription>Average performance across different virality factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              {data.factorBreakdown.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.factor}</span>
                    <span className="text-sm font-mono">{factor.average}%</span>
                  </div>
                  <Progress value={factor.average} className="h-2" />
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.factorBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="average"
                >
                  {data.factorBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Average Score"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Analyses
          </CardTitle>
          <CardDescription>Your latest tweet analyses and their performance scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className={`p-4 rounded-lg border ${getCategoryColor(analysis.category)} transition-colors`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm leading-relaxed">{analysis.text}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {analysis.timestamp}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</div>
                    <Badge {...getScoreBadge(analysis.score)}>{getScoreBadge(analysis.score).text}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
