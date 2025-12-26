import './setup-env.js';
import { initializeDatabase } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await initializeDatabase();
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Database initialized successfully' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
