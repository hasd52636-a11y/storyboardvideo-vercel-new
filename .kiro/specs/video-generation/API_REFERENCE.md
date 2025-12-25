# User System API Reference

## Base URL
```
http://localhost:3001
```

## Authentication

### Token Format
Tokens are base64-encoded JSON with userId, iat (issued at), and exp (expiration).

### Token Usage
Include in request header:
```
Authorization: Bearer <token>
```

### Token Expiration
- Expires after 7 days
- User must login again after expiration

---

## Auth Endpoints

### Register User
**POST** `/api/auth/register`

**Request:**
```json
{
  "username": "string (required, unique)",
  "email": "string (required, unique, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Response (Success):**
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

**Response (Error):**
```json
{
  "success": false,
  "error": "用户名或邮箱已存在" | "注册失败"
}
```

**Status Codes:**
- 200: Success
- 400: Missing fields
- 409: Username/email already exists

---

### Login User
**POST** `/api/auth/login`

**Request:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (Success):**
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

**Response (Error):**
```json
{
  "success": false,
  "error": "用户名或密码错误"
}
```

**Status Codes:**
- 200: Success
- 400: Missing fields
- 401: Invalid credentials

---

## User Endpoints

### Get User Profile
**GET** `/api/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "balance": 10,
  "created_at": "2024-12-25 10:00:00"
}
```

**Response (Error):**
```json
{
  "error": "未授权" | "Token 无效或已过期" | "用户不存在"
}
```

**Status Codes:**
- 200: Success
- 401: Missing/invalid token
- 404: User not found

---

### Deduct Balance
**POST** `/api/user/deduct`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "amount": 0.5,
  "description": "生成 1 个分镜"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "balance": 9.5,
    "created_at": "2024-12-25 10:00:00"
  }
}
```

**Response (Error - Insufficient Balance):**
```json
{
  "error": "余额不足"
}
```

**Response (Error - Invalid Amount):**
```json
{
  "error": "金额无效"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid amount or insufficient balance
- 401: Missing/invalid token
- 500: Server error

---

### Get Transaction History
**GET** `/api/user/transactions`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- None (returns last 50 transactions)

**Response (Success):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "deduct",
    "amount": 0.5,
    "description": "生成 1 个分镜",
    "created_at": "2024-12-25 10:05:00"
  },
  {
    "id": 2,
    "user_id": 1,
    "type": "recharge",
    "amount": 10,
    "description": "管理员充值",
    "created_at": "2024-12-25 10:10:00"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Missing/invalid token

---

## Admin Endpoints

### Get All Users
**GET** `/api/admin/get-all-users`

**Query Parameters:**
```
adminPassword=admin123 (required)
```

**Response (Success):**
```json
[
  {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "balance": 9.5,
    "created_at": "2024-12-25 10:00:00"
  },
  {
    "id": 2,
    "username": "user2",
    "email": "user2@example.com",
    "balance": 10,
    "created_at": "2024-12-25 10:15:00"
  }
]
```

**Response (Error):**
```json
{
  "error": "管理员密码错误"
}
```

**Status Codes:**
- 200: Success
- 401: Wrong admin password

---

### Update User Balance
**POST** `/api/admin/update-balance`

**Request:**
```json
{
  "userId": 1,
  "newBalance": 50,
  "adminPassword": "admin123"
}
```

**Response (Success):**
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

**Response (Error - Wrong Password):**
```json
{
  "error": "管理员密码错误"
}
```

**Response (Error - Invalid Parameters):**
```json
{
  "error": "参数无效"
}
```

**Response (Error - User Not Found):**
```json
{
  "error": "用户不存在"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid parameters
- 401: Wrong admin password
- 404: User not found
- 500: Server error

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 400 | 缺少必要字段 | Missing required fields |
| 400 | 金额无效 | Invalid amount |
| 400 | 参数无效 | Invalid parameters |
| 401 | 未授权 | No authorization header |
| 401 | Token 无效或已过期 | Invalid or expired token |
| 401 | 管理员密码错误 | Wrong admin password |
| 404 | 用户不存在 | User not found |
| 409 | 用户名或邮箱已存在 | Username or email already exists |
| 500 | 操作失败 | Server error |

---

## Example Workflows

### Workflow 1: Register and Generate Images

```bash
# 1. Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "new@example.com",
    "password": "password123"
  }'

# Response includes token and user with 10 yuan balance

# 2. Generate 5 images (costs 2.5 yuan)
# Frontend calls handleGenerateFromScript()
# System checks: 10 >= 2.5 ✓
# After generation: balance = 7.5 yuan

# 3. Check balance
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <token>"

# Response shows balance: 7.5
```

### Workflow 2: Admin Adjusts Balance

```bash
# 1. Get all users
curl -X GET "http://localhost:3001/api/admin/get-all-users?adminPassword=admin123"

# 2. Update user balance
curl -X POST http://localhost:3001/api/admin/update-balance \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "newBalance": 100,
    "adminPassword": "admin123"
  }'

# User balance updated to 100 yuan
# Transaction logged: "管理员调整余额: 7.5 → 100"
```

### Workflow 3: Insufficient Balance

```bash
# User has 2 yuan balance
# Tries to generate 5 images (costs 2.5 yuan)

# Frontend calls checkBalance(2.5)
# Check: 2 >= 2.5? NO
# Alert: "余额不足。需要 ¥2.5，当前余额 ¥2"
# Operation cancelled

# Admin updates balance to 50 yuan
# User can now generate images
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- 10 requests per minute per IP
- 100 requests per minute per user
- 1000 requests per hour per user

---

## CORS

Currently allows all origins. For production:
```javascript
cors({
  origin: 'https://yourdomain.com',
  credentials: true
})
```

---

## Database Schema

### users table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  balance REAL DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### transactions table
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

---

## Testing with cURL

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' | jq
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }' | jq
```

### Test Profile (replace TOKEN)
```bash
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer TOKEN" | jq
```

### Test Deduct Balance
```bash
curl -X POST http://localhost:3001/api/user/deduct \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 0.5,
    "description": "Test deduction"
  }' | jq
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-25 | Initial implementation |

---

**Last Updated:** December 25, 2024
**API Version:** 1.0
**Status:** Production Ready
