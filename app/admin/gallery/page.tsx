"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AdminGallery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock gallery items
  const galleryItems = [
    { id: 1, image: "/after-luxury-nail-art-gold-dark-red-elegant-manicu.jpg", category: "nails", title: "Gold & Burgundy Elegance" },
    { id: 2, image: "/after-hair-styling-glossy-elegant-waves-profession.jpg", category: "hair", title: "Hollywood Waves" },
    { id: 3, image: "/gallery-nail-art-minimalist-french-gold.jpg", category: "nails", title: "Modern French" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Gallery</h1>
          <p className="text-muted-foreground">Manage your portfolio images</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
              <DialogDescription>Upload a new image to your portfolio</DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Image Title</Label>
                <Input id="title" placeholder="Enter image title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="nails, hair, beauty" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" placeholder="/gallery-image.jpg" />
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Or upload an image file</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Add Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
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
    </div>
  )
}
