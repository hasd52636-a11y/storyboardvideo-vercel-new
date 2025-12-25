import crypto from 'crypto';
import getDb from './db.js';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(userId) {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function register(username, email, password) {
  const db = getDb();
  
  try {
    const hashedPassword = hashPassword(password);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password, balance)
      VALUES (?, ?, ?, 10)
    `);
    
    const result = stmt.run(username, email, hashedPassword);
    const userId = result.lastInsertRowid;
    
    return {
      success: true,
      user: {
        id: userId,
        username,
        email,
        balance: 10,
      },
      token: generateToken(userId),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message.includes('UNIQUE constraint failed')
        ? '用户名或邮箱已存在'
        : '注册失败',
    };
  }
}

export function login(username, password) {
  const db = getDb();
  
  const hashedPassword = hashPassword(password);
  const stmt = db.prepare(`
    SELECT id, username, email, balance FROM users
    WHERE username = ? AND password = ?
  `);
  
  const user = stmt.get(username, hashedPassword);
  
  if (!user) {
    return {
      success: false,
      error: '用户名或密码错误',
    };
  }
  
  return {
    success: true,
    user,
    token: generateToken(user.id),
  };
}

export function getUserById(userId) {
  const db = getDb();
  
  const stmt = db.prepare(`
    SELECT id, username, email, balance, created_at FROM users WHERE id = ?
  `);
  
  return stmt.get(userId);
}

export { generateToken, verifyToken };
