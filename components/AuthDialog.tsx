import React, { useState } from 'react';

interface AuthDialogProps {
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
}

export default function AuthDialog({ onClose, onLoginSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login'
        ? { username: formData.username, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      if (mode === 'register' && formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致');
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || '操作失败');
        setLoading(false);
        return;
      }

      onLoginSuccess(data.token, data.user);
      onClose();
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <div style={styles.header}>
          <h2>{mode === 'login' ? '登录' : '注册'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="用户名"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {mode === 'register' && (
            <input
              type="email"
              name="email"
              placeholder="邮箱"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="密码"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {mode === 'register' && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="确认密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <div style={styles.footer}>
          {mode === 'login' ? (
            <>
              没有账户？
              <button onClick={() => setMode('register')} style={styles.linkBtn}>
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账户？
              <button onClick={() => setMode('login')} style={styles.linkBtn}>
                立即登录
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  error: {
    color: '#d32f2f',
    fontSize: '14px',
    padding: '8px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
  },
  submitBtn: {
    padding: '10px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '16px',
    fontSize: '14px',
    color: '#666',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    cursor: 'pointer',
    marginLeft: '4px',
    textDecoration: 'underline',
  },
};
