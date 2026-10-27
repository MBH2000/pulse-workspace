import React from 'react';
import type { User, PresenceUser } from '../types/workspace';
import { Search, UserPlus } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  teammates: User[];
  presenceUsers: PresenceUser[];
  onOpenCommandPalette: () => void;
  onOpenInviteModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  teammates,
  presenceUsers,
  onOpenCommandPalette,
  onOpenInviteModal,
}) => {
  return (
    <header className="top-header">
      {/* Title & View Subtitle */}
      <div>
        <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
          {title}
        </h1>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {subtitle}
        </div>
      </div>

      {/* Right Actions: Real-time Presence, Search & Invite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Real-time Multi-Tab Sync Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '11px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-green)' }} />
          <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>SYNC CHANNEL ACTIVE</span>
        </div>

        {/* Live Presence Avatars Stack */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', marginRight: '6px' }}>
            {teammates.slice(0, 3).map((user, idx) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                title={`${user.name} (${user.role}) - Online`}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: '2px solid var(--bg-sidebar)',
                  marginLeft: idx > 0 ? '-8px' : '0',
                  objectFit: 'cover',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {teammates.length + presenceUsers.length} active
          </span>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="btn"
          style={{ padding: '6px 12px', fontSize: '12px', gap: '8px' }}
        >
          <Search size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-secondary)' }}>Search</span>
          <span className="font-mono" style={{ fontSize: '10px', background: 'rgba(255, 255, 255, 0.08)', padding: '1px 5px', borderRadius: '4px' }}>
            Cmd+K
          </span>
        </button>

        {/* Invite Member Action */}
        <button
          onClick={onOpenInviteModal}
          className="btn"
          style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'var(--border-active)' }}
        >
          <UserPlus size={14} color="var(--color-primary)" />
          <span>Invite</span>
        </button>
      </div>
    </header>
  );
};
