"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, Upload, Loader2, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type CourseRow = {
  id: string
  title: string
  price: number
  duration: string
  students: string
  isActive?: boolean
  description?: string
  location?: string
  image?: string
  startDates?: string[]
  enrollmentCount?: number | null
}

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courses, setCourses] = useState<CourseRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    location: "",
    maxStudents: "",
    description: "",
    image: "",
    startDates: [] as string[],
     enrollmentCount: "",
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }
    setIsUploading(true)
    try {
      const body = new FormData()
      body.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body })
      const data = await res.json()
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.url }))
        toast({ title: "Success", description: "Image uploaded to Cloudinary" })
      } else {
        toast({
          title: "Error",
          description: data.error || "Upload failed",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      duration: "",
      location: "",
      maxStudents: "",
      description: "",
      image: "",
      startDates: [],
      enrollmentCount: "",
    })
    fileInputRef.current && (fileInputRef.current.value = "")
  }

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/courses")
      const data = await res.json()
      if (data.success && Array.isArray(data.courses)) {
        const mappedCourses = data.courses.map((c: any) => {
          // Be defensive about enrollmentCount type (handle numbers or strings)
          let enrollmentCount: number | null = null
          if (c.enrollmentCount !== undefined && c.enrollmentCount !== null) {
            const parsed = Number(c.enrollmentCount)
            if (!Number.isNaN(parsed) && parsed >= 0) {
              enrollmentCount = parsed
            }
          }

          const courseData = {
            id: c.id || c._id,
            title: c.title,
            price: c.price,
            duration: c.duration || "",
            students: c.students || "",
            isActive: c.isActive !== false,
            description: c.description || "",
            location: c.location || "",
            image: c.image || "",
            startDates: Array.isArray(c.startDates) ? c.startDates : [],
            enrollmentCount,
          }
          // Debug: Log courses with dates
          if (courseData.startDates && courseData.startDates.length > 0) {
            console.log(`📚 Course "${courseData.title}" has dates:`, courseData.startDates)
          }
          return courseData
        })
        setCourses(mappedCourses)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Courses</h1>
          <p className="text-muted-foreground">Manage your training courses</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setSelectedCourse(null)
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setSelectedCourse(null)
                resetForm()
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
              <DialogDescription>
                {selectedCourse ? "Update the course details." : "Create a new training course."}
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                setIsSubmitting(true)
                try {
                  const isUpdate = !!selectedCourse
                  const url = isUpdate
                    ? `/api/admin/courses/${selectedCourse!.id}`
                    : "/api/admin/courses"
                  const method = isUpdate ? "PUT" : "POST"

                  // Filter out empty date strings before sending
                  const validDates = Array.isArray(formData.startDates)
                    ? formData.startDates.filter((d) => {
                        if (!d) return false
                        const str = String(d).trim()
                        return str !== '' && str.length > 0
                      })
                    : []
                  
                  const payload = {
                    title: formData.title,
                    description: formData.description,
                    price: formData.price ? Number(formData.price) : 0,
                    duration: formData.duration,
                    location: formData.location,
                    maxStudents: formData.maxStudents,
                    image: formData.image,
                    startDates: validDates,
                    enrollmentCount: formData.enrollmentCount,
                  }
                  
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  })

                  if (!res.ok) {
                    const errorText = await res.text()
                    let errorData
                    try {
                      errorData = JSON.parse(errorText)
                    } catch {
                      errorData = { error: errorText || `HTTP ${res.status}` }
                    }
                    throw new Error(errorData.error || `Failed to ${isUpdate ? 'update' : 'create'} course`)
                  }

                  const data = await res.json()
                  if (data.success) {
                    toast({
                      title: isUpdate ? "Course updated" : "Course created",
                      description: isUpdate
                        ? "The course has been updated."
                        : "The course has been added and will appear on the site.",
                    })
                    setIsDialogOpen(false)
                    resetForm()
                    setSelectedCourse(null)
                    fetchCourses()
                  } else {
                    toast({
                      title: "Error",
                      description: data.error || `Failed to ${isUpdate ? 'update' : 'create'} course`,
                      variant: "destructive",
                    })
                  }
                } catch (err: any) {
                  console.error('Course save error:', err)
                  toast({
                    title: "Error",
                    description: err.message || `Failed to ${isUpdate ? 'update' : 'create'} course`,
                    variant: "destructive",
                  })
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 4 weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Studio Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    placeholder="8"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentCount">Enrolled count (for display)</Label>
                <Input
                  id="enrollmentCount"
                  type="number"
                  min={0}
                  placeholder="e.g., 120"
                  value={formData.enrollmentCount}
                  onChange={(e) => setFormData({ ...formData, enrollmentCount: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Optional. Shown on the course card as “120+ students enrolled”.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Start dates (optional)</Label>
                <p className="text-xs text-muted-foreground">
                  Add multiple dates so students can choose a comfortable start date.
                </p>
                <div className="space-y-2">
                  {(formData.startDates && formData.startDates.length > 0 
                    ? formData.startDates 
                    : [""]
                  ).map((date, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => {
                          const newValue = e.target.value
                          setFormData((prev) => {
                            const currentDates = prev.startDates && prev.startDates.length > 0 
                              ? [...prev.startDates] 
                              : [""]
                            const updatedDates = currentDates.map((d, j) => (j === i ? newValue : d))
                            return {
                              ...prev,
                              startDates: updatedDates,
                            }
                          })
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            startDates:
                              prev.startDates.length <= 1
                                ? []
                                : prev.startDates.filter((_, j) => j !== i),
                          }))
                        }
                        aria-label="Remove date"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        startDates: [...(prev.startDates.length ? prev.startDates : [""]), ""],
                      }))
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add date
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Course description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image – URL or upload from your PC</Label>
                <p className="text-xs text-muted-foreground">
                  Paste a link or upload an image (uploaded to Cloudinary).
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Input
                    id="image"
                    placeholder="/course-image.jpg or https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 min-w-[200px]"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-hidden
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload image
                      </>
                    )}
                  </Button>
                </div>
                {formData.image ? (
                  <div className="relative inline-block mt-2">
                    <img
                      src={formData.image}
                      alt="Course preview"
                      className="max-h-32 rounded-lg border border-border object-contain"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7"
                      onClick={() => setFormData({ ...formData, image: "" })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setSelectedCourse(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground"
                  disabled={isSubmitting || !formData.title.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedCourse ? "Saving…" : "Creating…"}
                    </>
                  ) : (
                    selectedCourse ? "Save Changes" : "Create Course"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Table */}
      <div className="border border-border rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Max Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No courses yet. Add one above to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>£{course.price}</TableCell>
                    <TableCell>{course.students || "—"}</TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {course.isActive ? "active" : "inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCourse(course)
                            // Debug: Check what we're loading
                            console.log('🔍 Loading course for edit:', {
                              title: course.title,
                              startDates: course.startDates,
                              startDatesType: typeof course.startDates,
                              isArray: Array.isArray(course.startDates),
                              startDatesLength: Array.isArray(course.startDates) ? course.startDates.length : 'N/A'
                            })
                            
                            // Load startDates - ensure it's always an array
                            const dates = Array.isArray(course.startDates) && course.startDates.length > 0
                              ? [...course.startDates] // Copy the array as-is
                              : []
                            
                            console.log('📅 Dates loaded into form:', dates)
                            
                            setFormData({
                              title: course.title,
                              price: String(course.price ?? ""),
                              duration: course.duration || "",
                              location: course.location || "",
                              maxStudents:
                                course.students && course.students.match(/\d+/)
                                  ? course.students.match(/\d+/)![0]
                                  : "",
                              description: course.description || "",
                              image: course.image || "",
                              startDates: dates, // Use dates as-is from database
                              enrollmentCount: course.enrollmentCount != null ? String(course.enrollmentCount) : "",
                            })
                            setIsDialogOpen(true)
                          }}
                          aria-label="Edit course"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            if (!window.confirm("Delete this course?")) return
                            try {
                              const res = await fetch(`/api/admin/courses/${course.id}`, {
                                method: "DELETE",
                              })
                              const data = await res.json()
                              if (data.success) {
                                toast({
                                  title: "Course deleted",
                                  description: "The course has been removed.",
                                })
                                fetchCourses()
                              } else {
                                toast({
                                  title: "Error",
                                  description: data.error || "Failed to delete course",
                                  variant: "destructive",
                                })
                              }
                            } catch (err) {
                              console.error(err)
                              toast({
                                title: "Error",
                                description: "Failed to delete course",
                                variant: "destructive",
                              })
                            }
                          }}
                          aria-label="Delete course"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
