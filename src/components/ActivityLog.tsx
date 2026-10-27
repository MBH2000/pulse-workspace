import React from 'react';
import type { ActivityItem } from '../types/workspace';
import { Clock } from 'lucide-react';

interface ActivityLogProps {
  activities: ActivityItem[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Workspace Activity & Audit Trail
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Immutable event stream capturing all task transitions, documentation updates, and permission changes.
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {activities.map((item, idx) => (
          <div
            key={item.id}
            style={{
              padding: '12px 18px',
              borderBottom: idx < activities.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={item.userAvatar}
                alt={item.userName}
                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <span style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>
                  {item.userName}
                </span>{' '}
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {item.action}
                </span>{' '}
                <span style={{
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                  fontSize: '12px',
                  background: 'var(--color-primary-soft)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}>
                  {item.target}
                </span>
              </div>
            </div>

            <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>{formatTimeAgo(item.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
