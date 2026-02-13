# Day 6 Testing Checklist: Board Management

## Pre-Testing Setup

1. ✅ Backend server running (`npm run dev` in root)
2. ✅ Frontend dev server running (`npm run dev` in client folder)
3. ✅ MongoDB Atlas connection working
4. ✅ At least one workspace created
5. ✅ At least one project created in workspace
6. ✅ Test users with different roles (Owner, Admin, Member)

## Test Scenarios

### 1. Board Creation (Owner/Admin)

**As Owner:**
1. Navigate to a project
2. Click "Boards" tab
3. Verify "Create Board" button is visible
4. Click "Create Board"
5. Try submitting empty form → Should show error
6. Try submitting with 1-2 characters → Should show error
7. Enter valid board name (e.g., "Sprint 1")
8. Click "Create Board"
9. Verify board appears in grid
10. Verify success feedback

**As Admin:**
1. Repeat steps above
2. Verify same permissions as Owner

**As Member:**
1. Navigate to project
2. Click "Boards" tab
3. Verify "Create Board" button is NOT visible
4. Verify can only view existing boards

### 2. Board Editing (Owner/Admin)

**As Owner:**
1. Navigate to Boards tab
2. Hover over a board card
3. Verify edit icon appears
4. Click edit icon
5. Verify modal opens with current name
6. Change board name
7. Click "Save Changes"
8. Verify board name updates in list
9. Verify success feedback

**As Admin:**
1. Repeat steps above
2. Verify same permissions as Owner

**As Member:**
1. Navigate to Boards tab
2. Hover over a board card
3. Verify edit icon does NOT appear

### 3. Board Deletion (Owner Only)

**As Owner:**
1. Navigate to Boards tab
2. Hover over a board card
3. Verify delete icon appears
4. Click delete icon
5. Verify confirmation dialog appears
6. Click "Cancel" → Board should remain
7. Click delete again
8. Click "OK" → Board should disappear
9. Verify board removed from list

**As Admin:**
1. Navigate to Boards tab
2. Hover over a board card
3. Verify delete icon does NOT appear

**As Member:**
1. Navigate to Boards tab
2. Hover over a board card
3. Verify delete icon does NOT appear

### 4. Board Navigation

**All Roles:**
1. Navigate to Boards tab
2. Click "Open →" button on a board
3. Verify redirected to `/workspace/:workspaceId/project/:projectId/board/:boardId`
4. Verify BoardHome page displays
5. Verify board ID shown correctly
6. Verify project ID shown correctly
7. Verify workspace ID shown correctly
8. Verify "Coming Soon" notice displays

### 5. Empty State

**As Owner/Admin:**
1. Delete all boards in a project
2. Navigate to Boards tab
3. Verify empty state displays
4. Verify emoji (📋) shows
5. Verify "No boards yet" message
6. Verify "Create Your First Board" button visible
7. Click button → Modal should open

**As Member:**
1. Navigate to project with no boards
2. Verify empty state displays
3. Verify create button does NOT appear

### 6. UI/UX Testing

**Visual Tests:**
1. Verify dark theme colors consistent
2. Verify hover effects on board cards
3. Verify card shadows on hover
4. Verify button hover states
5. Verify modal backdrop blur
6. Verify modal animations smooth
7. Verify responsive design on mobile
8. Verify grid layout adjusts properly

**Loading States:**
1. Navigate to Boards tab
2. Verify loading skeleton appears briefly
3. Verify skeleton matches card layout
4. Verify smooth transition to actual content

**Error Handling:**
1. Disconnect internet
2. Try creating a board
3. Verify error message displays
4. Verify user-friendly error text
5. Reconnect internet
6. Verify can retry operation

### 7. Tab Navigation (ProjectHome)

**All Roles:**
1. Navigate to a project
2. Verify three tabs: Boards, Overview, Activity
3. Click "Boards" tab → Should show boards list
4. Click "Overview" tab → Should show coming soon
5. Click "Activity" tab → Should show coming soon
6. Verify active tab highlighted
7. Verify tab indicator line appears
8. Verify smooth tab transitions

### 8. Integration Testing

**Full Flow:**
1. Login as Owner
2. Create a workspace
3. Create a project
4. Navigate to project
5. Click Boards tab
6. Create first board
7. Create second board
8. Edit first board
9. Delete second board
10. Open first board
11. Verify all operations successful

### 9. Multi-User Testing

**Setup:**
1. Have Owner, Admin, and Member accounts
2. All in same workspace and project

**Test:**
1. Owner creates a board
2. Admin refreshes → Should see new board
3. Member refreshes → Should see new board
4. Admin edits board name
5. Owner refreshes → Should see updated name
6. Member refreshes → Should see updated name
7. Owner deletes board
8. Admin refreshes → Board should be gone
9. Member refreshes → Board should be gone

### 10. Browser Testing

Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

Verify:
- [ ] All features work consistently
- [ ] Styling appears correctly
- [ ] No console errors
- [ ] Smooth animations

## Common Issues to Check

### Backend Issues
- [ ] MongoDB connection active
- [ ] Backend server running on port 5000
- [ ] CORS configured correctly
- [ ] Auth middleware working
- [ ] RBAC middleware checking roles

### Frontend Issues
- [ ] Frontend running on port 5173
- [ ] Axios configured with correct base URL
- [ ] x-user-id header being sent
- [ ] BoardContext provider wrapped correctly
- [ ] React Router routes configured

### Permission Issues
- [ ] Role badges showing correctly
- [ ] Buttons hidden/shown based on role
- [ ] API rejecting unauthorized requests
- [ ] Error messages clear and helpful

## Success Criteria

✅ All test scenarios pass
✅ No console errors
✅ Permissions enforced correctly
✅ UI matches dark theme design
✅ Smooth user experience
✅ Error handling works properly
✅ Loading states display correctly
✅ Responsive design works

## Notes

- Test with real network delays to see loading states
- Test with different screen sizes
- Test with keyboard navigation
- Test with screen readers (accessibility)
- Check browser console for warnings
- Monitor network tab for API calls

---

**Testing Date**: _____________
**Tested By**: _____________
**Status**: _____________
**Issues Found**: _____________
