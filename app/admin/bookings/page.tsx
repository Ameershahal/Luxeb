"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, X, Clock, Plus, Edit, Trash2, Star, Upload, Loader2 } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface AvailableTime {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
}

interface Stylist {
  _id: string
  name: string
  image: string
  specialty: 'nails' | 'beauty' | 'all'
  rating: number
  experience: string
  bio: string
  isActive: boolean
  availableTimes?: AvailableTime[]
}

interface ServiceSize {
  size: 'S' | 'M' | 'L' | 'XL'
  price: number
}

interface Service {
  _id: string
  name: string
  category: string
  duration: number
  price: number
  description: string
  isActive: boolean
  sizes?: ServiceSize[]
}

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
}

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<"bookings" | "stylists" | "services" | "categories">("bookings")
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all")
  
  // Stylist management state
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [isStylistDialogOpen, setIsStylistDialogOpen] = useState(false)
  const [isDeleteStylistDialogOpen, setIsDeleteStylistDialogOpen] = useState(false)
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null)
  const [isStylistLoading, setIsStylistLoading] = useState(true)
  const [isStylistSubmitting, setIsStylistSubmitting] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isUploadingStylistImage, setIsUploadingStylistImage] = useState(false)
  const [stylistPreviewImage, setStylistPreviewImage] = useState<string | null>(null)
  const stylistImageInputRef = useRef<HTMLInputElement>(null)
  
  // Service management state
  const [services, setServices] = useState<Service[]>([])
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isServiceLoading, setIsServiceLoading] = useState(true)
  const [isServiceSubmitting, setIsServiceSubmitting] = useState(false)
  const [isSeedingServices, setIsSeedingServices] = useState(false)
  
  // Category management state
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isCategoryLoading, setIsCategoryLoading] = useState(true)
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false)
  const [isSeedingCategories, setIsSeedingCategories] = useState(false)
  
  const { toast } = useToast()

  // Stylist form state
  const [stylistFormData, setStylistFormData] = useState({
    name: "",
    image: "",
    specialty: "nails" as "nails" | "beauty" | "all",
    rating: "5.0",
    experience: "",
    bio: "",
    isActive: true,
    availableTimes: [] as AvailableTime[],
  })

  // Service form state
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    category: "",
    duration: "",
    price: "",
    description: "",
    isActive: true,
    sizes: [] as ServiceSize[],
  })

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })

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

  // Fetch stylists
  useEffect(() => {
    if (activeTab === "stylists") {
      fetchStylists()
    }
  }, [activeTab])

  // Fetch services
  useEffect(() => {
    if (activeTab === "services") {
      fetchServices()
    }
  }, [activeTab])

  // Fetch categories
  useEffect(() => {
    if (activeTab === "categories") {
      fetchCategories()
    } else if (activeTab === "services") {
      // Also fetch categories when on services tab to populate dropdown
      fetchCategories()
    }
  }, [activeTab])

  // Refresh categories when service dialog opens
  useEffect(() => {
    if (isServiceDialogOpen) {
      fetchCategories()
    }
  }, [isServiceDialogOpen])

  const fetchStylists = async () => {
    try {
      setIsStylistLoading(true)
      const response = await fetch("/api/admin/stylists")
      const data = await response.json()
      
      if (data.success) {
        setStylists(data.stylists || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch stylists",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching stylists:", error)
      toast({
        title: "Error",
        description: "Failed to fetch stylists",
        variant: "destructive",
      })
    } finally {
      setIsStylistLoading(false)
    }
  }

  const handleStylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsStylistSubmitting(true)

    try {
      const isUpdate = selectedStylist && selectedStylist._id
      
      if (isUpdate && !selectedStylist._id) {
        toast({
          title: "Error",
          description: "Stylist ID is missing. Please try again.",
          variant: "destructive",
        })
        setIsStylistSubmitting(false)
        return
      }

      const url = isUpdate
        ? `/api/admin/stylists/${selectedStylist._id}`
        : "/api/admin/stylists"
      
      const method = isUpdate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stylistFormData,
          rating: parseFloat(stylistFormData.rating),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: isUpdate ? "Stylist updated" : "Stylist created",
          description: `Stylist ${isUpdate ? "updated" : "created"} successfully`,
        })
        setIsStylistDialogOpen(false)
        resetStylistForm()
        setSelectedStylist(null)
        fetchStylists()
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${isUpdate ? "update" : "create"} stylist`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error saving stylist:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save stylist",
        variant: "destructive",
      })
    } finally {
      setIsStylistSubmitting(false)
    }
  }

  const handleDeleteStylist = async () => {
    if (!selectedStylist) return

    try {
      const response = await fetch(`/api/admin/stylists/${selectedStylist._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Stylist deleted",
          description: "Stylist deleted successfully",
        })
        setIsDeleteStylistDialogOpen(false)
        setSelectedStylist(null)
        fetchStylists()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete stylist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting stylist:", error)
      toast({
        title: "Error",
        description: "Failed to delete stylist",
        variant: "destructive",
      })
    }
  }

  const handleStylistFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingStylistImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setStylistFormData(prev => ({ ...prev, image: data.url }))
        setStylistPreviewImage(data.url)
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
      setIsUploadingStylistImage(false)
    }
  }

  const openStylistDialog = (stylist?: Stylist) => {
    if (stylist) {
      setSelectedStylist(stylist)
      setStylistFormData({
        name: stylist.name,
        image: stylist.image,
        specialty: stylist.specialty,
        rating: stylist.rating.toString(),
        experience: stylist.experience,
        bio: stylist.bio,
        isActive: stylist.isActive,
        availableTimes: stylist.availableTimes || [],
      })
      setStylistPreviewImage(stylist.image)
    } else {
      setSelectedStylist(null)
      resetStylistForm()
    }
    setIsStylistDialogOpen(true)
  }

  const resetStylistForm = () => {
    setStylistFormData({
      name: "",
      image: "",
      specialty: "nails",
      rating: "5.0",
      experience: "",
      bio: "",
      isActive: true,
      availableTimes: [],
    })
    setStylistPreviewImage(null)
    if (stylistImageInputRef.current) {
      stylistImageInputRef.current.value = ""
    }
  }

  const addAvailableTime = () => {
    setStylistFormData({
      ...stylistFormData,
      availableTimes: [
        ...stylistFormData.availableTimes,
        { day: 'monday', startTime: '09:00', endTime: '17:00' },
      ],
    })
  }

  const removeAvailableTime = (index: number) => {
    setStylistFormData({
      ...stylistFormData,
      availableTimes: stylistFormData.availableTimes.filter((_, i) => i !== index),
    })
  }

  const updateAvailableTime = (index: number, field: keyof AvailableTime, value: string) => {
    const updated = [...stylistFormData.availableTimes]
    updated[index] = { ...updated[index], [field]: value }
    setStylistFormData({
      ...stylistFormData,
      availableTimes: updated,
    })
  }

  const formatAvailableTimes = (times: AvailableTime[]): string => {
    if (!times || times.length === 0) return "Not set"
    const dayNames: Record<string, string> = {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
    }
    return times
      .map((t) => `${dayNames[t.day]}: ${t.startTime}-${t.endTime}`)
      .join(', ')
  }

  const handleSeedStylists = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch("/api/admin/seed-stylists", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Stylists Added",
          description: `Created ${data.created} stylists, skipped ${data.skipped} existing ones`,
        })
        fetchStylists()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed stylists",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding stylists:", error)
      toast({
        title: "Error",
        description: "Failed to seed stylists",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  // Service management functions
  const fetchServices = async () => {
    try {
      setIsServiceLoading(true)
      const response = await fetch("/api/admin/services")
      const data = await response.json()
      
      if (data.success) {
        setServices(data.services || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch services",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      })
    } finally {
      setIsServiceLoading(false)
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const hasSizePrices = serviceFormData.sizes && serviceFormData.sizes.length > 0
    const hasNormalPrice = serviceFormData.price !== '' && !Number.isNaN(parseFloat(serviceFormData.price))
    if (!hasSizePrices && !hasNormalPrice) {
      toast({
        title: "Error",
        description: "Enter either a price or at least one size price (S, M, L, XL).",
        variant: "destructive",
      })
      return
    }

    setIsServiceSubmitting(true)

    try {
      const isUpdate = selectedService && selectedService._id
      
      if (isUpdate && !selectedService._id) {
        toast({
          title: "Error",
          description: "Service ID is missing. Please try again.",
          variant: "destructive",
        })
        setIsServiceSubmitting(false)
        return
      }

      const url = isUpdate
        ? `/api/admin/services/${selectedService._id}`
        : "/api/admin/services"
      
      const method = isUpdate ? "PUT" : "POST"

      const payload: Record<string, unknown> = {
        ...serviceFormData,
        duration: parseInt(serviceFormData.duration),
        sizes: serviceFormData.sizes && serviceFormData.sizes.length > 0 ? serviceFormData.sizes : [],
      }
      if (hasNormalPrice) {
        payload.price = parseFloat(serviceFormData.price)
      } else if (!hasSizePrices) {
        payload.price = 0
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: isUpdate ? "Service updated" : "Service created",
          description: `Service ${isUpdate ? "updated" : "created"} successfully`,
        })
        setIsServiceDialogOpen(false)
        resetServiceForm()
        setSelectedService(null)
        fetchServices()
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${isUpdate ? "update" : "create"} service`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error saving service:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save service",
        variant: "destructive",
      })
    } finally {
      setIsServiceSubmitting(false)
    }
  }

  const handleDeleteService = async () => {
    if (!selectedService) return

    try {
      const response = await fetch(`/api/admin/services/${selectedService._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Service deleted",
          description: "Service deleted successfully",
        })
        setIsDeleteServiceDialogOpen(false)
        setSelectedService(null)
        fetchServices()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete service",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting service:", error)
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      })
    }
  }

  const openServiceDialog = async (service?: Service) => {
    // Fetch latest categories before opening dialog
    const latestCategories = await fetchCategories()
    
    if (service) {
      setSelectedService(service)
      setServiceFormData({
        name: service.name,
        category: service.category,
        duration: service.duration.toString(),
        price: service.price.toString(),
        description: service.description || "",
        isActive: service.isActive,
        sizes: (service.sizes && service.sizes.length > 0 ? service.sizes : []) as ServiceSize[],
      })
    } else {
      setSelectedService(null)
      const firstCategory = latestCategories.find(cat => cat.isActive)
      setServiceFormData({
        name: "",
        category: firstCategory ? (firstCategory.slug || firstCategory.name.toLowerCase()) : "",
        duration: "",
        price: "",
        description: "",
        isActive: true,
        sizes: [],
      })
    }
    setIsServiceDialogOpen(true)
  }

  const resetServiceForm = () => {
    const firstCategory = categories.find(cat => cat.isActive)
    setServiceFormData({
      name: "",
      category: firstCategory ? (firstCategory.slug || firstCategory.name.toLowerCase()) : "",
      duration: "",
      price: "",
      description: "",
      isActive: true,
      sizes: [],
    })
  }

  const SIZE_LABELS: ServiceSize['size'][] = ['S', 'M', 'L', 'XL']

  const setServiceSizePrice = (size: ServiceSize['size'], value: number | '') => {
    const next = serviceFormData.sizes.filter((s) => s.size !== size)
    if (typeof value === 'number' && !Number.isNaN(value)) {
      next.push({ size, price: value })
      next.sort((a, b) => SIZE_LABELS.indexOf(a.size) - SIZE_LABELS.indexOf(b.size))
    }
    setServiceFormData({ ...serviceFormData, sizes: next })
  }

  const getServiceSizePrice = (size: ServiceSize['size']) =>
    serviceFormData.sizes.find((s) => s.size === size)?.price ?? ''

  const handleSeedServices = async () => {
    setIsSeedingServices(true)
    try {
      const response = await fetch("/api/admin/seed-services", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Services Added",
          description: `Created ${data.created} services, skipped ${data.skipped} existing ones`,
        })
        fetchServices()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed services",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding services:", error)
      toast({
        title: "Error",
        description: "Failed to seed services",
        variant: "destructive",
      })
    } finally {
      setIsSeedingServices(false)
    }
  }

  // Category management functions
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      setIsCategoryLoading(true)
      const response = await fetch("/api/admin/categories")
      const data = await response.json()
      
      if (data.success) {
        const fetchedCategories = data.categories || []
        setCategories(fetchedCategories)
        return fetchedCategories
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        })
        return []
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
      return []
    } finally {
      setIsCategoryLoading(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCategorySubmitting(true)

    try {
      const isUpdate = selectedCategory && selectedCategory._id
      
      if (isUpdate && !selectedCategory._id) {
        toast({
          title: "Error",
          description: "Category ID is missing. Please try again.",
          variant: "destructive",
        })
        setIsCategorySubmitting(false)
        return
      }

      const url = isUpdate
        ? `/api/admin/categories/${selectedCategory._id}`
        : "/api/admin/categories"
      
      const method = isUpdate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryFormData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: isUpdate ? "Category updated" : "Category created",
          description: `Category ${isUpdate ? "updated" : "created"} successfully`,
        })
        setIsCategoryDialogOpen(false)
        resetCategoryForm()
        setSelectedCategory(null)
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${isUpdate ? "update" : "create"} category`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      })
    } finally {
      setIsCategorySubmitting(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Category deleted",
          description: "Category deleted successfully",
        })
        setIsDeleteCategoryDialogOpen(false)
        setSelectedCategory(null)
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setSelectedCategory(category)
      setCategoryFormData({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive,
      })
    } else {
      setSelectedCategory(null)
      resetCategoryForm()
    }
    setIsCategoryDialogOpen(true)
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      isActive: true,
    })
  }

  const handleSeedCategories = async () => {
    setIsSeedingCategories(true)
    try {
      const response = await fetch("/api/admin/seed-categories", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Categories Added",
          description: `Created ${data.created} categories, skipped ${data.skipped} existing ones`,
        })
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed categories",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding categories:", error)
      toast({
        title: "Error",
        description: "Failed to seed categories",
        variant: "destructive",
      })
    } finally {
      setIsSeedingCategories(false)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || booking.status === filter
    return matchesSearch && matchesFilter
  })

  const filteredStylists = stylists.filter((stylist) =>
    stylist.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Bookings</h1>
          <p className="text-muted-foreground">Manage appointments, services, and stylists</p>
        </div>
          {activeTab === "services" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSeedServices}
                disabled={isSeedingServices}
              >
                {isSeedingServices ? "Adding..." : "Add Existing Services"}
              </Button>
              <Button onClick={() => openServiceDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </div>
          )}
          {activeTab === "categories" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSeedCategories}
                disabled={isSeedingCategories}
              >
                {isSeedingCategories ? "Adding..." : "Add Default Categories"}
              </Button>
              <Button onClick={() => openCategoryDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Category
              </Button>
            </div>
          )}
          {activeTab === "stylists" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSeedStylists}
                disabled={isSeeding}
              >
                {isSeeding ? "Adding..." : "Add Existing Stylists"}
              </Button>
              <Button onClick={() => openStylistDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Stylist
              </Button>
            </div>
          )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("bookings")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "bookings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "services"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("stylists")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "stylists"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Stylists
        </button>
      </div>

      {activeTab === "bookings" && (
        <>
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
        </>
      )}

      {activeTab === "services" && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Services Table */}
          {isServiceLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.filter((service) =>
                    service.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No services found</p>
                        <Button onClick={() => openServiceDialog()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Service
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    services
                      .filter((service) =>
                        service.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((service) => (
                        <TableRow key={service._id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell className="capitalize">{service.category}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{service.duration} min</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {service.sizes && service.sizes.length > 0
                              ? `S/M/L/XL from £${Math.min(...service.sizes.map((s) => s.price))}`
                              : `£${service.price}`}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                service.isActive
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {service.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openServiceDialog(service)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedService(service)
                                  setIsDeleteServiceDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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
        </>
      )}

      {activeTab === "categories" && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories Table */}
          {isCategoryLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.filter((category) =>
                    category.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No categories found</p>
                        <Button onClick={() => openCategoryDialog()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Category
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories
                      .filter((category) =>
                        category.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((category) => (
                        <TableRow key={category._id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-sm">
                            {category.slug}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {category.description || "-"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                category.isActive
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openCategoryDialog(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedCategory(category)
                                  setIsDeleteCategoryDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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
        </>
      )}

      {activeTab === "stylists" && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stylists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stylists Table */}
          {isStylistLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading stylists...</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Available Times</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStylists.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No stylists found</p>
                        <Button onClick={() => openStylistDialog()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Stylist
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStylists.map((stylist) => (
                      <TableRow key={stylist._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <img
                              src={stylist.image || "/placeholder.svg"}
                              alt={stylist.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            {stylist.name}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{stylist.specialty}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span>{stylist.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{stylist.experience || "-"}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground max-w-xs truncate block">
                            {formatAvailableTimes(stylist.availableTimes || [])}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              stylist.isActive
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {stylist.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openStylistDialog(stylist)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                setSelectedStylist(stylist)
                                setIsDeleteStylistDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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
        </>
      )}

      {/* Stylist Dialog */}
      <Dialog open={isStylistDialogOpen} onOpenChange={setIsStylistDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStylist ? "Edit Stylist" : "Add New Stylist"}
            </DialogTitle>
            <DialogDescription>
              {selectedStylist
                ? "Update stylist information"
                : "Add a new stylist to your team"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStylistSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stylist-name">Name *</Label>
                <Input
                  id="stylist-name"
                  value={stylistFormData.name}
                  onChange={(e) =>
                    setStylistFormData({ ...stylistFormData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stylist-specialty">Specialty *</Label>
                <Select
                  value={stylistFormData.specialty}
                  onValueChange={(value: "nails" | "beauty" | "all") =>
                    setStylistFormData({ ...stylistFormData, specialty: value })
                  }
                >
                  <SelectTrigger id="stylist-specialty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nails">Nails</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="all">All Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stylist-image">Image</Label>
              <Input
                id="stylist-image"
                value={stylistFormData.image}
                onChange={(e) => {
                  setStylistFormData({ ...stylistFormData, image: e.target.value })
                  setStylistPreviewImage(e.target.value)
                }}
                placeholder="/stylist-image.jpg or https://..."
              />
              
              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center space-y-4">
                  {stylistPreviewImage ? (
                    <div className="relative">
                      <img
                        src={stylistPreviewImage}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setStylistPreviewImage(null)
                          setStylistFormData({ ...stylistFormData, image: "" })
                          if (stylistImageInputRef.current) stylistImageInputRef.current.value = ""
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload an image file</p>
                    </>
                  )}
                  <div>
                    <input
                      ref={stylistImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleStylistFileSelect}
                      className="hidden"
                      id="stylist-file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => stylistImageInputRef.current?.click()}
                      disabled={isUploadingStylistImage}
                    >
                      {isUploadingStylistImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Or paste an image URL in the field above
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stylist-rating">Rating</Label>
                <Input
                  id="stylist-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={stylistFormData.rating}
                  onChange={(e) =>
                    setStylistFormData({ ...stylistFormData, rating: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stylist-experience">Experience</Label>
                <Input
                  id="stylist-experience"
                  value={stylistFormData.experience}
                  onChange={(e) =>
                    setStylistFormData({ ...stylistFormData, experience: e.target.value })
                  }
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stylist-bio">Bio</Label>
              <Textarea
                id="stylist-bio"
                value={stylistFormData.bio}
                onChange={(e) =>
                  setStylistFormData({ ...stylistFormData, bio: e.target.value })
                }
                placeholder="Brief description about the stylist..."
                rows={3}
              />
            </div>

            {/* Available Times */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Available Times</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAvailableTime}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Time Slot
                </Button>
              </div>
              {stylistFormData.availableTimes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No available times set</p>
              ) : (
                <div className="space-y-3 border border-border rounded-lg p-4">
                  {stylistFormData.availableTimes.map((time, index) => (
                    <div key={index} className="grid gap-3 sm:grid-cols-4 items-end">
                      <div className="space-y-2">
                        <Label>Day</Label>
                        <Select
                          value={time.day}
                          onValueChange={(value: AvailableTime['day']) =>
                            updateAvailableTime(index, 'day', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="tuesday">Tuesday</SelectItem>
                            <SelectItem value="wednesday">Wednesday</SelectItem>
                            <SelectItem value="thursday">Thursday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="saturday">Saturday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={time.startTime}
                          onChange={(e) =>
                            updateAvailableTime(index, 'startTime', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={time.endTime}
                          onChange={(e) =>
                            updateAvailableTime(index, 'endTime', e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAvailableTime(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="stylist-active"
                checked={stylistFormData.isActive}
                onCheckedChange={(checked) =>
                  setStylistFormData({ ...stylistFormData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="stylist-active" className="cursor-pointer">
                Active (visible to customers)
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsStylistDialogOpen(false)
                  resetStylistForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isStylistSubmitting}>
                {isStylistSubmitting
                  ? "Saving..."
                  : selectedStylist
                    ? "Update Stylist"
                    : "Create Stylist"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Update category information"
                : "Add a new service category"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={categoryFormData.name}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, name: e.target.value })
                }
                required
                placeholder="e.g., Nails, Beauty, Hair"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryFormData.description}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, description: e.target.value })
                }
                placeholder="Brief description of the category..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-active"
                checked={categoryFormData.isActive}
                onCheckedChange={(checked) =>
                  setCategoryFormData({ ...categoryFormData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="category-active" className="cursor-pointer">
                Active (visible to customers)
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCategoryDialogOpen(false)
                  resetCategoryForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCategorySubmitting}>
                {isCategorySubmitting
                  ? "Saving..."
                  : selectedCategory
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedCategory?.name}". This action cannot be undone.
              {selectedCategory && (
                <span className="block mt-2 text-sm text-muted-foreground">
                  Note: You cannot delete a category if it's being used by any services.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {selectedService
                ? "Update service information"
                : "Add a new service to your offerings"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name *</Label>
                <Input
                  id="service-name"
                  value={serviceFormData.name}
                  onChange={(e) =>
                    setServiceFormData({ ...serviceFormData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-category">Category *</Label>
                <Select
                  value={serviceFormData.category}
                  onValueChange={(value) =>
                    setServiceFormData({ ...serviceFormData, category: value })
                  }
                  disabled={isCategoryLoading || categories.length === 0}
                >
                  <SelectTrigger id="service-category">
                    <SelectValue placeholder={isCategoryLoading ? "Loading categories..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="" disabled>No categories available</SelectItem>
                    ) : (
                      categories
                        .filter(cat => cat.isActive)
                        .map((category) => {
                          const categoryValue = category.slug || category.name.toLowerCase()
                          return (
                            <SelectItem key={category._id} value={categoryValue}>
                              {category.name}
                            </SelectItem>
                          )
                        })
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-duration">Duration (minutes) *</Label>
                <Input
                  id="service-duration"
                  type="number"
                  min="1"
                  value={serviceFormData.duration}
                  onChange={(e) =>
                    setServiceFormData({ ...serviceFormData, duration: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-price">
                  Price (£) {serviceFormData.sizes?.length ? "(optional when size prices are set)" : "*"}
                </Label>
                <Input
                  id="service-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={serviceFormData.price}
                  onChange={(e) =>
                    setServiceFormData({ ...serviceFormData, price: e.target.value })
                  }
                  required={!serviceFormData.sizes?.length}
                  placeholder={serviceFormData.sizes?.length ? "Leave empty if using only sizes" : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  {serviceFormData.sizes?.length
                    ? "Leave empty if this service only has S/M/L/XL prices."
                    : "Base price when no size options are used."}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Size options (optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Add prices for S, M, L, XL. If set, clients will choose a size and see the corresponding price.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SIZE_LABELS.map((size) => (
                  <div key={size} className="space-y-1">
                    <Label className="text-xs">Size {size}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="£"
                      value={getServiceSizePrice(size)}
                      onChange={(e) => {
                        const v = e.target.value
                        setServiceSizePrice(size, v === '' ? '' : parseFloat(v))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={serviceFormData.description}
                onChange={(e) =>
                  setServiceFormData({ ...serviceFormData, description: e.target.value })
                }
                placeholder="Brief description of the service..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="service-active"
                checked={serviceFormData.isActive}
                onCheckedChange={(checked) =>
                  setServiceFormData({ ...serviceFormData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="service-active" className="cursor-pointer">
                Active (visible to customers)
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsServiceDialogOpen(false)
                  resetServiceForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isServiceSubmitting}>
                {isServiceSubmitting
                  ? "Saving..."
                  : selectedService
                    ? "Update Service"
                    : "Create Service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Service Dialog */}
      <AlertDialog open={isDeleteServiceDialogOpen} onOpenChange={setIsDeleteServiceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedService?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Stylist Dialog */}
      <AlertDialog open={isDeleteStylistDialogOpen} onOpenChange={setIsDeleteStylistDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedStylist?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStylist}
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
