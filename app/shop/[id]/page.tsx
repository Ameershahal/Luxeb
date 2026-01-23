import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ProductDetail } from "@/components/shop/product-detail"
import { RelatedProducts } from "@/components/shop/related-products"
import { products } from "@/lib/products"

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

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
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

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
