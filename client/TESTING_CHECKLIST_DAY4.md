# ✅ Testing Checklist - Day 4 (Member Management)

## Before Moving to Projects - Verify These Work:

### 1. Authentication & Dashboard
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Dashboard shows all workspaces
- [ ] Can see role badges on workspace cards (Owner/Admin/Member)
- [ ] Info banner appears when workspaces exist

### 2. Workspace Creation
- [ ] Can create a new workspace
- [ ] Workspace appears in dashboard immediately
- [ ] Creator has OWNER role badge
- [ ] Can click workspace card to open it

### 3. Workspace Navigation
- [ ] WorkspaceHome page loads correctly
- [ ] Shows workspace name and description
- [ ] Shows user's role
- [ ] Has two tabs: Overview and Members
- [ ] Can switch between tabs
- [ ] Active tab has blue underline indicator

### 4. Members Tab - Viewing
- [ ] Clicking Members tab loads member list
- [ ] Shows "Team Members (X)" header
- [ ] Displays table with columns: Member, Email, Role, Joined
- [ ] Role badges show correct colors:
  - Owner: Purple with 👑
  - Admin: Blue with ⚡
  - Member: Gray with 👤
- [ ] Shows member avatar with first letter
- [ ] Shows joined date formatted correctly

### 5. Invite Member - Owner
- [ ] "Invite Member" button visible for Owner
- [ ] Clicking button opens modal
- [ ] Modal has email input and role dropdown
- [ ] Owner can select Admin or Member roles
- [ ] Can enter email and submit
- [ ] Shows loading state while inviting
- [ ] Shows error if user not found
- [ ] Shows error if user already member
- [ ] Member appears in list after successful invite
- [ ] Modal closes after success

### 6. Invite Member - Admin
- [ ] Login as invited Admin user
- [ ] Can see workspace in dashboard
- [ ] Has ADMIN badge on workspace card
- [ ] Can open workspace
- [ ] "Invite Member" button visible
- [ ] Can only select Member role (not Admin)
- [ ] Can successfully invite Member
- [ ] New member appears in list

### 7. Member View - Read Only
- [ ] Login as invited Member user
- [ ] Can see workspace in dashboard
- [ ] Has MEMBER badge on workspace card
- [ ] Can open workspace
- [ ] Can view Members tab
- [ ] "Invite Member" button is HIDDEN
- [ ] Can see all members in list
- [ ] Cannot invite anyone

### 8. Error Handling
- [ ] Shows error if backend is down
- [ ] Shows error if invalid email format
- [ ] Shows error if user doesn't exist
- [ ] Shows error if user already invited
- [ ] Shows error if network fails
- [ ] Error messages are clear and helpful

### 9. Loading States
- [ ] Dashboard shows skeleton while loading
- [ ] Members list shows skeleton while loading
- [ ] Invite button shows "Sending..." while loading
- [ ] Buttons disabled during loading

### 10. Empty States
- [ ] Dashboard shows "No workspaces yet" when empty
- [ ] Members list shows "No members yet" when empty
- [ ] Empty states have helpful messages

## Quick Test Scenario

### Setup (5 minutes):
1. Create 3 accounts:
   - owner@test.com (Owner)
   - admin@test.com (Admin)
   - member@test.com (Member)

2. Login as owner@test.com
3. Create workspace "Test Workspace"
4. Go to Members tab
5. Invite admin@test.com as Admin
6. Invite member@test.com as Member

### Test Owner (2 minutes):
- [ ] Can see both invited members in list
- [ ] Can see "Invite Member" button
- [ ] Can select Admin or Member when inviting

### Test Admin (2 minutes):
- [ ] Logout, login as admin@test.com
- [ ] See "Test Workspace" in dashboard with ADMIN badge
- [ ] Open workspace
- [ ] Go to Members tab
- [ ] See all 3 members
- [ ] Can see "Invite Member" button
- [ ] Can only select Member role

### Test Member (2 minutes):
- [ ] Logout, login as member@test.com
- [ ] See "Test Workspace" in dashboard with MEMBER badge
- [ ] Open workspace
- [ ] Go to Members tab
- [ ] See all 3 members
- [ ] "Invite Member" button is HIDDEN

## Performance Check
- [ ] Workspace creation takes < 1 second
- [ ] Member invitation takes < 1 second
- [ ] Member list loads < 1 second
- [ ] No console errors
- [ ] No network errors

## UI/UX Check
- [ ] Dark theme applied consistently
- [ ] Hover effects work on cards and buttons
- [ ] Modal animations smooth
- [ ] Tab transitions smooth
- [ ] Role badges clearly visible
- [ ] Text readable on dark background
- [ ] Responsive on mobile (optional)

## Backend Check
- [ ] Backend server running on port 5000
- [ ] No errors in backend console
- [ ] MongoDB connected
- [ ] All API endpoints responding

---

## If All Checked ✅ - Ready for Projects!

If everything above works correctly, the member management system is solid and we can proceed to implement project management (Day 5).

## Common Issues & Fixes

### Issue: "Invite Member" button not showing
**Fix**: Check user's role - only Owner and Admin can invite

### Issue: Member list empty
**Fix**: Make sure you're on Members tab and backend is running

### Issue: Invitation takes too long
**Fix**: Restart backend server to apply performance optimizations

### Issue: Network errors
**Fix**: 
1. Check backend is running: `npm run dev`
2. Check port 5000 is not blocked
3. Check .env file has correct API URL

### Issue: Role badges not showing
**Fix**: Check workspace data has members array with role property
