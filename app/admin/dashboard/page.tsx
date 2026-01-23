"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, GraduationCap, Calendar, DollarSign, TrendingUp, Users } from "lucide-react"

export default function AdminDashboard() {
  // Mock data - in production, fetch from API
  const stats = [
    {
      title: "Total Products",
      value: "8",
      change: "+2 this month",
      icon: ShoppingBag,
      trend: "up",
    },
    {
      title: "Active Courses",
      value: "3",
      change: "All running",
      icon: GraduationCap,
      trend: "neutral",
    },
    {
      title: "Pending Bookings",
      value: "12",
      change: "+5 today",
      icon: Calendar,
      trend: "up",
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+18% from last month",
      icon: DollarSign,
      trend: "up",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-primary" />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest appointment requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium">Client Name</p>
                    <p className="text-sm text-muted-foreground">Nail Artistry - Tomorrow 2:00 PM</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Pending</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <p className="font-medium">Add New Product</p>
                <p className="text-sm text-muted-foreground">Create a new product listing</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <p className="font-medium">Create Course</p>
                <p className="text-sm text-muted-foreground">Add a new training course</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <p className="font-medium">View All Bookings</p>
                <p className="text-sm text-muted-foreground">Manage appointments</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
