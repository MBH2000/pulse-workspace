import React, { useState } from 'react';
import type { Task, TaskStatus, Priority, User } from '../types/workspace';
import { X, Plus } from 'lucide-react';

interface CreateTaskModalProps {
  initialStatus?: TaskStatus;
  workspaceId: string;
  users: User[];
  onClose: () => void;
  onCreateTask: (newTask: Task) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  initialStatus = 'todo',
  workspaceId,
  users,
  onClose,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | null>(users[0]?.id || null);
  const [points, setPoints] = useState<number>(3);
  const [labelsInput, setLabelsInput] = useState('Frontend, Feature');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const labels = labelsInput.split(',').map(l => l.trim()).filter(Boolean);
    const idPrefix = workspaceId === 'ws-eng' ? 'ENG' : workspaceId === 'ws-prod' ? 'PRD' : 'GWT';
    const randomNum = Math.floor(100 + Math.random() * 900);

    const newTask: Task = {
      id: `${idPrefix}-${randomNum}`,
      workspaceId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      labels,
      points,
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      subtasks: [],
      comments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onCreateTask(newTask);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '540px' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 16, 27, 0.95)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Create New Issue</h3>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              ISSUE TITLE
            </label>
            <input
              autoFocus
              type="text"
              required
              placeholder="e.g. Implement OAuth2 Google Authentication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              DESCRIPTION
            </label>
            <textarea
              rows={3}
              placeholder="Add details, acceptance criteria, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                <option value="backlog" style={{ background: '#111827' }}>Backlog</option>
                <option value="todo" style={{ background: '#111827' }}>To Do</option>
                <option value="in_progress" style={{ background: '#111827' }}>In Progress</option>
                <option value="in_review" style={{ background: '#111827' }}>In Review</option>
                <option value="done" style={{ background: '#111827' }}>Done</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                PRIORITY
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                <option value="urgent" style={{ background: '#111827' }}>Urgent</option>
                <option value="high" style={{ background: '#111827' }}>High</option>
                <option value="medium" style={{ background: '#111827' }}>Medium</option>
                <option value="low" style={{ background: '#111827' }}>Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                ASSIGNEE
              </label>
              <select
                value={assigneeId || ''}
                onChange={(e) => setAssigneeId(e.target.value || null)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="" style={{ background: '#111827' }}>Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id} style={{ background: '#111827' }}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                ESTIMATE (STORY POINTS)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                className="font-mono"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              LABELS (COMMA-SEPARATED)
            </label>
            <input
              type="text"
              placeholder="e.g. Backend, Security, Bug"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 8px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={14} />
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
