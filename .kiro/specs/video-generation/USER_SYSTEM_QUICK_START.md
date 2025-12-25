# User System Quick Start Guide

## Starting the Backend Server

### Prerequisites
- Node.js installed
- Dependencies installed: `npm install`

### Start Server
```bash
node server/index.js
```

Expected output:
```
Server running on port 3001
```

The server will:
- Create SQLite database at `data/app.db`
- Initialize tables (users, transactions, admins)
- Listen for API requests

## Testing the System

### 1. Register a New User

**Via Frontend:**
1. Open app in browser
2. AuthDialog appears automatically
3. Click "立即注册" (Register)
4. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
5. Click "注册" (Register)
6. User created with 10 yuan balance

**Via API (curl):**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "balance": 10
  },
  "token": "eyJ1c2VySWQiOjEsImlhdCI6MTcwMzU0MzIwMCwiZXhwIjoxNzA0MTQ4MDAwfQ=="
}
```

### 2. Login

**Via Frontend:**
1. AuthDialog shows login form
2. Enter username and password
3. Click "登录" (Login)
4. User logged in, balance displayed in header

**Via API:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Check User Balance

**Via API:**
```bash
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "balance": 10,
  "created_at": "2024-12-25 10:00:00"
}
```

### 4. Generate Images (Deduct Balance)

1. User logged in with 10 yuan balance
2. Generate 5 scenes from script
3. Cost: 5 × 0.5 = 2.5 yuan
4. After generation: Balance = 7.5 yuan
5. Balance updates in header automatically

### 5. Admin Panel

**Access Admin Panel:**
1. Click "管理" (Admin) button in header
2. Enter admin password: `admin123`
3. Click "登录" (Login)

**View All Users:**
- Admin panel shows list of all users
- Displays: username, email, balance, created date

**Update User Balance:**
1. Click on user in list
2. Enter new balance (e.g., 50)
3. Click "更新余额" (Update Balance)
4. Success message shows
5. User list refreshes

**Via API:**
```bash
curl -X GET "http://localhost:3001/api/admin/get-all-users?adminPassword=admin123"
```

Response:
```json
[
  {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "balance": 7.5,
    "created_at": "2024-12-25 10:00:00"
  }
]
```

### 6. Update Balance (Admin)

```bash
curl -X POST http://localhost:3001/api/admin/update-balance \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "newBalance": 50,
    "adminPassword": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "balance": 50,
    "created_at": "2024-12-25 10:00:00"
  }
}
```

### 7. View Transaction History

```bash
curl -X GET http://localhost:3001/api/user/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "deduct",
    "amount": 2.5,
    "description": "生成 5 个分镜",
    "created_at": "2024-12-25 10:05:00"
  },
  {
    "id": 2,
    "user_id": 1,
    "type": "recharge",
    "amount": 42.5,
    "description": "管理员调整余额: 7.5 → 50",
    "created_at": "2024-12-25 10:10:00"
  }
]
```

## Common Issues

### Issue: "余额不足" (Insufficient Balance)
**Solution:** 
- Admin updates user balance
- Or user waits for payment/recharge (if implemented)

### Issue: "用户名或密码错误" (Wrong Username/Password)
**Solution:**
- Check username and password spelling
- Ensure user is registered first

### Issue: "管理员密码错误" (Wrong Admin Password)
**Solution:**
- Default admin password is `admin123`
- Change in AdminPanel.tsx if needed

### Issue: "Token 无效或已过期" (Invalid/Expired Token)
**Solution:**
- Token expires after 7 days
- User needs to login again
- Clear localStorage and refresh

### Issue: Database not found
**Solution:**
- Ensure `data/` directory exists
- Server will create it automatically
- Check file permissions

## Database Inspection

### View Database with SQLite CLI
```bash
sqlite3 data/app.db
```

**View users:**
```sql
SELECT * FROM users;
```

**View transactions:**
```sql
SELECT * FROM transactions;
```

**View specific user:**
```sql
SELECT * FROM users WHERE username = 'testuser';
```

## Deployment Notes

### For Production
1. Change admin password from `admin123` to secure value
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set proper CORS origins
5. Use bcrypt for password hashing
6. Implement rate limiting
7. Add database backups

### Environment Variables
```bash
PORT=3001
ADMIN_PASSWORD=your_secure_password
NODE_ENV=production
```

## Cost Configuration

To change costs per operation, edit in `App.tsx`:

```typescript
// Image generation cost
const costPerScene = 0.5; // Change this value

// Regenerate cost
await deductBalance(0.5, '重新生成分镜'); // Change this value
```

Then rebuild and redeploy.
