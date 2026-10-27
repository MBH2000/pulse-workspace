import React, { useState, useEffect } from 'react';
import type { Workspace } from '../types/workspace';
import { Search, Layers, BookOpen, Zap, Users, X, Plus } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  onSelectWorkspace: (ws: Workspace) => void;
  onNavigate: (view: 'board' | 'docs' | 'automations' | 'activity' | 'team') => void;
  onOpenCreateTask: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  workspaces,
  onSelectWorkspace,
  onNavigate,
  onOpenCreateTask,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'create-task',
      title: 'Create New Issue',
      category: 'Actions',
      icon: <Plus size={15} color="var(--color-primary)" />,
      action: () => {
        onOpenCreateTask();
        onClose();
      },
    },
    {
      id: 'nav-board',
      title: 'Go to Issues & Sprint Board',
      category: 'Navigation',
      icon: <Layers size={15} color="var(--color-cyan)" />,
      action: () => {
        onNavigate('board');
        onClose();
      },
    },
    {
      id: 'nav-docs',
      title: 'Go to Documents & Wiki',
      category: 'Navigation',
      icon: <BookOpen size={15} color="var(--color-amber)" />,
      action: () => {
        onNavigate('docs');
        onClose();
      },
    },
    {
      id: 'nav-automations',
      title: 'Go to Automations & Queue',
      category: 'Navigation',
      icon: <Zap size={15} color="var(--color-green)" />,
      action: () => {
        onNavigate('automations');
        onClose();
      },
    },
    {
      id: 'nav-team',
      title: 'Go to Team & RBAC Settings',
      category: 'Navigation',
      icon: <Users size={15} color="var(--color-purple)" />,
      action: () => {
        onNavigate('team');
        onClose();
      },
    },
    // Workspaces
    ...workspaces.map(ws => ({
      id: `ws-${ws.id}`,
      title: `Switch Workspace: ${ws.name}`,
      category: 'Workspaces',
      icon: <span>{ws.icon}</span>,
      action: () => {
        onSelectWorkspace(ws);
        onClose();
      },
    })),
  ];

  const filtered = commands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '560px' }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(10, 14, 23, 0.95)',
        }}>
          <Search size={18} color="var(--color-primary)" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to view..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '14px',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '6px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No commands found matching "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedIndex === idx ? 'var(--color-primary-soft)' : 'transparent',
                  border: selectedIndex === idx ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  marginBottom: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                    {item.title}
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {item.category}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px',
          background: 'rgba(7, 10, 18, 0.8)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>Press <strong>ESC</strong> to close</span>
          <span>PulseWorkspace Command Hub</span>
        </div>
      </div>
    </div>
  );
};
