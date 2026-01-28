# MongoDB Integration Setup Guide

## Overview
MongoDB has been integrated into the Luxe Beauty & Training website to store:
- **Bookings**: Service appointments with payment information
- **Orders**: Product purchases
- **Course Enrollments**: Training course registrations

## Environment Variables

Add this environment variable to your `.env.local` file (for local development) and Vercel dashboard (for production):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luxe-beauty?retryWrites=true&w=majority
```

## Getting Your MongoDB Connection String

### Option 1: MongoDB Atlas (Recommended - Free Tier Available)

1. **Create a MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Choose the **FREE** (M0) cluster tier

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose your cloud provider and region (closest to your Vercel deployment)
   - Click "Create" (takes 3-5 minutes)

3. **Set Up Database Access**
   - Go to **Database Access** → **Add New Database User**
   - Create a username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to **Network Access** → **Add IP Address**
   - For Vercel: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For local development: Add your current IP address
   - Click "Confirm"

5. **Get Your Connection String**
   - Go to **Database** → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `luxe-beauty` (or your preferred database name)
   - Example: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/luxe-beauty?retryWrites=true&w=majority`

### Option 2: Local MongoDB

If you prefer to run MongoDB locally:

1. **Install MongoDB**
   - Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB**
   ```bash
   # On Mac/Linux
   mongod

   # On Windows
   net start MongoDB
   ```

3. **Connection String**
   ```
   mongodb://localhost:27017/luxe-beauty
   ```

## Database Models

### Booking Model
Stores service appointments:
- Service details (name, category, duration, price)
- Stylist information
- Date and time
- Client information
- Payment details (Stripe session ID, amount, status)
- Booking status and confirmation number

### Order Model
Stores product purchases:
- Order items (products, quantities, prices)
- Customer information
- Payment details
- Shipping address (optional)
- Order status and order number

### CourseEnrollment Model
Stores course registrations:
- Course details (title, description, duration, location, price)
- Student information
- Payment details
- Enrollment status and enrollment number

## API Endpoints

### Bookings API
- `GET /api/bookings?email=user@example.com&status=confirmed` - Get bookings (filtered by email/status)
- `POST /api/bookings` - Create a new booking

### Orders API
- `GET /api/orders?email=user@example.com&status=processing` - Get orders (filtered by email/status)
- `POST /api/orders` - Create a new order

## How It Works

### Booking Flow
1. Customer completes booking form
2. Payment processed via Stripe
3. Stripe webhook receives `checkout.session.completed` event
4. Webhook saves booking to MongoDB with payment details
5. Booking status set to "confirmed"

### Product Purchase Flow
1. Customer clicks "Buy Now" on product
2. Payment processed via Stripe
3. Stripe webhook receives payment confirmation
4. Webhook saves order to MongoDB
5. Order status set to "processing"

### Course Enrollment Flow
1. Customer clicks "Enroll Now" on course
2. Payment processed via Stripe
3. Stripe webhook receives payment confirmation
4. Webhook saves enrollment to MongoDB
5. Enrollment status set to "confirmed"

## Testing

### Test Database Connection
You can test the connection by making a request to any API endpoint that uses MongoDB:

```bash
# Test bookings endpoint
curl http://localhost:3000/api/bookings
```

### View Data in MongoDB Atlas
1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Select your database (`luxe-beauty`)
4. View collections: `bookings`, `orders`, `courseenrollments`

## Security Notes

1. **Never commit your MongoDB URI** to git
2. **Use environment variables** for all sensitive data
3. **Restrict network access** in MongoDB Atlas to only necessary IPs
4. **Use strong passwords** for database users
5. **Enable MongoDB Atlas encryption** for production

## Troubleshooting

### Connection Errors

**Error: "MongoNetworkError"**
- Check your network access settings in MongoDB Atlas
- Verify your IP address is whitelisted
- Check if MongoDB Atlas cluster is running

**Error: "Authentication failed"**
- Verify username and password in connection string
- Check database user permissions
- Ensure password doesn't contain special characters (URL encode if needed)

**Error: "MongoDB_URI is not set"**
- Add `MONGODB_URI` to your `.env.local` file
- Restart your development server
- Verify environment variables in Vercel dashboard

### Data Not Saving

- Check webhook logs in Stripe Dashboard
- Check MongoDB Atlas logs
- Verify webhook endpoint is accessible
- Check that models are imported correctly

## Next Steps

1. Set up MongoDB Atlas account
2. Get your connection string
3. Add `MONGODB_URI` to Vercel environment variables
4. Test a booking/purchase to verify data is saved
5. Set up MongoDB Compass (optional) for easier database management

## Useful Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
