import { sql } from '@vercel/postgres';
import { getUserById, verifyToken } from '../auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: '金额无效' });
  }

  try {
    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: '余额不足' });
    }

    await sql`
      UPDATE users SET balance = balance - ${amount} WHERE id = ${decoded.userId}
    `;

    await sql`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (${decoded.userId}, 'deduct', ${amount}, ${description || ''})
    `;

    const updatedUser = await getUserById(decoded.userId);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: '扣费失败' });
  }
}
