"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  description: string
  image: string
  images: string[]
  inStock: boolean
  featured: boolean
  rating: number
  reviews: number
}

export default function AdminProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
    image: "",
    images: "",
    inStock: true,
    featured: false,
    rating: "0",
    reviews: "0",
  })

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/products")
      const result = await response.json()
      if (result.success) {
        setProducts(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (product?: Product) => {
    console.log("Opening dialog for product:", product)
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        category: product.category,
        description: product.description || "",
        image: product.image || "",
        images: (product.images || []).join(", "),
        inStock: product.inStock !== undefined ? product.inStock : true,
        featured: product.featured || false,
        rating: (product.rating || 0).toString(),
        reviews: (product.reviews || 0).toString(),
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        description: "",
        image: "",
        images: "",
        inStock: true,
        featured: false,
        rating: "0",
        reviews: "0",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        images: formData.images.split(",").map((img) => img.trim()).filter(Boolean),
        inStock: formData.inStock,
        featured: formData.featured,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
      }

      const url = editingProduct
        ? `/api/admin/products/${editingProduct._id}`
        : "/api/admin/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: editingProduct ? "Product updated successfully" : "Product created successfully",
        })
        setIsDialogOpen(false)
        fetchProducts()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    console.log("Deleting product:", id)
    if (!id) {
      toast({
        title: "Error",
        description: "Invalid product ID",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      console.log("Sending DELETE request to:", `/api/admin/products/${id}`)
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      console.log("Delete response:", result)

      if (result.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        fetchProducts()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          {products.length === 0 && (
            <Button
              onClick={async () => {
                try {
                  const response = await fetch("/api/admin/seed-products", {
                    method: "POST",
                  })
                  const result = await response.json()
                  if (result.success) {
                    toast({
                      title: "Success",
                      description: `Seeded ${result.count} products from hardcoded data`,
                    })
                    fetchProducts()
                  } else {
                    toast({
                      title: "Info",
                      description: result.message || "Products already exist or failed to seed",
                    })
                  }
                } catch (error) {
                  console.error("Error seeding products:", error)
                  toast({
                    title: "Error",
                    description: "Failed to seed products",
                    variant: "destructive",
                  })
                }
              }}
              variant="outline"
              type="button"
            >
              Seed Products
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingProduct(null)
              setFormData({
                name: "",
                price: "",
                originalPrice: "",
                category: "",
                description: "",
                image: "",
                images: "",
                inStock: true,
                featured: false,
                rating: "0",
                reviews: "0",
              })
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={(e) => {
                  e.preventDefault()
                  handleOpenDialog()
                }}
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product information" : "Create a new product listing for your store"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (£) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (£)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="nails, hair, beauty"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Product description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Main Image URL *</Label>
                <Input
                  id="image"
                  placeholder="/product-image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Additional Images (comma-separated)</Label>
                <Input
                  id="images"
                  placeholder="/img1.jpg, /img2.jpg"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingProduct ? "Update Product" : "Create Product"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id} onClick={(e) => e.stopPropagation()}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell>£{product.price}</TableCell>
                  <TableCell>{product.inStock ? "In Stock" : "Out of Stock"}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.inStock
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {product.inStock ? "Active" : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("Edit clicked for product:", product._id)
                          handleOpenDialog(product)
                        }}
                        type="button"
                        aria-label="Edit product"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("Delete clicked for product:", product._id)
                          handleDelete(product._id)
                        }}
                        type="button"
                        aria-label="Delete product"
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
      </div>
    </div>
  )
}
