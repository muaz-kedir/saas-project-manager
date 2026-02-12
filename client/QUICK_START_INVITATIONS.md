# 🚀 Quick Start: Inviting Team Members

## For Workspace Owners/Admins

### How to Invite Someone:

1. **Make sure they have an account first!**
   - Share this link with them: `http://localhost:5173/register`
   - They need to register with their email
   - Get their exact email address

2. **Invite them to your workspace:**
   - Open your workspace
   - Click "Members" tab
   - Click "Invite Member" button
   - Enter their email (must match their registered email)
   - Select their role:
     - **Admin** - Can manage workspace and invite members
     - **Member** - Can view and collaborate
   - Click "Send Invitation"
   - ✅ Done! They're added instantly

3. **Tell them to login:**
   - They need to login at `http://localhost:5173/login`
   - The workspace will appear in their dashboard automatically
   - They can click on it to start working

---

## For Invited Users

### How to Access a Workspace You Were Invited To:

1. **Register first (if you haven't):**
   - Go to `/register`
   - Use the email your team will invite you with
   - Create a password
   - Click "Create Account"

2. **Login:**
   - Go to `/login`
   - Enter your email and password
   - Click "Sign In"

3. **See your workspaces:**
   - You'll be redirected to the Dashboard
   - You'll see ALL workspaces:
     - Workspaces you created (Owner badge 👑)
     - Workspaces you were invited to (Admin ⚡ or Member 👤 badge)

4. **Open the workspace:**
   - Click on any workspace card
   - Start collaborating!

---

## 🎯 Quick Example

### Scenario: Adding Sarah to Marketing Team

**Step 1: Sarah Registers**
```
Sarah goes to: http://localhost:5173/register
Email: sarah@company.com
Password: ********
Name: Sarah Johnson
→ Account created ✅
```

**Step 2: You Invite Sarah**
```
You (Owner) → Open "Marketing Team" workspace
→ Click "Members" tab
→ Click "Invite Member"
→ Email: sarah@company.com
→ Role: Member
→ Click "Send Invitation"
→ Sarah added ✅
```

**Step 3: Sarah Logs In**
```
Sarah goes to: http://localhost:5173/login
Email: sarah@company.com
Password: ********
→ Logs in
→ Dashboard shows "Marketing Team" workspace
→ Badge shows "MEMBER 👤"
→ Clicks on workspace
→ Starts working ✅
```

---

## ⚠️ Common Issues

### "User not found" error when inviting
**Problem:** The email doesn't exist in the system
**Solution:** Make sure the person registered first with that exact email

### Invited user doesn't see the workspace
**Problem:** They might be looking in the wrong place
**Solution:** 
- Make sure they logged in (not just registered)
- Check the Dashboard page (not workspace page)
- Refresh the page
- Check if they used the correct email when registering

### Can't invite someone
**Problem:** "Invite Member" button is hidden
**Solution:** 
- Only Owners and Admins can invite
- Members cannot invite anyone
- Check your role badge on the workspace card

---

## 📋 Role Permissions Quick Reference

| Action | Owner 👑 | Admin ⚡ | Member 👤 |
|--------|---------|---------|-----------|
| Create Workspace | ✅ | ✅ | ✅ |
| Invite Admin | ✅ | ❌ | ❌ |
| Invite Member | ✅ | ✅ | ❌ |
| View Members | ✅ | ✅ | ✅ |
| View Workspace | ✅ | ✅ | ✅ |

---

## 💡 Pro Tips

1. **Share registration link first:** Before inviting, send team members the registration link
2. **Use exact emails:** Make sure the email you invite matches their registered email exactly
3. **Tell them to login:** Invited users won't get an email notification (yet), so tell them to login
4. **Check role badges:** The colored badge on workspace cards shows everyone's role
5. **Refresh if needed:** If workspace doesn't appear, refresh the dashboard page

---

## 🔗 Useful Links

- Register: `http://localhost:5173/register`
- Login: `http://localhost:5173/login`
- Dashboard: `http://localhost:5173/dashboard`

---

## Need Help?

Check the full documentation: `INVITATION_FLOW.md`
