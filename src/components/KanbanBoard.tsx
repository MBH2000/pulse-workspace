import React, { useState } from 'react';
import type { Task, TaskStatus, Priority, User } from '../types/workspace';
import { 
  AlertCircle, 
  ArrowUp, 
  ArrowRight, 
  Minus, 
  Plus, 
  Clock, 
  ListChecks, 
  Search
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onQuickCreateTask: (status: TaskStatus) => void;
  canEdit: boolean;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: '#64748b' },
  { id: 'todo', title: 'To Do', color: '#06b6d4' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'in_review', title: 'In Review', color: '#a855f7' },
  { id: 'done', title: 'Done', color: '#10b981' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  users,
  onSelectTask,
  onUpdateTaskStatus,
  onQuickCreateTask,
  canEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || t.assigneeId === assigneeFilter;

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle size={13} color="var(--color-red)" />;
      case 'high':
        return <ArrowUp size={13} color="var(--color-amber)" />;
      case 'medium':
        return <Minus size={13} color="var(--color-primary)" />;
      case 'low':
        return <Minus size={13} color="var(--text-muted)" />;
    }
  };

  const getUser = (userId: string | null) => {
    if (!userId) return null;
    return users.find(u => u.id === userId) || null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Filtering and Search Toolbar */}
      <div style={{
        padding: '10px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(11, 16, 27, 0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '4px 10px',
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter tasks by title or label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                width: '220px',
              }}
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '5px 10px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all" style={{ background: '#111827' }}>All Priorities</option>
            <option value="urgent" style={{ background: '#111827' }}>Urgent</option>
            <option value="high" style={{ background: '#111827' }}>High</option>
            <option value="medium" style={{ background: '#111827' }}>Medium</option>
            <option value="low" style={{ background: '#111827' }}>Low</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '5px 10px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all" style={{ background: '#111827' }}>All Assignees</option>
            {users.map(u => (
              <option key={u.id} value={u.id} style={{ background: '#111827' }}>{u.name}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Kanban Columns Container */}
      <div className="kanban-container">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const totalPoints = colTasks.reduce((acc, t) => acc + t.points, 0);

          return (
            <div key={col.id} className="kanban-column">
              {/* Column Header */}
              <div className="column-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  <span style={{ color: '#fff' }}>{col.title}</span>
                  <span className="font-mono" style={{
                    fontSize: '11px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    color: 'var(--text-secondary)',
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {totalPoints} pts
                  </span>
                  {canEdit && (
                    <button
                      onClick={() => onQuickCreateTask(col.id)}
                      className="btn btn-ghost"
                      style={{ padding: '3px', borderRadius: '4px' }}
                      title={`Add issue to ${col.title}`}
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Tasks List */}
              <div className="column-tasks">
                {colTasks.map((task) => {
                  const assignee = getUser(task.assigneeId);
                  const completedSubtasks = task.subtasks.filter(st => st.completed).length;

                  return (
                    <div
                      key={task.id}
                      className="task-card"
                      onClick={() => onSelectTask(task)}
                    >
                      {/* Top Row: Key + Priority */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {task.id}
                          </span>
                          <span className={`badge badge-${task.priority}`} title={`Priority: ${task.priority}`}>
                            {getPriorityIcon(task.priority)}
                            <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
                          </span>
                        </div>

                        {/* Quick Status Advance Arrow if canEdit */}
                        {canEdit && (
                          <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                            {col.id !== 'done' && (
                              <button
                                onClick={() => {
                                  const nextIdx = COLUMNS.findIndex(c => c.id === col.id) + 1;
                                  if (nextIdx < COLUMNS.length) {
                                    onUpdateTaskStatus(task.id, COLUMNS[nextIdx].id);
                                  }
                                }}
                                className="btn btn-ghost"
                                style={{ padding: '2px 4px', fontSize: '10px', color: 'var(--color-primary)' }}
                                title="Move to next stage"
                              >
                                <ArrowRight size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Task Title */}
                      <h4 style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#fff',
                        lineHeight: '1.35',
                        marginBottom: '8px',
                      }}>
                        {task.title}
                      </h4>

                      {/* Labels Chips */}
                      {task.labels.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                          {task.labels.map((lbl) => (
                            <span key={lbl} className="badge badge-label">
                              {lbl}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Row: Assignee, Subtasks & Points */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '8px',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {task.subtasks.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="font-mono">
                              <ListChecks size={13} />
                              <span>{completedSubtasks}/{task.subtasks.length}</span>
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="font-mono">
                            <Clock size={12} />
                            <span>{task.dueDate.split('-').slice(1).join('/')}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-mono" style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}>
                            {task.points} pts
                          </span>

                          {assignee ? (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              title={`Assigned to ${assignee.name}`}
                              style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Unassigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
