# User System with Billing Implementation - Complete

## Overview
Successfully implemented a complete user authentication and billing system for the Storyboard Master application. Users can now register, login, and have their balance managed by administrators.

## Components Implemented

### 1. Backend (Node.js + Express + SQLite)

#### Database Schema (`server/db.js`)
- **users table**: Stores user credentials and balance
  - id, username, email, password (hashed), balance (default 10 yuan), timestamps
- **transactions table**: Tracks all balance changes
  - id, user_id, type (deduct/recharge), amount, description, timestamp
- **admins table**: Admin credentials (for future use)

#### Authentication Module (`server/auth.js`)
- `register()`: Create new user with 10 yuan initial balance
- `login()`: Authenticate user and generate token
- `getUserById()`: Fetch user profile
- `generateToken()`: Create 7-day JWT tokens (base64 encoded)
- `verifyToken()`: Validate token expiration

#### API Endpoints (`server/index.js`)

**Auth Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**User Endpoints:**
- `GET /api/user/profile` - Get current user info (requires auth token)
- `POST /api/user/deduct` - Deduct balance (requires auth token)
- `GET /api/user/transactions` - Get transaction history (requires auth token)

**Admin Endpoints:**
- `GET /api/admin/get-all-users` - Fetch all users (requires admin password)
- `POST /api/admin/update-balance` - Update user balance (requires admin password)

### 2. Frontend Components

#### AuthDialog (`components/AuthDialog.tsx`)
- Login/Register toggle interface
- Form validation
- Error handling
- Stores auth token in localStorage
- Calls backend auth endpoints

#### AdminPanel (`components/AdminPanel.tsx`)
- Admin password authentication
- User list display with balance info
- Balance adjustment interface
- Transaction logging
- Fetches users from `/api/admin/get-all-users`
- Updates balance via `/api/admin/update-balance`

### 3. App Integration (`App.tsx`)

#### Auth State Management
```typescript
const [showAuthDialog, setShowAuthDialog] = useState(false);
const [showAdminPanel, setShowAdminPanel] = useState(false);
const [authToken, setAuthToken] = useState<string | null>(null);
const [currentUser, setCurrentUser] = useState<any>(null);
const [userBalance, setUserBalance] = useState(0);
```

#### Auth Functions
- `handleLoginSuccess()`: Store token and user info
- `handleLogout()`: Clear auth state
- `deductBalance()`: Call API to deduct balance
- `checkBalance()`: Verify sufficient balance before operations

#### Balance Checking
- **Image Generation**: 0.5 yuan per scene
  - `handleGenerateFromScript()`: Check balance before generating
  - `handleGenerateFromDialogue()`: Check balance before generating
  - `handleAction('regenerate')`: Check balance before regenerating

#### UI Updates
- Header displays current user and balance
- Admin button to open admin panel
- Logout button
- Balance shown in real-time

## User Flow

### Registration
1. User clicks "Register" in AuthDialog
2. Enters username, email, password
3. Backend creates user with 10 yuan balance
4. User automatically logged in
5. Token stored in localStorage

### Login
1. User enters username and password
2. Backend validates credentials
3. Token generated and returned
4. User info and balance loaded
5. AuthDialog closes

### Using Features
1. User attempts to generate images/videos
2. System checks if balance >= required amount
3. If insufficient: Alert shown, operation cancelled
4. If sufficient: Operation proceeds
5. After success: Balance deducted via API
6. Balance updated in UI

### Admin Management
1. Admin clicks "Admin" button
2. Enters admin password
3. System fetches all users
4. Admin selects user and enters new balance
5. Backend updates balance and logs transaction
6. User list refreshes

## Billing Model

### Cost Structure
- **Image Generation**: 0.5 yuan per scene
- **Video Generation**: (To be configured)
- **Regenerate**: 0.5 yuan per image

### Initial Balance
- New users: 10 yuan
- Enough for ~20 image generations or 10 video generations

### Balance Management
- Manual admin adjustment (no automated payment system)
- Transaction history tracked
- All changes logged with description

## Security Considerations

### Current Implementation
- Passwords hashed with SHA-256
- Tokens expire after 7 days
- Admin password required for admin operations
- Auth token required for user operations

### Production Recommendations
- Use bcrypt instead of SHA-256 for passwords
- Implement refresh tokens
- Add rate limiting on auth endpoints
- Use environment variables for admin password
- Add HTTPS enforcement
- Implement CORS properly for production domain

## Files Modified/Created

### Created
- `server/db.js` - Database initialization
- `server/auth.js` - Authentication logic
- `server/index.js` - Express API server
- `components/AuthDialog.tsx` - Login/Register UI
- `components/AdminPanel.tsx` - Admin management UI

### Modified
- `App.tsx` - Integrated auth, balance checking, UI updates
- `package.json` - Added express, cors, better-sqlite3 dependencies

## Environment Setup

### Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "better-sqlite3": "^9.2.2"
}
```

### Running the Backend
```bash
node server/index.js
```

Server runs on port 3001 by default (configurable via PORT env var)

## Testing Checklist

- [ ] User can register with new account
- [ ] User receives 10 yuan initial balance
- [ ] User can login with credentials
- [ ] Auth token persists in localStorage
- [ ] User balance displays in header
- [ ] Image generation deducts balance
- [ ] Insufficient balance shows error
- [ ] Admin can view all users
- [ ] Admin can update user balance
- [ ] Transaction history is logged
- [ ] Logout clears auth state
- [ ] Login dialog shows on app start if not authenticated

## Next Steps

1. **Payment Integration** (Optional)
   - Add Stripe/Alipay integration for recharging
   - Implement automated balance updates

2. **Enhanced Security**
   - Implement proper JWT with RS256
   - Add email verification
   - Add password reset functionality

3. **Analytics**
   - Track usage per user
   - Generate billing reports
   - Monitor API costs

4. **Rate Limiting**
   - Prevent abuse
   - Implement per-user quotas

## Configuration

### Admin Password
Currently hardcoded as `admin123` in AdminPanel.tsx
Should be moved to environment variable:
```bash
ADMIN_PASSWORD=your_secure_password
```

### Database Location
SQLite database stored at: `data/app.db`
Ensure `data/` directory exists or is created automatically

### API Base URL
Frontend assumes backend at same origin (localhost:3001 for dev)
For production, update API calls to use correct domain
