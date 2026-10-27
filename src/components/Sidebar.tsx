import React from 'react';
import type { Workspace, User, Role } from '../types/workspace';
import { 
  Layers, 
  BookOpen, 
  Zap, 
  History, 
  Users, 
  Plus, 
  ChevronDown, 
  Shield 
} from 'lucide-react';

interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
  activeView: 'board' | 'docs' | 'automations' | 'activity' | 'team';
  onSelectView: (view: 'board' | 'docs' | 'automations' | 'activity' | 'team') => void;
  currentUser: User;
  onChangeRole: (role: Role) => void;
  onOpenCreateTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  activeView,
  onSelectView,
  currentUser,
  onChangeRole,
  onOpenCreateTask,
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'board' as const, label: 'Issues & Sprints', icon: <Layers size={17} /> },
    { id: 'docs' as const, label: 'Docs & Wiki', icon: <BookOpen size={17} /> },
    { id: 'automations' as const, label: 'Automations & Queue', icon: <Zap size={17} /> },
    { id: 'activity' as const, label: 'Activity & Audit', icon: <History size={17} /> },
    { id: 'team' as const, label: 'Team & RBAC', icon: <Users size={17} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Workspace Selector Dropdown */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{activeWorkspace.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{activeWorkspace.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activeWorkspace.plan} Plan</div>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </button>

        {/* Dropdown Menu */}
        {workspaceMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '64px',
            left: '16px',
            right: '16px',
            background: '#131b2e',
            border: '1px solid var(--border-active)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
            padding: '4px',
            zIndex: 50,
          }}>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  onSelectWorkspace(ws);
                  setWorkspaceMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: ws.id === activeWorkspace.id ? 'var(--color-primary-soft)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: ws.id === activeWorkspace.id ? 'var(--color-primary)' : '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textAlign: 'left',
                }}
              >
                <span>{ws.icon}</span>
                <span style={{ fontWeight: ws.id === activeWorkspace.id ? 600 : 400 }}>{ws.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Task Action Button */}
      <div style={{ padding: '14px 16px 8px 16px' }}>
        <button
          onClick={onOpenCreateTask}
          disabled={currentUser.role === 'viewer'}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '13px',
            opacity: currentUser.role === 'viewer' ? 0.5 : 1,
            cursor: currentUser.role === 'viewer' ? 'not-allowed' : 'pointer'
          }}
          title={currentUser.role === 'viewer' ? 'Viewers cannot create issues' : 'Create new issue'}
        >
          <Plus size={16} />
          <span>New Issue</span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Current User Card with Live Role Switcher (RBAC Showcase) */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 18, 0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentUser.title}
            </div>
          </div>
        </div>

        {/* Live RBAC Role Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '6px',
          padding: '4px 8px',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <Shield size={12} color="var(--color-primary)" />
            <span>Role:</span>
          </div>

          <select
            value={currentUser.role}
            onChange={(e) => onChangeRole(e.target.value as Role)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              textTransform: 'uppercase',
            }}
          >
            <option value="owner" style={{ background: '#111827' }}>Owner</option>
            <option value="admin" style={{ background: '#111827' }}>Admin</option>
            <option value="member" style={{ background: '#111827' }}>Member</option>
            <option value="viewer" style={{ background: '#111827' }}>Viewer</option>
          </select>
        </div>
      </div>
    </aside>
  );
};
