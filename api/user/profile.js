import { getUserById, verifyToken } from '../auth.js';

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

  const user = await getUserById(decoded.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json(user);
}
