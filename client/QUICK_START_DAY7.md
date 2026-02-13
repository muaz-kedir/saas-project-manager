# Quick Start Guide - Day 7: Kanban Columns

## What's New in Day 7

You can now create and manage Kanban columns inside your boards! This is the foundation for the task management system.

## Quick Test (5 minutes)

### 1. Start Your Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 2. Navigate to a Board

1. Open http://localhost:5173
2. Login with your account
3. Go to Dashboard
4. Click on a workspace
5. Click "Projects" tab
6. Click "Open" on a project
7. Click "Boards" tab
8. Click "Open" on a board

### 3. Create Your First Columns

You should now see the Kanban board view!

**Create 3 columns:**
1. Click "Add Column" button (top right)
2. Enter "To Do" → Click "Create Column"
3. Click "Add Column" again
4. Enter "In Progress" → Click "Create Column"
5. Click "Add Column" again
6. Enter "Done" → Click "Create Column"

You should now see 3 white column cards displayed horizontally!

### 4. Test Column Actions

**Edit a column:**
1. Hover over "To Do" column header
2. Click the edit icon (pencil)
3. Change name to "Backlog"
4. Click "Save Changes"

**Delete a column:**
1. Hover over "Done" column header
2. Click the delete icon (trash)
3. Confirm deletion
4. Column disappears

### 5. Test Horizontal Scrolling

1. Create 5+ columns
2. Notice horizontal scrollbar appears
3. Scroll left and right
4. All columns should be accessible

## What You Should See

### Board Layout
```
┌─────────────────────────────────────────────────────┐
│  Board Name                        [Add Column]     │
│  3 columns                                          │
└─────────────────────────────────────────────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐
│ To Do    │  │ In Prog  │  │ Done     │  │ + Add   │
│ [✏️][🗑️] │  │ [✏️][🗑️] │  │ [✏️][🗑️] │  │ Column  │
│ 0 tasks  │  │ 0 tasks  │  │ 0 tasks  │  │         │
│          │  │          │  │          │  │         │
│   📝     │  │   📝     │  │   📝     │  │         │
│ No tasks │  │ No tasks │  │ No tasks │  │         │
│          │  │          │  │          │  │         │
│[Add Task]│  │[Add Task]│  │[Add Task]│  │         │
└──────────┘  └──────────┘  └──────────┘  └─────────┘
```

### Column Features
- White card with shadow
- Column name in header
- Edit button (pencil icon)
- Delete button (trash icon)
- Task count (shows "0 tasks")
- Empty state with emoji
- "Add Task" button (disabled - coming in Day 8)

## Role-Based Testing

### Test as Owner
- ✅ Can create columns
- ✅ Can edit columns
- ✅ Can delete columns
- ✅ Sees "Add Column" button
- ✅ Sees edit/delete icons

### Test as Admin
- ✅ Can create columns
- ✅ Can edit columns
- ✅ Can delete columns
- ✅ Sees "Add Column" button
- ✅ Sees edit/delete icons

### Test as Member
- ❌ Cannot create columns
- ❌ Cannot edit columns
- ❌ Cannot delete columns
- ❌ No "Add Column" button
- ❌ No edit/delete icons
- ✅ Can view columns

## Common Issues & Solutions

### Issue: "Add Column" button not showing
**Solution:** Make sure you're logged in as Owner or Admin

### Issue: Columns not appearing
**Solution:** 
1. Check backend is running
2. Check MongoDB connection
3. Open browser console for errors
4. Verify you're on the correct board

### Issue: Cannot create column
**Solution:**
1. Check you have Owner/Admin role
2. Verify backend server is running
3. Check network tab for API errors
4. Ensure column name is at least 2 characters

### Issue: Horizontal scroll not working
**Solution:**
1. Create more columns (need 5+ to scroll)
2. Try different browser
3. Check CSS is loading correctly

### Issue: Modal not closing
**Solution:**
1. Click the X button
2. Click outside the modal
3. Press Escape key
4. Refresh page if stuck

## API Endpoints Being Used

```
GET    /api/columns/board/:boardId
POST   /api/columns/board/:boardId
PUT    /api/columns/:id
DELETE /api/columns/:id
```

## Next Steps

After testing columns, you're ready for Day 8:
- Task cards inside columns
- Create/edit/delete tasks
- Drag and drop tasks between columns
- Task assignments and due dates

## Files Created Today

```
client/src/context/ColumnContext.jsx
client/src/components/KanbanColumn.jsx
client/src/components/CreateColumnModal.jsx
client/src/components/EditColumnModal.jsx
client/src/pages/BoardHome.jsx (updated)
client/src/App.jsx (updated)
```

## Troubleshooting Commands

**Check backend logs:**
```bash
# In root directory
npm run dev
# Watch for errors
```

**Check frontend logs:**
```bash
# In client directory
npm run dev
# Open browser console (F12)
```

**Restart everything:**
```bash
# Stop both servers (Ctrl+C)
# Start backend
npm run dev

# In new terminal, start frontend
cd client
npm run dev
```

## Success Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can navigate to a board
- [ ] Can see board name in header
- [ ] Can create columns (Owner/Admin)
- [ ] Columns appear horizontally
- [ ] Can edit column names
- [ ] Can delete columns
- [ ] Horizontal scroll works with many columns
- [ ] Empty state shows when no columns
- [ ] Role permissions work correctly

---

**Need Help?**
- Check browser console (F12) for errors
- Check backend terminal for errors
- Review DAY7_COMPLETE.md for details
- Review TESTING_CHECKLIST_DAY7.md for comprehensive tests
