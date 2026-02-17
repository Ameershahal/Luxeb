"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Review = {
  _id: string
  name: string
  location: string
  image: string
  rating: number
  text: string
  service: string
  isActive: boolean
}

export default function AdminReviewsPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])

  const [form, setForm] = useState({
    name: "",
    location: "",
    image: "",
    rating: "5",
    text: "",
    service: "",
  })

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/reviews")
      const data = await res.json()
      if (data.success) {
        setReviews(data.reviews || [])
      } else {
        throw new Error(data.error || "Failed to fetch reviews")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch reviews",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" })
      return
    }

    setIsUploading(true)
    try {
      const payload = new FormData()
      payload.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: payload })
      const data = await res.json()
      if (!data.success || !data.url) {
        throw new Error(data.error || "Upload failed")
      }
      setForm((prev) => ({ ...prev, image: data.url }))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const resetForm = () => {
    setForm({
      name: "",
      location: "",
      image: "",
      rating: "5",
      text: "",
      service: "",
    })
  }

  const addReview = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating),
          isActive: true,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add review")
      }
      toast({ title: "Success", description: "Review added" })
      resetForm()
      fetchReviews()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteReview = async (id: string) => {
    if (!window.confirm("Delete this review?")) return
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review")
      }
      toast({ title: "Success", description: "Review deleted" })
      fetchReviews()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Reviews</h1>
        <p className="text-muted-foreground">Add and remove client reviews</p>
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Rating (1-5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Input value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Review Text</Label>
          <Textarea value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} rows={4} />
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <div className="flex gap-2">
            <Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="/photo.jpg or https://..." />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button onClick={addReview} disabled={isSubmitting} className="bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          {isSubmitting ? "Adding..." : "Add Review"}
        </Button>
      </div>

      <div className="rounded-xl border p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review._id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="min-w-0">
                  <p className="font-medium">{review.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{review.text}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteReview(review._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
