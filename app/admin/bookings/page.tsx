"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, X, Clock } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all")

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      client: "Sarah Johnson",
      service: "Gel Manicure",
      stylist: "Sofia Chen",
      date: "2024-01-15",
      time: "2:00 PM",
      status: "pending",
    },
    {
      id: 2,
      client: "Emily Davis",
      service: "Balayage",
      stylist: "Marie Laurent",
      date: "2024-01-16",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 3,
      client: "Jessica Martinez",
      service: "Signature Facial",
      stylist: "Emma Rose",
      date: "2024-01-17",
      time: "3:30 PM",
      status: "pending",
    },
  ]

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || booking.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Bookings</h1>
        <p className="text-muted-foreground">Manage appointments and reservations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
            size="sm"
          >
            Confirmed
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Stylist</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.client}</TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>{booking.stylist}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {booking.date} at {booking.time}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-primary/10 text-primary"
                        : booking.status === "pending"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {booking.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-primary">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
