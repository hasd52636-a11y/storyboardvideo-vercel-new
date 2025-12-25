import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { adminPassword } = req.query;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: '管理员密码错误' });
  }

  try {
    const result = await sql`
      SELECT id, username, email, balance, created_at FROM users
      ORDER BY created_at DESC
    `;
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: '获取用户列表失败' });
  }
}
