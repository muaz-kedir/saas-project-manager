# Day 7 Testing Checklist: Kanban Columns UI

## Pre-Testing Setup

1. ✅ Backend server running (`npm run dev` in root)
2. ✅ Frontend dev server running (`npm run dev` in client folder)
3. ✅ MongoDB Atlas connection working
4. ✅ At least one workspace created
5. ✅ At least one project created
6. ✅ At least one board created
7. ✅ Test users with different roles (Owner, Admin, Member)

## Test Scenarios

### 1. Column Creation (Owner/Admin)

**As Owner:**
1. Navigate to a board
2. Verify "Add Column" button visible in header
3. Click "Add Column"
4. Try submitting empty form → Should show error
5. Try submitting with 1 character → Should show error
6. Enter valid column name (e.g., "To Do")
7. Click "Create Column"
8. Verify column appears on board
9. Create second column (e.g., "In Progress")
10. Create third column (e.g., "Done")
11. Verify columns appear in order created

**As Admin:**
1. Repeat steps above
2. Verify same permissions as Owner

**As Member:**
1. Navigate to board
2. Verify "Add Column" button NOT visible
3. Verify "Add Column" card NOT visible
4. Verify can only view existing columns

### 2. Column Editing (Owner/Admin)

**As Owner:**
1. Navigate to board with columns
2. Hover over column header
3. Verify edit icon appears
4. Click edit icon
5. Verify modal opens with current name
6. Change column name
7. Click "Save Changes"
8. Verify column name updates immediately
9. Verify no page refresh needed

**As Admin:**
1. Repeat steps above
2. Verify same permissions as Owner

**As Member:**
1. Navigate to board
2. Hover over column header
3. Verify edit icon does NOT appear

### 3. Column Deletion (Owner/Admin)

**As Owner:**
1. Navigate to board with columns
2. Hover over column header
3. Verify delete icon appears
4. Click delete icon
5. Verify confirmation dialog appears
6. Verify warning about losing tasks
7. Click "Cancel" → Column should remain
8. Click delete again
9. Click "OK" → Column should disappear
10. Verify column removed from board

**As Admin:**
1. Repeat steps above
2. Verify same permissions as Owner

**As Member:**
1. Navigate to board
2. Hover over column header
3. Verify delete icon does NOT appear

### 4. Board Layout

**Visual Layout:**
1. Navigate to board with 3+ columns
2. Verify columns display horizontally
3. Verify each column has fixed width (320px)
4. Verify spacing between columns (24px gap)
5. Verify columns have white background
6. Verify columns have shadow effect
7. Verify columns have rounded corners

**Horizontal Scrolling:**
1. Create 5+ columns
2. Verify horizontal scrollbar appears
3. Scroll left and right
4. Verify smooth scrolling
5. Verify all columns accessible
6. Verify "Add Column" card at end (if Owner/Admin)

**Column Structure:**
1. Verify each column has:
   - Column name in header
   - Edit button (if Owner/Admin)
   - Delete button (if Owner/Admin)
   - Task count (shows "0 tasks")
   - Empty task area with placeholder
   - "Add Task" button (disabled, coming soon)

### 5. Empty State

**As Owner/Admin:**
1. Delete all columns in a board
2. Navigate to board
3. Verify empty state displays
4. Verify emoji (📋) shows
5. Verify "No columns yet" message
6. Verify "Create Your First Column" button visible
7. Click button → Modal should open
8. Create first column
9. Verify empty state disappears

**As Member:**
1. Navigate to board with no columns
2. Verify empty state displays
3. Verify create button does NOT appear
4. Verify message is view-only

### 6. Board Header

**All Roles:**
1. Navigate to board
2. Verify board name displays correctly
3. Verify column count displays
4. Verify count updates when columns added/removed
5. Verify "Add Column" button position (top right)
6. Verify header layout is clean and organized

### 7. Loading States

**Initial Load:**
1. Navigate to board
2. Verify loading skeleton appears briefly
3. Verify skeleton shows 3 column placeholders
4. Verify smooth transition to actual content

**Creating Column:**
1. Click "Add Column"
2. Enter name and submit
3. Verify button shows "Creating..."
4. Verify button is disabled during creation
5. Verify modal closes on success

**Editing Column:**
1. Click edit on a column
2. Change name and submit
3. Verify button shows "Saving..."
4. Verify button is disabled during save
5. Verify modal closes on success

**Deleting Column:**
1. Click delete on a column
2. Confirm deletion
3. Verify delete icon shows loading state
4. Verify column fades out smoothly

