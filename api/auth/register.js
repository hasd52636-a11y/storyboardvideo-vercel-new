import { register } from '../auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  const result = await register(username, email, password);
  res.status(result.success ? 200 : 400).json(result);
}
