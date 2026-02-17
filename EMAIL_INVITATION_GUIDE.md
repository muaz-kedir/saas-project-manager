# Email Invitation System

## Overview
The workspace invitation system now uses email-based invitations with secure tokens. When an owner or admin invites someone, they receive an email with a link to accept the invitation.

## How It Works

### 1. Sending Invitations
**Who can invite:** Workspace owners and admins
- Owners can invite admins and members
- Admins can only invite members

**Process:**
1. Go to workspace page
2. Click "Invite Member"
3. Fill in:
   - Name (required)
   - Email (required)
   - Role (Admin or Member)
4. Click "Send Invitation"
5. An email is sent to the recipient

### 2. Receiving Invitations
The recipient receives an email with:
- Workspace name
- Inviter's name
- Their assigned role
- Accept invitation button/link
- Expiration notice (7 days)

### 3. Accepting Invitations
**If user has an account:**
1. Click the link in email
2. Log in (if not already)
3. Click "Accept Invitation"
4. Redirected to workspace

**If user doesn't have an account:**
1. Click the link in email
2. Click "Create one" to register
3. Register with the SAME email from invitation
4. Return to invitation link
5. Click "Accept Invitation"

## API Endpoints

### Send Invitation
```
POST /api/workspaces/:workspaceId/invite
Authorization: Bearer <token>

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "MEMBER" // or "ADMIN"
}

Response:
{
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "MEMBER",
    "status": "pending",
    "expiresAt": "2026-02-24T..."
  }
}
```

### Get Invitation Details (Public)
```
GET /api/workspaces/invitations/:token

Response:
{
  "invitation": {
    "email": "john@example.com",
    "name": "John Doe",
    "role": "MEMBER",
    "workspace": {
      "id": "...",
      "name": "My Workspace"
    },
    "invitedBy": {
      "name": "Jane Smith"
    },
    "expiresAt": "2026-02-24T..."
  }
}
```

### Accept Invitation
```
POST /api/workspaces/invitations/:token/accept
Authorization: Bearer <token>

Response:
{
  "message": "Invitation accepted successfully",
  "workspace": {
    "id": "...",
    "name": "My Workspace"
  },
  "member": {
    "id": "...",
    "role": "MEMBER"
  }
}
```

## Database Models

### Invitation Model
```javascript
{
  workspace: ObjectId,      // Reference to workspace
  email: String,            // Invitee email
  name: String,             // Invitee name
  role: String,             // ADMIN or MEMBER
  token: String,            // Unique secure token
  invitedBy: ObjectId,      // Reference to inviter
  status: String,           // pending, accepted, expired
  expiresAt: Date,          // Auto-expires after 7 days
  createdAt: Date,
  updatedAt: Date
}
```

## Email Configuration

### Development Mode
In development, emails are logged to console instead of being sent.

### Production Mode
Set these environment variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@projecthub.com

# Client URL for invitation links
CLIENT_URL=https://your-domain.com
```

### Using Gmail
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the app password in `SMTP_PASS`

### Using SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## Security Features

1. **Unique Tokens:** Each invitation has a cryptographically secure random token
2. **Expiration:** Invitations expire after 7 days
3. **Email Verification:** User must log in with the invited email
4. **One-time Use:** Tokens can only be used once
5. **Auto-cleanup:** Expired invitations are automatically deleted from database

## Frontend Components

### InviteMemberModal
- Updated to include name field
- Shows success message after sending
- Validates all inputs

### AcceptInvitation Page
- Public route (no auth required to view)
- Shows invitation details
- Handles login/register flow
- Validates email match
- Redirects to workspace after acceptance

## Testing

### Test the Flow
1. **Start servers:**
   ```bash
   # Backend
   npm run dev
   
   # Frontend
   cd client
   npm run dev
   ```

2. **Create workspace and invite:**
   - Register/login as user A
   - Create a workspace
   - Click "Invite Member"
   - Enter name, email, role
   - Check console for email content

3. **Accept invitation:**
   - Copy the invitation URL from console
   - Open in new incognito window
   - Register/login as user B (with invited email)
   - Accept invitation
   - Verify you're added to workspace

## Troubleshooting

### Email not sending
- Check SMTP credentials
- Verify firewall/network settings
- Check console logs for errors
- In development, emails are logged to console

### Invitation link not working
- Check token is correct
- Verify invitation hasn't expired
- Check invitation status in database

### Email mismatch error
- User must log in with the exact email from invitation
- Email comparison is case-insensitive

## Future Enhancements

- [ ] Resend invitation
- [ ] Cancel pending invitations
- [ ] Bulk invitations
- [ ] Custom invitation messages
- [ ] Email templates customization
- [ ] Invitation history/audit log
