import { sql } from '@vercel/postgres';
import { verifyToken } from '../auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token 无效或已过期' });
  }

  try {
    const result = await sql`
      SELECT * FROM transactions WHERE user_id = ${decoded.userId}
      ORDER BY created_at DESC LIMIT 50
    `;
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: '获取交易记录失败' });
  }
}
