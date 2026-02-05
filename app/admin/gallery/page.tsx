"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Upload, Edit, Loader2, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface GalleryItem {
  _id: string
  image: string
  category: 'nails' | 'beauty'
  title: string
  description?: string
  isActive: boolean
}

export default function AdminGallery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    category: "nails" as "nails" | "beauty",
    image: "",
    description: "",
  })

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/gallery")
      const data = await response.json()
      
      if (data.success) {
        setGalleryItems(data.galleryItems || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch gallery items",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error)
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }))
        setPreviewImage(data.url)
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = selectedItem
        ? `/api/admin/gallery/${selectedItem._id}`
        : "/api/admin/gallery"
      
      const method = selectedItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: selectedItem ? "Gallery item updated" : "Gallery item created",
          description: `Image ${selectedItem ? "updated" : "added"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchGalleryItems()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save gallery item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving gallery item:", error)
      toast({
        title: "Error",
        description: "Failed to save gallery item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      const response = await fetch(`/api/admin/gallery/${selectedItem._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Gallery item deleted",
          description: "Image deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        setSelectedItem(null)
        fetchGalleryItems()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete gallery item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      })
    }
  }

  const openDialog = (item?: GalleryItem) => {
    if (item) {
      setSelectedItem(item)
      setFormData({
        title: item.title,
        category: item.category,
        image: item.image,
        description: item.description || "",
      })
      setPreviewImage(item.image)
    } else {
      setSelectedItem(null)
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "nails",
      image: "",
      description: "",
    })
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Gallery</h1>
          <p className="text-muted-foreground">Manage your portfolio images</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              setIsSeeding(true)
              try {
                const response = await fetch("/api/admin/seed-gallery", {
                  method: "POST",
                })
                const data = await response.json()
                if (data.success) {
                  toast({
                    title: "Gallery items added",
                    description: `Created ${data.created} items, skipped ${data.skipped} existing ones`,
                  })
                  fetchGalleryItems()
                } else {
                  toast({
                    title: "Error",
                    description: data.error || "Failed to seed gallery",
                    variant: "destructive",
                  })
                }
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to seed gallery",
                  variant: "destructive",
                })
              } finally {
                setIsSeeding(false)
              }
            }}
            disabled={isSeeding}
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Existing Images"
            )}
          </Button>
          <Button onClick={() => openDialog()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading gallery items...</p>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No gallery items found</p>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Image
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <div key={item._id} className="group relative overflow-hidden rounded-lg border border-border">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => openDialog(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-red-500/20"
                  onClick={() => {
                    setSelectedItem(item)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Gallery Image" : "Add Gallery Image"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? "Update gallery image information"
                : "Upload a new image to your portfolio"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Image Title *</Label>
              <Input
                id="title"
                placeholder="Enter image title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: "nails" | "beauty") =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nails">Nails</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">
                Image URL or upload to Cloudinary <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Paste a URL or upload an image (stored on Cloudinary).
              </p>
              <div className="flex gap-2 flex-wrap">
                <Input
                  id="image"
                  placeholder="/gallery-image.jpg or https://..."
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value })
                    setPreviewImage(e.target.value)
                  }}
                  required
                  className="flex-1 min-w-[200px]"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
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
                      Upload to Cloudinary
                    </>
                  )}
                </Button>
              </div>
              {previewImage ? (
                <div className="relative inline-block mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-40 rounded-lg border border-border object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7"
                    onClick={() => {
                      setPreviewImage(null)
                      setFormData({ ...formData, image: "" })
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
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
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting
                  ? "Saving..."
                  : selectedItem
                    ? "Update Image"
                    : "Add Image"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedItem?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
