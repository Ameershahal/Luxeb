# Admin Products Setup Guide

## Current Status

The admin products page is **connected to MongoDB**, but the database is likely **empty**. 

## How It Works

1. **Admin Page** (`/admin/products`):
   - Fetches products from MongoDB via `/api/admin/products`
   - Shows "Seed Products" button if database is empty
   - Full CRUD functionality (Create, Read, Update, Delete)

2. **API Routes**:
   - `GET /api/admin/products` - Fetch all products
   - `POST /api/admin/products` - Create new product
   - `PUT /api/admin/products/[id]` - Update product
   - `DELETE /api/admin/products/[id]` - Delete product
   - `POST /api/admin/seed-products` - Seed database with hardcoded products

3. **Frontend Shop Pages**:
   - Currently still using hardcoded products from `lib/products.ts`
   - Can be updated to fetch from database if needed

## Setup Steps

### Step 1: Seed the Database

1. Go to `/admin/login`
2. Login with: `admin@luxebeauty.com` / `admin123`
3. Navigate to `/admin/products`
4. If you see "Seed Products" button, click it
5. This will populate the database with 8 products from `lib/products.ts`

### Step 2: Verify Products

After seeding:
- Products should appear in the table
- You can edit/delete them
- You can add new products

### Step 3: Test CRUD Operations

1. **Create**: Click "Add Product" → Fill form → Click "Create Product"
2. **Edit**: Click Edit icon → Modify fields → Click "Update Product"
3. **Delete**: Click Delete icon → Confirm → Product removed

## Troubleshooting

### Issue: "No products found"
**Solution**: Click "Seed Products" button to populate database

### Issue: Edit/Delete not working
**Solution**: 
- Check browser console for errors
- Verify MongoDB connection
- Check API routes are accessible

### Issue: Products not saving
**Solution**:
- Check MongoDB connection string in `.env.local`
- Verify all required fields are filled
- Check browser console for API errors

## Database Schema

Products are stored in MongoDB with this structure:
```typescript
{
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
  createdAt: Date
  updatedAt: Date
}
```

## Next Steps

1. ✅ Seed database with products
2. ⏳ Update frontend shop pages to fetch from database (optional)
3. ⏳ Add image upload functionality
4. ⏳ Add bulk import/export

---

**Status**: Admin products CRUD is fully functional and connected to MongoDB! 🎉
