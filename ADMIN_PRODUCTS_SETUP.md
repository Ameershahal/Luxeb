# Admin Products Management Setup

## ✅ What's Been Implemented

### 1. Database Model
- **File**: `lib/models/Product.ts`
- MongoDB schema for products with all required fields
- Includes validation and timestamps

### 2. API Routes
- **GET `/api/products`** - Fetch all products (with optional category/featured filters)
- **POST `/api/products`** - Create new product
- **GET `/api/products/[id]`** - Get single product
- **PUT `/api/products/[id]`** - Update product
- **DELETE `/api/products/[id]`** - Delete product

### 3. Admin Interface
- **File**: `app/admin/products/page.tsx`
- Full CRUD functionality:
  - ✅ View all products in a table
  - ✅ Search products
  - ✅ Add new products
  - ✅ Edit existing products
  - ✅ Delete products (with confirmation)
  - ✅ Image upload via Cloudinary
  - ✅ Form validation
  - ✅ Toast notifications
  - ✅ Loading states

## 🚀 Getting Started

### Step 1: Migrate Existing Products

If you have existing products in `lib/products.ts`, migrate them to MongoDB:

**Option A: Using the migration script**
```bash
# Install tsx if not already installed
npm install -D tsx

# Run migration
npx tsx scripts/migrate-products.ts
```

**Option B: Manual migration via Admin Panel**
1. Go to `/admin/products`
2. Click "Add Product"
3. Manually add each product from your existing list

### Step 2: Access Admin Panel

1. Navigate to `/admin/products`
2. You should see your products (if migrated) or an empty list
3. Start adding/editing products!

## 📝 Features

### Add Product
1. Click "Add Product" button
2. Fill in the form:
   - **Product Name** (required)
   - **Category** (required): Nails, Hair, or Beauty
   - **Price** (required): in GBP (£)
   - **Original Price** (optional): for sale prices
   - **Description** (required)
   - **Benefits**: Comma-separated list
   - **Ingredients** (optional)
   - **How to Use** (optional)
   - **Main Image**: URL or upload via Cloudinary
   - **Additional Images**: One URL per line
   - **In Stock**: Toggle
   - **Featured**: Toggle
3. Click "Create Product"

### Edit Product
1. Click the edit icon (pencil) next to any product
2. Modify the fields
3. Click "Update Product"

### Delete Product
1. Click the delete icon (trash) next to any product
2. Confirm deletion in the dialog
3. Product will be permanently deleted

### Image Upload
1. Click "Upload" button next to image URL field
2. Select an image file
3. Image will be uploaded to Cloudinary
4. URL will be automatically filled in

**Note**: Make sure Cloudinary environment variables are set in Vercel!

## 🔄 Updating Shop Pages to Use API

Currently, shop pages still use the static `lib/products.ts` array. To use products from the database:

### Option 1: Update Shop Page to Fetch from API

**File**: `app/shop/page.tsx`
```typescript
// Replace static import with API fetch
const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`)
const data = await response.json()
const products = data.products || []
```

### Option 2: Keep Static Array as Fallback

You can keep the static array for initial load and update it periodically, or use it as a fallback if the API fails.

## 🗄️ Database Structure

Products are stored in MongoDB with the following structure:

```typescript
{
  _id: ObjectId,
  name: string,
  price: number,
  originalPrice?: number,
  rating: number,
  reviews: number,
  image: string,
  images: string[],
  category: 'nails' | 'hair' | 'beauty',
  description: string,
  benefits: string[],
  ingredients?: string,
  howToUse?: string,
  inStock: boolean,
  featured: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Products not showing
- Check MongoDB connection: Visit `/api/test-db`
- Verify products exist in database
- Check browser console for errors

### Image upload not working
- Verify Cloudinary env vars are set in Vercel
- Check `/api/upload` endpoint is accessible
- Verify file size (Cloudinary has limits)

### Can't save product
- Check all required fields are filled
- Verify price is a valid number
- Check browser console for API errors
- Verify MongoDB connection

### Edit/Delete not working
- Check product ID is correct
- Verify API routes are accessible
- Check browser console for errors

## 📊 Next Steps

1. ✅ Migrate existing products to MongoDB
2. ⚠️ Update shop pages to fetch from API (optional)
3. ⚠️ Add product image gallery management
4. ⚠️ Add bulk import/export functionality
5. ⚠️ Add product variants (sizes, colors, etc.)

---

**The admin products panel is now fully functional!** 🎉
