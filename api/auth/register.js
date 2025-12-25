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

  const { username, email, password } = req.body;

  // 只验证邮箱格式
  if (!email) {
    return res.status(400).json({ 
      success: false,
      error: '邮箱不能为空' 
    });
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: '邮箱格式不正确' 
    });
  }

  let client;
  try {
    console.log('[register] Attempting to register user:', { username, email });
    console.log('[register] POSTGRES_URL_NON_POOLING exists:', !!process.env.POSTGRES_URL_NON_POOLING);
    
    const hashedPassword = hashPassword(password);
    
    client = createClient();
    await client.connect();
    
    const result = await client.sql`
      INSERT INTO users (username, email, password, balance)
      VALUES (${username}, ${email}, ${hashedPassword}, 10)
      RETURNING id, username, email, balance
    `;
    
    const user = result.rows[0];
    console.log('[register] User registered successfully:', user.id);
    
    return res.status(200).json({
      success: true,
      user,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('[register] Registration error:', error.message);
    console.error('[register] Error details:', error);
    
    // 检查是否是重复键错误
    if (error.message && error.message.includes('duplicate')) {
      return res.status(400).json({
        success: false,
        error: '用户名或邮箱已存在',
      });
    }
    
    return res.status(500).json({
      success: false,
      error: '注册失败，请稍后重试',
      details: error.message,
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
