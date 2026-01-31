"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type AvailableTime = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
}

type Stylist = {
  _id: string
  availableTimes?: AvailableTime[]
}

type DateTimeSelectionProps = {
  selectedDateTime: { date: Date | null; time: string | null }
  stylistId: string
  onSelect: (dateTime: { date: Date | null; time: string | null }) => void
  onNext: () => void
  onBack: () => void
}

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
]

export function DateTimeSelection({ selectedDateTime, stylistId, onSelect, onNext, onBack }: DateTimeSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(selectedDateTime.date)
  const [selectedTime, setSelectedTime] = useState<string | null>(selectedDateTime.time)
  const [stylist, setStylist] = useState<Stylist | null>(null)
  const [isLoadingStylist, setIsLoadingStylist] = useState(false)

  // Fetch stylist data when stylistId changes
  useEffect(() => {
    if (stylistId && stylistId !== "any-available") {
      fetchStylist()
    } else {
      setStylist(null)
    }
  }, [stylistId])

  const fetchStylist = async () => {
    try {
      setIsLoadingStylist(true)
      const response = await fetch(`/api/admin/stylists/${stylistId}`)
      const data = await response.json()
      if (data.success) {
        setStylist(data.stylist)
      }
    } catch (error) {
      console.error("Error fetching stylist:", error)
    } finally {
      setIsLoadingStylist(false)
    }
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const days: (Date | null)[] = []

    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }, [currentMonth])

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const minDate = new Date(today)
    minDate.setDate(minDate.getDate() + 2) // 48 hours advance booking
    return date < minDate || date.getDay() === 0 // No Sundays
  }

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  // Convert 12-hour time to 24-hour format for comparison
  const convertTo24Hour = (time12h: string): string => {
    const [time, period] = time12h.split(' ')
    const [hours, minutes] = time.split(':')
    let hour24 = parseInt(hours)
    if (period === 'PM' && hour24 !== 12) hour24 += 12
    if (period === 'AM' && hour24 === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minutes}`
  }

  // Convert 24-hour time to 12-hour format
  const convertTo12Hour = (time24h: string): string => {
    const [hours, minutes] = time24h.split(':')
    const hour24 = parseInt(hours)
    const hour12 = hour24 % 12 || 12
    const period = hour24 >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${period}`
  }

  // Get day name from date
  const getDayName = (date: Date): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()]
  }

  // Filter available time slots
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return []
    
    // If "Any Available" is selected, all times are available
    if (stylistId === "any-available" || !stylist) {
      return timeSlots
    }

    // If stylist has no available times set, allow all times
    if (!stylist.availableTimes || stylist.availableTimes.length === 0) {
      return timeSlots
    }

    const dayName = getDayName(selectedDate)
    const daySchedule = stylist.availableTimes.find(
      (at) => at.day.toLowerCase() === dayName.toLowerCase()
    )

    // If no schedule for this day, return empty array
    if (!daySchedule) {
      return []
    }

    // Filter time slots that fall within the available range
    return timeSlots.filter((timeSlot) => {
      const time24h = convertTo24Hour(timeSlot)
      return time24h >= daySchedule.startTime && time24h <= daySchedule.endTime
    })
  }, [selectedDate, stylist, stylistId])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    onSelect({ date, time: null })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onSelect({ date: selectedDate, time })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-card rounded-xl border border-border p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="font-medium text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                onClick={() => date && !isDateDisabled(date) && handleDateSelect(date)}
                disabled={isDateDisabled(date)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg text-sm transition-all",
                  !date && "invisible",
                  date && isDateDisabled(date) && "text-muted-foreground/40 cursor-not-allowed",
                  date && !isDateDisabled(date) && !isDateSelected(date) && "hover:bg-muted text-foreground",
                  isDateSelected(date) && "bg-primary text-primary-foreground font-medium",
                )}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-medium text-foreground mb-4">
            {selectedDate
              ? `Available times for ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`
              : "Select a date to see available times"}
          </h3>

          {selectedDate ? (
            isLoadingStylist ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Loading available times...
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No available times for this date. Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.map((time) => {
                  const isSelected = selectedTime === time
                  return (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "py-3 px-2 rounded-lg text-sm font-medium transition-all",
                        !isSelected && "bg-muted hover:bg-primary/10 text-foreground",
                        isSelected && "bg-primary text-primary-foreground",
                      )}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            )
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Please select a date first
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6 h-12 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
