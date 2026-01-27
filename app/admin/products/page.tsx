"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, Upload, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  category: string
  description: string
  benefits: string[]
  ingredients?: string
  howToUse?: string
  inStock: boolean
  featured: boolean
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    images: [] as string[],
    category: "nails",
    description: "",
    benefits: "",
    ingredients: "",
    howToUse: "",
    inStock: true,
    featured: false,
  })

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products")
      
      // Check if response is OK
      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}: Failed to fetch products`
        const contentType = response.headers.get('content-type')
        
        try {
          // Try to get error message from response
          const responseText = await response.text()
          
          if (responseText && responseText.trim()) {
            try {
              const errorData = JSON.parse(responseText)
              // Check if we have error information
              if (errorData.error) {
                errorMsg = errorData.error
              } else if (errorData.message) {
                errorMsg = errorData.message
              } else if (Object.keys(errorData).length > 0) {
                // If object has keys but no error/message, use the first value
                const firstKey = Object.keys(errorData)[0]
                errorMsg = `${firstKey}: ${errorData[firstKey]}`
              } else {
                // Empty object - use status text
                errorMsg = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`
              }
            } catch {
              // Not JSON, use text as error message
              errorMsg = responseText.substring(0, 200) || response.statusText || errorMsg
            }
          } else {
            // Empty response body
            errorMsg = `HTTP ${response.status}: ${response.statusText || 'Empty response'}`
          }
        } catch (parseError: any) {
          // If reading response fails
          errorMsg = `HTTP ${response.status}: ${response.statusText || 'Failed to read response'}`
          console.error("Failed to parse error response:", parseError)
        }
        
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          contentType: contentType,
          errorMessage: errorMsg,
        })
        
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        })
        setProducts([])
        return
      }
      
      // Parse successful response
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products || [])
        // If no products, that's fine - just show empty state
        if (data.products && data.products.length === 0) {
          console.log("No products found in database. Add products using the 'Add Product' button.")
        }
      } else {
        const errorMsg = data.error || data.message || "Failed to fetch products"
        console.error("API Error:", data)
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        })
        setProducts([])
      }
    } catch (error: any) {
      console.error("Error fetching products:", error)
      const errorMsg = error.message || "Failed to fetch products. Please check your connection and MongoDB setup."
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAddDialog = () => {
    setSelectedProduct(null)
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      image: "",
      images: [],
      category: "nails",
      description: "",
      benefits: "",
      ingredients: "",
      howToUse: "",
      inStock: true,
      featured: false,
    })
    setIsDialogOpen(true)
  }

  const handleOpenEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      image: product.image,
      images: product.images || [],
      category: product.category,
      description: product.description,
      benefits: product.benefits.join(", "),
      ingredients: product.ingredients || "",
      howToUse: product.howToUse || "",
      inStock: product.inStock,
      featured: product.featured,
    })
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 10MB",
          variant: "destructive",
        })
        return
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        const imageUrl = data.url
        setFormData((prev) => ({
          ...prev,
          image: prev.image || imageUrl,
          images: prev.images.includes(imageUrl) ? prev.images : [...prev.images, imageUrl],
        }))
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.image || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: formData.image,
        images: formData.images.length > 0 ? formData.images : [formData.image],
        category: formData.category,
        description: formData.description,
        benefits: formData.benefits
          .split(",")
          .map((b) => b.trim())
          .filter((b) => b.length > 0),
        ingredients: formData.ingredients || undefined,
        howToUse: formData.howToUse || undefined,
        inStock: formData.inStock,
        featured: formData.featured,
      }

      const url = selectedProduct
        ? `/api/products/${selectedProduct._id}`
        : "/api/products"
      const method = selectedProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: selectedProduct
            ? "Product updated successfully"
            : "Product created successfully",
        })
        setIsDialogOpen(false)
        fetchProducts()
      } else {
        throw new Error(data.error || "Failed to save product")
      }
    } catch (error: any) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return

    try {
      const response = await fetch(`/api/products/${selectedProduct._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        setSelectedProduct(null)
        fetchProducts()
      } else {
        throw new Error(data.error || "Failed to delete product")
      }
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button
          onClick={handleOpenAddDialog}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
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
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading products...</div>
      ) : (
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
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product)
                            setIsDeleteDialogOpen(true)
                          }}
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
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct
                ? "Update product information"
                : "Create a new product listing for your store"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nails">Nails</SelectItem>
                    <SelectItem value="hair">Hair</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (£) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (£) (Optional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (comma-separated)</Label>
              <Input
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Benefit 1, Benefit 2, Benefit 3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Input
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="List ingredients"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="howToUse">How to Use</Label>
                <Input
                  id="howToUse"
                  value={formData.howToUse}
                  onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                  placeholder="Usage instructions"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">
                Main Image URL <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/product-image.jpg or Cloudinary URL"
                  required
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    disabled={isUploading}
                  />
                  <Button type="button" variant="outline" disabled={isUploading} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </span>
                  </Button>
                </label>
              </div>
              {formData.image && (
                <div className="relative w-32 h-32 mt-2 border rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Additional Images (URLs, one per line)</Label>
              <Textarea
                value={formData.images.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: e.target.value.split("\n").filter((url) => url.trim()),
                  })
                }
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, inStock: checked as boolean })
                  }
                />
                <Label htmlFor="inStock" className="cursor-pointer">
                  In Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked as boolean })
                  }
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Product
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : selectedProduct
                    ? "Update Product"
                    : "Create Product"}
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
              This action cannot be undone. This will permanently delete the product{" "}
              <strong>{selectedProduct?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
