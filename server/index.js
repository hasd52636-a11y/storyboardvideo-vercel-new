import express from 'express';
import cors from 'cors';
import { register, login, getUserById, verifyToken } from './auth.js';
import getDb from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 中间件：验证 token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token 无效或已过期' });
  }
  
  req.userId = decoded.userId;
  next();
}

// 注册
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: '缺少必要字段' });
  }
  
  const result = register(username, email, password);
  res.json(result);
});

// 登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '缺少必要字段' });
  }
  
  const result = login(username, password);
  res.json(result);
});

// 获取用户信息
app.get('/api/user/profile', authMiddleware, (req, res) => {
  const user = getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json(user);
});

// 扣费
app.post('/api/user/deduct', authMiddleware, (req, res) => {
  const { amount, description } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: '金额无效' });
  }
  
  const db = getDb();
  
  try {
    // 检查余额
    const user = getUserById(req.userId);
    if (user.balance < amount) {
      return res.status(400).json({ error: '余额不足' });
    }
    
    // 扣费
    const updateStmt = db.prepare(`
      UPDATE users SET balance = balance - ? WHERE id = ?
    `);
    updateStmt.run(amount, req.userId);
    
    // 记录交易
    const transStmt = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `);
    transStmt.run(req.userId, 'deduct', amount, description || '');
    
    const updatedUser = getUserById(req.userId);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: '扣费失败' });
  }
});

// 充值（管理员）
app.post('/api/admin/recharge', (req, res) => {
  const { userId, amount, adminPassword } = req.body;
  
  // 简单的管理员验证（生产环境应该用更安全的方式）
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: '管理员密码错误' });
  }
  
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: '参数无效' });
  }
  
  const db = getDb();
  
  try {
    const updateStmt = db.prepare(`
      UPDATE users SET balance = balance + ? WHERE id = ?
    `);
    updateStmt.run(amount, userId);
    
    const transStmt = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `);
    transStmt.run(userId, 'recharge', amount, '管理员充值');
    
    const user = getUserById(userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: '充值失败' });
  }
});

// 获取交易记录
app.get('/api/user/transactions', authMiddleware, (req, res) => {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
  `);
  const transactions = stmt.all(req.userId);
  res.json(transactions);
});

// 获取所有用户（管理员）
app.get('/api/admin/get-all-users', (req, res) => {
  const { adminPassword } = req.query;
  
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: '管理员密码错误' });
  }
  
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, username, email, balance, created_at FROM users ORDER BY created_at DESC
  `);
  const users = stmt.all();
  res.json(users);
});

// 更新用户余额（管理员）
app.post('/api/admin/update-balance', (req, res) => {
  const { userId, newBalance, adminPassword } = req.body;
  
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: '管理员密码错误' });
  }
  
  if (!userId || newBalance === undefined || newBalance < 0) {
    return res.status(400).json({ error: '参数无效' });
  }
  
  const db = getDb();
  
  try {
    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    const oldBalance = user.balance;
    const difference = newBalance - oldBalance;
    
    const updateStmt = db.prepare(`
      UPDATE users SET balance = ? WHERE id = ?
    `);
    updateStmt.run(newBalance, userId);
    
    // 记录交易
    const transStmt = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `);
    const transType = difference > 0 ? 'recharge' : 'deduct';
    const description = `管理员调整余额: ${oldBalance} → ${newBalance}`;
    transStmt.run(userId, transType, Math.abs(difference), description);
    
    const updatedUser = getUserById(userId);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: '更新失败' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
