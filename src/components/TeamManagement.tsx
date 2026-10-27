import React, { useState } from 'react';
import type { User, Role } from '../types/workspace';
import { Shield, UserPlus, Check, Copy } from 'lucide-react';

interface TeamManagementProps {
  users: User[];
  currentUser: User;
  onUpdateMemberRole: (userId: string, newRole: Role) => void;
  onInviteMember: (name: string, email: string, role: Role) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  users,
  currentUser,
  onUpdateMemberRole,
  onInviteMember,
}) => {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('member');
  const [copiedLink, setCopiedLink] = useState(false);

  const canManageRoles = currentUser.role === 'owner' || currentUser.role === 'admin';

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    onInviteMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteName('');
    setInviteEmail('');
    setInviteModalOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://pulseworkspace.app/join?token=inv_93812739281739');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            Team Roster & Role-Based Access Control (RBAC)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Manage workspace members, assign fine-grained roles, and enforce security boundaries.
          </p>
        </div>

        {canManageRoles && (
          <button onClick={() => setInviteModalOpen(true)} className="btn btn-primary">
            <UserPlus size={14} />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Member List Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '32px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(7, 10, 18, 0.6)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px' }}>
              <th style={{ padding: '12px 16px' }}>MEMBER</th>
              <th style={{ padding: '12px 16px' }}>ROLE</th>
              <th style={{ padding: '12px 16px' }}>TITLE</th>
              <th style={{ padding: '12px 16px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {/* Member Info */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{member.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role Switcher */}
                <td style={{ padding: '12px 16px' }}>
                  {canManageRoles ? (
                    <select
                      value={member.role}
                      onChange={(e) => onUpdateMemberRole(member.id, e.target.value as Role)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        color: '#fff',
                        fontSize: '12px',
                        outline: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      <option value="owner" style={{ background: '#111827' }}>Owner</option>
                      <option value="admin" style={{ background: '#111827' }}>Admin</option>
                      <option value="member" style={{ background: '#111827' }}>Member</option>
                      <option value="viewer" style={{ background: '#111827' }}>Viewer</option>
                    </select>
                  ) : (
                    <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '12px', color: 'var(--color-primary)' }}>
                      {member.role}
                    </span>
                  )}
                </td>

                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                  {member.title}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: member.status === 'online' ? 'var(--color-green)' : 'var(--text-muted)',
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: member.status === 'online' ? 'var(--color-green)' : 'var(--text-muted)',
                    }} />
                    {member.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RBAC Permission Matrix Preview */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={16} color="var(--color-primary)" />
          <span>Role Permission Matrix</span>
        </h3>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          fontSize: '12px',
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>👑 OWNER</div>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>Full workspace governance</li>
              <li>Billing & plan subscription</li>
              <li>Transfer ownership</li>
              <li>Delete workspace</li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>🛡️ ADMIN</div>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>Invite & remove members</li>
              <li>Manage automation rules</li>
              <li>Delete issues & wiki docs</li>
              <li>Configure integrations</li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-cyan)', marginBottom: '6px' }}>👤 MEMBER</div>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>Create & edit issues</li>
              <li>Post comments & subtasks</li>
              <li>Write wiki docs</li>
              <li>Trigger test jobs</li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>👁️ VIEWER</div>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
              <li>Read-only sprint board</li>
              <li>Read docs & audit log</li>
              <li>Cannot mutate state</li>
              <li>Ideal for external auditors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="modal-overlay" onClick={() => setInviteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, color: '#fff' }}>
              Invite Team Member
            </div>

            <form onSubmit={handleSendInvite} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Taylor"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  WORK EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="liam.t@company.internal"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  ACCESS ROLE
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="member" style={{ background: '#111827' }}>Member (Full contributor access)</option>
                  <option value="admin" style={{ background: '#111827' }}>Admin (Team & automation management)</option>
                  <option value="viewer" style={{ background: '#111827' }}>Viewer (Read-only)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button type="button" onClick={handleCopyLink} className="btn" style={{ fontSize: '12px' }}>
                  {copiedLink ? <Check size={14} color="var(--color-green)" /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Magic Link'}</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setInviteModalOpen(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Invite
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
