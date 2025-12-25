import './setup-env.js';
import crypto from 'crypto';
import { createClient } from '@vercel/postgres';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      error: '用户名和密码不能为空' 
    });
  }

  let client;
  try {
    const hashedPassword = hashPassword(password);
    
    console.log('[login] Attempting to login user:', username);
    
    client = createClient();
    await client.connect();
    
    const result = await client.sql`
      SELECT id, username, email, balance FROM users
      WHERE username = ${username} AND password = ${hashedPassword}
    `;
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误',
      });
    }
    
    const user = result.rows[0];
    console.log('[login] User logged in successfully:', user.id);
    
    return res.status(200).json({
      success: true,
      user,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('[login] Login error:', error.message);
    return res.status(500).json({
      success: false,
      error: '登录失败，请稍后重试',
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
