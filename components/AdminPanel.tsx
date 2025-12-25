import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
  created_at: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdminLogin = () => {
    // 简单的管理员验证（生产环境应该更安全）
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setError('');
      loadUsers();
    } else {
      setError('管理员密码错误');
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/get-all-users?adminPassword=${adminPassword}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      
      setUsers(data);
      setError('');
      setLoading(false);
    } catch (err) {
      setError('加载用户失败');
      setLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser || !newBalance) {
      setError('请选择用户并输入新余额');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          newBalance: parseFloat(newBalance),
          adminPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`用户 ${selectedUser.username} 的余额已更新为 ¥${newBalance}`);
        setNewBalance('');
        setSelectedUser(null);
        setError('');
        // 重新加载用户列表
        setTimeout(() => loadUsers(), 1000);
      } else {
        setError(data.error || '更新失败');
      }
    } catch (err) {
      setError('更新失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.overlay}>
        <div style={styles.dialog}>
          <h2>管理员登录</h2>
          <input
            type="password"
            placeholder="管理员密码"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            style={styles.input}
          />
          {error && <div style={styles.error}>{error}</div>}
          <button onClick={handleAdminLogin} style={styles.button}>
            登录
          </button>
          <button onClick={onClose} style={styles.cancelBtn}>
            关闭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <div style={styles.header}>
          <h2>管理员面板 - 用户管理</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h3>选择用户</h3>
            <div style={styles.userList}>
              {users.length === 0 ? (
                <p>暂无用户</p>
              ) : (
                users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    style={{
                      ...styles.userItem,
                      backgroundColor: selectedUser?.id === user.id ? '#e3f2fd' : 'white',
                    }}
                  >
                    <div>{user.username}</div>
                    <div style={styles.userEmail}>{user.email}</div>
                    <div style={styles.userBalance}>余额: ¥{user.balance}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedUser && (
            <div style={styles.section}>
              <h3>修改余额</h3>
              <div style={styles.form}>
                <div>
                  <label>用户: {selectedUser.username}</label>
                </div>
                <div>
                  <label>当前余额: ¥{selectedUser.balance}</label>
                </div>
                <input
                  type="number"
                  placeholder="新余额"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  style={styles.input}
                />
                <button
                  onClick={handleUpdateBalance}
                  disabled={loading}
                  style={styles.button}
                >
                  {loading ? '更新中...' : '更新余额'}
                </button>
              </div>
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
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
    zIndex: 2000,
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
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
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  section: {
    borderBottom: '1px solid #eee',
    paddingBottom: '20px',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '300px',
    overflow: 'auto',
  },
  userItem: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  userEmail: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },
  userBalance: {
    fontSize: '12px',
    color: '#1976d2',
    marginTop: '4px',
    fontWeight: 'bold',
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
  button: {
    padding: '10px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '10px',
    backgroundColor: '#ccc',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#d32f2f',
    fontSize: '14px',
    padding: '8px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
  },
  success: {
    color: '#388e3c',
    fontSize: '14px',
    padding: '8px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
  },
};
