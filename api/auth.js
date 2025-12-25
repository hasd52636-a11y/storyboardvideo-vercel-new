import crypto from 'crypto';
import { sql } from '@vercel/postgres';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(userId) {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token) {
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

export async function register(username, email, password) {
  try {
    const hashedPassword = hashPassword(password);
    const result = await sql`
      INSERT INTO users (username, email, password, balance)
      VALUES (${username}, ${email}, ${hashedPassword}, 10)
      RETURNING id, username, email, balance
    `;
    
    const user = result.rows[0];
    return {
      success: true,
      user,
      token: generateToken(user.id),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message.includes('duplicate key')
        ? '用户名或邮箱已存在'
        : '注册失败',
    };
  }
}

export async function login(username, password) {
  try {
    const hashedPassword = hashPassword(password);
    const result = await sql`
      SELECT id, username, email, balance FROM users
      WHERE username = ${username} AND password = ${hashedPassword}
    `;
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: '用户名或密码错误',
      };
    }
    
    const user = result.rows[0];
    return {
      success: true,
      user,
      token: generateToken(user.id),
    };
  } catch (error) {
    return {
      success: false,
      error: '登录失败',
    };
  }
}

export async function getUserById(userId) {
  try {
    const result = await sql`
      SELECT id, username, email, balance, created_at FROM users WHERE id = ${userId}
    `;
    return result.rows[0] || null;
  } catch (error) {
    return null;
  }
}

export { generateToken };
