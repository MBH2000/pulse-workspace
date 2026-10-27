import React, { useState } from 'react';
import type { Task, TaskStatus, Priority, User } from '../types/workspace';
import { X, CheckSquare, Square, Plus, Trash2, Send } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  users: User[];
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  users,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [assigneeId, setAssigneeId] = useState<string | null>(task.assigneeId);
  const [points, setPoints] = useState<number>(task.points);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');

  const canEdit = currentUser.role !== 'viewer';
  const canDelete = currentUser.role === 'owner' || currentUser.role === 'admin';

  const handleToggleSubtask = (subtaskId: string) => {
    if (!canEdit) return;
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const updated = { ...task, subtasks: updatedSubtasks, updatedAt: Date.now() };
    onUpdateTask(updated);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim() || !canEdit) return;
    const updated = {
      ...task,
      subtasks: [
        ...task.subtasks,
        { id: `st-${Date.now()}`, title: newSubtask.trim(), completed: false }
      ],
      updatedAt: Date.now(),
    };
    onUpdateTask(updated);
    setNewSubtask('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const updated = {
      ...task,
      comments: [
        ...task.comments,
        {
          id: `c-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: newComment.trim(),
          createdAt: Date.now(),
        }
      ],
      updatedAt: Date.now(),
    };
    onUpdateTask(updated);
    setNewComment('');
  };

  const handleSaveFields = () => {
    if (!canEdit) return;
    onUpdateTask({
      ...task,
      title,
      description,
      status,
      priority,
      assigneeId,
      points,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '740px' }}>
        {/* Modal Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 16, 27, 0.95)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {task.id}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Updated {new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {canDelete && (
              <button
                onClick={() => onDeleteTask(task.id)}
                className="btn btn-ghost"
                style={{ color: 'var(--color-red)', padding: '6px' }}
                title="Delete Issue"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Split 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', flex: 1, overflow: 'hidden' }}>
          {/* Main Left Column: Title, Description, Subtasks, Comments */}
          <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title Input */}
            <div>
              <input
                type="text"
                value={title}
                disabled={!canEdit}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveFields}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#fff',
                  borderBottom: '1px solid transparent',
                }}
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Description
              </label>
              <textarea
                value={description}
                disabled={!canEdit}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSaveFields}
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Subtasks Checklist */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => handleToggleSubtask(st.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      cursor: canEdit ? 'pointer' : 'default',
                    }}
                  >
                    {st.completed ? (
                      <CheckSquare size={15} color="var(--color-green)" />
                    ) : (
                      <Square size={15} color="var(--text-muted)" />
                    )}
                    <span style={{
                      fontSize: '12px',
                      color: st.completed ? 'var(--text-muted)' : '#fff',
                      textDecoration: st.completed ? 'line-through' : 'none',
                    }}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>

              {canEdit && (
                <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      color: '#fff',
                      outline: 'none',
                    }}
                  />
                  <button type="submit" className="btn" style={{ padding: '5px 10px', fontSize: '12px' }}>
                    <Plus size={13} />
                    Add
                  </button>
                </form>
              )}
            </div>

            {/* Comments Thread */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                Activity & Comments ({task.comments.length})
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {task.comments.map((c) => (
                  <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{c.userName}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {c.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#fff',
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
                  <Send size={13} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Status, Priority, Assignee, Points */}
          <div style={{
            borderLeft: '1px solid var(--border-subtle)',
            background: 'rgba(11, 16, 27, 0.6)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontSize: '12px',
          }}>
            {/* Status Selector */}
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Status
              </label>
              <select
                value={status}
                disabled={!canEdit}
                onChange={(e) => {
                  const s = e.target.value as TaskStatus;
                  setStatus(s);
                  onUpdateTask({ ...task, status: s, updatedAt: Date.now() });
                }}
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

            {/* Priority Selector */}
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={priority}
                disabled={!canEdit}
                onChange={(e) => {
                  const p = e.target.value as Priority;
                  setPriority(p);
                  onUpdateTask({ ...task, priority: p, updatedAt: Date.now() });
                }}
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

            {/* Assignee Selector */}
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Assignee
              </label>
              <select
                value={assigneeId || ''}
                disabled={!canEdit}
                onChange={(e) => {
                  const uid = e.target.value || null;
                  setAssigneeId(uid);
                  onUpdateTask({ ...task, assigneeId: uid, updatedAt: Date.now() });
                }}
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

            {/* Story Points */}
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Estimate (Story Points)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={points}
                disabled={!canEdit}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                onBlur={handleSaveFields}
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
        </div>
      </div>
    </div>
  );
};
