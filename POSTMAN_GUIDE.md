# Postman Testing Guide

## Step 1: Register a User

**Request:**
```
POST http://localhost:5000/api/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** You'll get something like:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "678b81672d82e228da00e395",  ← COPY THIS ID!
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**IMPORTANT:** Copy the `id` value from the response!

---

## Step 2: Create a Workspace

**Request:**
```
POST http://localhost:5000/api/workspaces
```

**Headers:**
```
Content-Type: application/json
x-user-id: 678b81672d82e228da00e395  ← PASTE THE USER ID HERE
```

**How to add headers in Postman:**
1. Click the "Headers" tab (next to Body)
2. Add a new row:
   - Key: `x-user-id`
   - Value: (paste the user id you copied)

**Body (JSON):**
```json
{
  "name": "My First Workspace",
  "description": "Test workspace"
}
```

**Response:** You'll get:
```json
{
  "message": "Workspace created successfully",
  "workspace": {
    "_id": "698b81672d82e228da00e395",  ← COPY THIS ID!
    "name": "My First Workspace",
    "description": "Test workspace",
    "owner": "678b81672d82e228da00e395"
  }
}
```

**IMPORTANT:** Copy the `_id` value from the response!

---

## Step 3: Register Another User to Invite

**Request:**
```
POST http://localhost:5000/api/auth/register
```

**Body (JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

This creates the user you'll invite to the workspace.

---

## Step 4: Invite User to Workspace

**Request:**
```
POST http://localhost:5000/api/workspaces/698b81672d82e228da00e395/invite
                                          ↑ REPLACE WITH YOUR WORKSPACE ID
```

**Headers:**
```
Content-Type: application/json
x-user-id: 678b81672d82e228da00e395  ← USE THE FIRST USER'S ID (workspace owner)
```

**Body (JSON):**
```json
{
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

**Response:**
```json
{
  "message": "User invited successfully"
}
```

---

## Quick Reference: Adding Headers in Postman

1. Open your request in Postman
2. Click the **"Headers"** tab (it's next to Params, Authorization, Body)
3. In the KEY column, type: `x-user-id`
4. In the VALUE column, paste the user ID you copied
5. Make sure the checkbox next to the header is checked (enabled)

---

## Common Issues

### Error: "Authentication required"
- You forgot to add the `x-user-id` header
- Solution: Add the header as shown above

### Error: "Invalid workspace ID format"
- You're using `{workspaceId}` literally in the URL
- Solution: Replace it with the actual workspace ID from Step 2

### Error: "User not found"
- The email in the body doesn't exist in the database
- Solution: Register that user first (Step 3)

### Error: "You are not a member of this workspace"
- The user ID in the header is not the workspace owner
- Solution: Use the workspace owner's user ID in the header
