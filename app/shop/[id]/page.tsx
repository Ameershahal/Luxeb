import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ProductDetail } from "@/components/shop/product-detail"
import { RelatedProducts } from "@/components/shop/related-products"

type ProductPageProps = {
  params: Promise<{ id: string }>
}

async function fetchProduct(id: string) {
  try {
    // Directly use MongoDB connection for server-side
    const connectDB = (await import('@/lib/mongodb')).default
    const Product = (await import('@/lib/models/Product')).default
    
    await connectDB()
    const product = await Product.findById(id)
    
    if (product) {
      const productObj = product.toObject ? product.toObject() : product
      return {
        _id: productObj._id?.toString() || productObj._id,
        id: productObj._id?.toString() || productObj._id,
        name: productObj.name || '',
        price: productObj.price || 0,
        originalPrice: productObj.originalPrice,
        rating: productObj.rating || 0,
        reviews: productObj.reviews || 0,
        image: productObj.image || '/placeholder.svg',
        images: productObj.images && productObj.images.length > 0 ? productObj.images : [productObj.image || '/placeholder.svg'],
        category: productObj.category || 'beauty',
        description: productObj.description || '',
        benefits: productObj.benefits || [],
        ingredients: productObj.ingredients,
        howToUse: productObj.howToUse,
        inStock: productObj.inStock !== undefined ? productObj.inStock : true,
        featured: productObj.featured || false,
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function fetchAllProducts() {
  try {
    // Directly use MongoDB connection for server-side
    const connectDB = (await import('@/lib/mongodb')).default
    const Product = (await import('@/lib/models/Product')).default
    
    await connectDB()
    const products = await Product.find({}).sort({ createdAt: -1 })
    
    return products.map((product: any) => {
      const productObj = product.toObject ? product.toObject() : product
      return {
        _id: productObj._id?.toString() || productObj._id,
        id: productObj._id?.toString() || productObj._id,
        name: productObj.name || '',
        price: productObj.price || 0,
        originalPrice: productObj.originalPrice,
        rating: productObj.rating || 0,
        reviews: productObj.reviews || 0,
        image: productObj.image || '/placeholder.svg',
        images: productObj.images && productObj.images.length > 0 ? productObj.images : [productObj.image || '/placeholder.svg'],
        category: productObj.category || 'beauty',
        description: productObj.description || '',
        benefits: productObj.benefits || [],
        ingredients: productObj.ingredients,
        howToUse: productObj.howToUse,
        inStock: productObj.inStock !== undefined ? productObj.inStock : true,
        featured: productObj.featured || false,
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const product = await fetchProduct(id)

  if (!product) {
    return { title: "Product Not Found | Luxe Beauty & Training" }
  }

  return {
    title: `${product.name} | Luxe Beauty & Training`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await fetchProduct(id)

  if (!product) {
    notFound()
  }

  const allProducts = await fetchAllProducts()
  const relatedProducts = allProducts
    .filter((p: any) => p.category === product.category && (p._id || p.id) !== id)
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <ProductDetail product={product} />
        <RelatedProducts products={relatedProducts} />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  )
}
