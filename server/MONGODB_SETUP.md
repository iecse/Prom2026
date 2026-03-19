# MongoDB Setup Guide for Prometheus 2026

## Option 1: MongoDB Atlas (Cloud - Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Verify your email

### Step 2: Create a Cluster
1. Click "Create" to build a new cluster
2. Select **M0 Sandbox** (Free tier)
3. Choose your preferred cloud provider (AWS, Google Cloud, Azure)
4. Select a region close to you
5. Click "Create Cluster" (wait 5-10 minutes for cluster to be created)

### Step 3: Set Up Database User
1. In the left sidebar, go to **Database Access**
2. Click **Add New Database User**
3. Create username and password (save these!)
4. Assign role: **Read and write to any database**
5. Click **Add User**

### Step 4: Set Up IP Whitelist
1. In the left sidebar, go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - For production, use specific IP addresses
4. Click **Confirm**

### Step 5: Get Connection String
1. Click **Clusters** in the left sidebar
2. Click **Connect** on your cluster
3. Select **Connect your application**
4. Choose **Node.js** as driver
5. Copy the connection string (it looks like below):

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prometheus?retryWrites=true&w=majority
```

### Step 6: Update .env File
Replace placeholders with your actual credentials:

```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/prometheus?retryWrites=true&w=majority
```

---

## Option 2: MongoDB Local Installation

### Step 1: Install MongoDB
- **Windows**: Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Mac**: Use Homebrew: `brew tap mongodb/brew && brew install mongodb-community`
- **Linux**: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

### Step 2: Start MongoDB Service
- **Windows**: MongoDB starts automatically as a service
- **Mac/Linux**: Run `mongod` command

### Step 3: Update .env File
```
MONGODB_URI=mongodb://localhost:27017/prometheus
```

---

## Troubleshooting

### Connection String Issues
- Ensure username and password don't contain special characters
- If they do, URL-encode them: `@` → `%40`, `:` → `%3A`
- Example: `password@123` becomes `password%40123`

### Database Not Created
MongoDB automatically creates the database when you first write to it

### "Cluster not ready"
Wait a few minutes for the cluster to fully initialize

---

## Verify Connection

After setting MongoDB URI in `.env`, run:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

---

## Next Steps

1. Start your backend server: `npm run dev`
2. Test API endpoints using curl or Postman
3. Connect your frontend to the backend

---

### Useful MongoDB Atlas Links
- [Connection Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)
- [Database User Reference](https://docs.atlas.mongodb.com/security-add-mongodb-users/)
- [IP Whitelist Documentation](https://docs.atlas.mongodb.com/security-whitelist/)