### 8. Error Handling

**Network Errors:**
1. Disconnect internet
2. Try creating a column
3. Verify error message displays
4. Verify user-friendly error text
5. Reconnect internet
6. Verify can retry operation

**Validation Errors:**
1. Try creating column with empty name
2. Verify error: "Column name is required"
3. Try creating column with 1 character
4. Verify error: "Column name must be at least 2 characters"
5. Verify errors clear when typing

**Backend Errors:**
1. Stop backend server
2. Try creating a column
3. Verify error message displays
4. Start backend server
5. Verify can retry operation

### 9. UI/UX Testing

**Visual Design:**
1. Verify white column cards
2. Verify shadow effects on columns
3. Verify rounded corners
4. Verify proper padding inside columns
5. Verify text is readable
6. Verify icons are clear
7. Verify hover effects on buttons

**Interactions:**
1. Hover over edit button → Should change color
2. Hover over delete button → Should change color
3. Hover over "Add Column" card → Should highlight
4. Click outside modal → Should close
5. Press Escape in modal → Should close
6. Tab through form fields → Should work

**Responsive Design:**
1. Test on desktop (1920px)
2. Test on laptop (1366px)
3. Test on tablet (768px)
4. Test on mobile (375px)
5. Verify horizontal scroll works on all sizes
6. Verify modals are centered on all sizes

### 10. Integration Testing

**Full Flow:**
1. Login as Owner
2. Create a workspace
3. Create a project
4. Create a board
5. Navigate to board
6. Create "To Do" column
7. Create "In Progress" column
8. Create "Done" column
9. Edit "To Do" to "Backlog"
10. Delete "Done" column
11. Verify all operations successful
12. Verify columns in correct order

### 11. Multi-User Testing

**Setup:**
1. Have Owner, Admin, and Member accounts
2. All in same workspace, project, and board

**Test:**
1. Owner creates a column
2. Admin refreshes → Should see new column
3. Member refreshes → Should see new column
4. Admin edits column name
5. Owner refreshes → Should see updated name
6. Member refreshes → Should see updated name
7. Owner deletes column
8. Admin refreshes → Column should be gone
9. Member refreshes → Column should be gone

### 12. Column Ordering

**Test Order:**
1. Create columns in this order:
   - "Column A"
   - "Column B"
   - "Column C"
2. Verify they appear in creation order
3. Delete "Column B"
4. Create "Column D"
5. Verify order is: A, C, D
6. Refresh page
7. Verify order persists

### 13. Browser Testing

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
- [ ] Horizontal scroll works

### 14. Performance Testing

**Many Columns:**
1. Create 10+ columns
2. Verify page remains responsive
3. Verify scrolling is smooth
4. Verify no lag when editing
5. Verify no lag when deleting

**Rapid Operations:**
1. Create 3 columns quickly
2. Edit 2 columns quickly
3. Delete 1 column quickly
4. Verify all operations complete
5. Verify no race conditions

## Common Issues to Check

### Backend Issues
- [ ] MongoDB connection active
- [ ] Backend server running on port 5000
- [ ] Column routes configured correctly
- [ ] Auth middleware working
- [ ] Tenant middleware working

### Frontend Issues
- [ ] Frontend running on port 5173
- [ ] Axios configured with correct base URL
- [ ] x-user-id header being sent
- [ ] ColumnContext provider wrapped correctly
- [ ] BoardContext providing board data

### Permission Issues
- [ ] Role badges showing correctly
- [ ] Buttons hidden/shown based on role
- [ ] API rejecting unauthorized requests
- [ ] Error messages clear and helpful

### Layout Issues
- [ ] Columns have fixed width
- [ ] Horizontal scroll appears when needed
- [ ] Spacing between columns correct
- [ ] Column height fills available space
- [ ] Empty state centered properly

## Success Criteria

✅ All test scenarios pass
✅ No console errors
✅ Permissions enforced correctly
✅ UI matches Kanban design
✅ Smooth user experience
✅ Error handling works properly
✅ Loading states display correctly
✅ Responsive design works
✅ Horizontal scrolling smooth
✅ Column ordering correct

## Notes

- Test with real network delays to see loading states
- Test with different screen sizes
- Test with keyboard navigation
- Test with screen readers (accessibility)
- Check browser console for warnings
- Monitor network tab for API calls
- Verify column order persists after refresh

---

**Testing Date**: _____________
**Tested By**: _____________
**Status**: _____________
**Issues Found**: _____________
