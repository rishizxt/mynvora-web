// =========================================================
// MYNVORA ADMIN — LOGIN
// Demo login. Pick a role → enter dashboard.
// Real auth (email + password + MFA) comes with backend.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore.js';
import { getAllRoles } from '../../data/adminRoles.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('super_admin');

  const roles = getAllRoles();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand */}
        <div className="admin-login-brand">
          <div className="admin-login-logo">
            <i className="fa-solid fa-shield-halved" />
          </div>
          <h1>MYNVORA</h1>
          <p>Staff Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@mynvora.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Sign in <i className="fa-solid fa-arrow-right" />
          </button>
        </form>

        {/* Role picker (demo only) */}
        <div className="admin-login-demo">
          <div className="admin-login-demo-label">
            <span />
            Demo — pick a role
            <span />
          </div>

          <div className="admin-role-grid">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`admin-role-chip ${
                  selectedRole === role.id ? 'selected' : ''
                }`}
                style={
                  selectedRole === role.id
                    ? {
                        borderColor: role.color,
                        background: `${role.color}18`,
                        color: '#fff'
                      }
                    : {}
                }
                onClick={() => setSelectedRole(role.id)}
              >
                <span
                  className="admin-role-dot"
                  style={{ background: role.color }}
                />
                {role.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="admin-login-continue"
            onClick={() => {
              login(selectedRole);
              navigate('/admin/dashboard', { replace: true });
            }}
          >
            Continue as {roles.find((r) => r.id === selectedRole)?.name}
          </button>
        </div>

        {/* Footer */}
        <div className="admin-login-footer">
          <i className="fa-solid fa-lock" />
          Restricted access · Authorized personnel only
        </div>
      </div>
    </div>
  );
}