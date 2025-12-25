import { sql } from '@vercel/postgres';
import { getUserById } from '../auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, newBalance, adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: '管理员密码错误' });
  }

  if (!userId || newBalance === undefined || newBalance < 0) {
    return res.status(400).json({ error: '参数无效' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const oldBalance = user.balance;
    const difference = newBalance - oldBalance;

    await sql`
      UPDATE users SET balance = ${newBalance} WHERE id = ${userId}
    `;

    const transType = difference > 0 ? 'recharge' : 'deduct';
    const description = `管理员调整余额: ${oldBalance} → ${newBalance}`;

    await sql`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (${userId}, ${transType}, ${Math.abs(difference)}, ${description})
    `;

    const updatedUser = await getUserById(userId);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: '更新失败' });
  }
}
