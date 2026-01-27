# How to Find or Reset Your MongoDB Password

## Where is Your MongoDB Password?

The MongoDB password is the password you created when you set up your database user in MongoDB Atlas. If you don't remember it, you'll need to reset it.

## Option 1: Check Your Records

Check if you saved it:
- Password manager (LastPass, 1Password, etc.)
- Notes/documentation
- Email from MongoDB Atlas
- `.env.local` file (if you had it before)

## Option 2: Reset Your MongoDB Password

If you don't remember the password, you can reset it:

### Step-by-Step: Reset MongoDB Password

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Log in to your account

2. **Navigate to Database Access**
   - Click **"Security"** in the left sidebar
   - Click **"Database Access"**

3. **Find Your User**
   - Look for the user: `onwaroventures_db_user`
   - Click the **"Edit"** button (pencil icon) next to the user

4. **Reset Password**
   - Click **"Edit Password"** or **"Change Password"**
   - Enter a **new password** (make it strong!)
   - **Save the password** somewhere safe
   - Click **"Update User"**

5. **Update Your Connection String**
   - Copy the new password
   - Update your `.env.local`:
     ```env
     MONGODB_URI=mongodb+srv://onwaroventures_db_user:YOUR_NEW_PASSWORD@cluster0.k4jugr1.mongodb.net/luxe-beauty?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `YOUR_NEW_PASSWORD` with the password you just created

6. **Update Vercel**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update `MONGODB_URI` with the new password
   - Redeploy your project

## Option 3: Create a New Database User (Alternative)

If you prefer to create a new user:

1. **Go to Database Access**
   - MongoDB Atlas → Security → Database Access

2. **Add New Database User**
   - Click **"Add New Database User"**
   - Choose **"Password"** authentication
   - Enter a username (e.g., `luxe_beauty_user`)
   - Enter a password (save it!)
   - Set privileges: **"Atlas admin"** or **"Read and write to any database"**
   - Click **"Add User"**

3. **Update Connection String**
   - Use the new username and password:
     ```env
     MONGODB_URI=mongodb+srv://luxe_beauty_user:YOUR_NEW_PASSWORD@cluster0.k4jugr1.mongodb.net/luxe-beauty?retryWrites=true&w=majority&appName=Cluster0
     ```

## Important Notes

### Password Requirements
- MongoDB passwords can contain special characters
- If your password has special characters, you may need to URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

### Example with Special Characters

If your password is: `MyP@ss#123`

The encoded version would be: `MyP%40ss%23123`

Connection string:
```
mongodb+srv://onwaroventures_db_user:MyP%40ss%23123@cluster0.k4jugr1.mongodb.net/luxe-beauty?retryWrites=true&w=majority&appName=Cluster0
```

## Quick Test

After updating your password:

1. **Test Locally**
   - Update `.env.local` with new password
   - Restart your dev server: `npm run dev`
   - Visit: `http://localhost:3000/api/test-db`
   - Should return: `{ success: true }`

2. **Test in Production**
   - Update Vercel environment variables
   - Redeploy
   - Visit: `https://luxebeautyandtrainingacademy.com/api/test-db`
   - Should return: `{ success: true }`

## Security Tips

1. **Use a Strong Password**
   - At least 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Don't use common words

2. **Never Commit Passwords**
   - Keep passwords in `.env.local` (already in `.gitignore`)
   - Never push passwords to Git
   - Use environment variables in Vercel

3. **Save Passwords Securely**
   - Use a password manager
   - Document in secure notes
   - Don't share passwords in chat/email

## Still Can't Access?

If you can't reset the password:
1. Check you're logged into the correct MongoDB Atlas account
2. Verify you have admin access to the project
3. Contact MongoDB Atlas support if needed

## Next Steps

Once you have your password:
1. ✅ Update `.env.local` with the password
2. ✅ Update Vercel environment variables
3. ✅ Test the connection
4. ✅ Redeploy if needed
