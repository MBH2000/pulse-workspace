import React, { useState, useEffect, useCallback } from 'react';
import type { 
  Workspace, 
  User, 
  Role, 
  Task, 
  TaskStatus, 
  Document, 
  AutomationRule, 
  ActivityItem, 
  QueueJob, 
  PresenceUser 
} from './types/workspace';
import { 
  INITIAL_WORKSPACES, 
  INITIAL_USERS, 
  INITIAL_TASKS, 
  INITIAL_DOCS, 
  INITIAL_RULES, 
  INITIAL_ACTIVITY 
} from './data/mockData';
import { syncEngine } from './services/syncEngine';
import { automationEngine } from './services/automationEngine';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DocsHub } from './components/DocsHub';
import { AutomationCenter } from './components/AutomationCenter';
import { TeamManagement } from './components/TeamManagement';
import { ActivityLog } from './components/ActivityLog';
import { CommandPalette } from './components/CommandPalette';
import { CreateTaskModal } from './components/CreateTaskModal';
import { UndoToast } from './components/UndoToast';

export const App: React.FC = () => {
  const [workspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(INITIAL_WORKSPACES[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [docs, setDocs] = useState<Document[]>(INITIAL_DOCS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);

  const [activeView, setActiveView] = useState<'board' | 'docs' | 'automations' | 'activity' | 'team'>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [initialCreateStatus, setInitialCreateStatus] = useState<TaskStatus>('todo');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [undoToast, setUndoToast] = useState<{ message: string; previousTask: Task } | null>(null);

  // Subscribe to background automation queue
  useEffect(() => {
    const unsub = automationEngine.subscribe((updatedJobs) => {
      setJobs(updatedJobs);
    });
    return unsub;
  }, []);

  // Subscribe to BroadcastChannel Multi-Tab Sync Engine
  useEffect(() => {
    const unsub = syncEngine.subscribe((event) => {
      if (event.type === 'TASK_MUTATION') {
        setTasks((prev) => {
          if (event.action === 'created') return [event.task, ...prev];
          if (event.action === 'updated') return prev.map(t => t.id === event.task.id ? event.task : t);
          if (event.action === 'deleted') return prev.filter(t => t.id !== event.task.id);
          return prev;
        });
      } else if (event.type === 'ACTIVITY_LOG') {
        setActivities((prev) => [event.activity, ...prev]);
      } else if (event.type === 'PRESENCE_PING') {
        setPresenceUsers((prev) => {
          const filtered = prev.filter(p => p.id !== event.user.id);
          return [event.user, ...filtered].slice(0, 5);
        });
      }
    });

    return unsub;
  }, []);

  // Filter tasks for active workspace
  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspace.id);
  const workspaceDocs = docs.filter(d => d.workspaceId === activeWorkspace.id);
  const workspaceRules = rules.filter(r => r.workspaceId === activeWorkspace.id);
  const workspaceActivities = activities.filter(a => a.workspaceId === activeWorkspace.id);

  // RBAC Permission Checks
  const canEdit = currentUser.role !== 'viewer';

  // Task Mutations with Optimistic Updates & Undo Toast
  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    if (!canEdit) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const previousTask = { ...task };
    const updatedTask: Task = { ...task, status: newStatus, updatedAt: Date.now() };

    // 1. Optimistic Local Update
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

    // 2. Log Activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: `moved issue to ${newStatus.replace('_', ' ')}`,
      target: `${updatedTask.id}: ${updatedTask.title}`,
      timestamp: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev]);

    // 3. Broadcast to peer tabs
    syncEngine.broadcast({ type: 'TASK_MUTATION', task: updatedTask, action: 'updated' });
    syncEngine.broadcast({ type: 'ACTIVITY_LOG', activity: newActivity });

    // 4. Trigger Automation rules (e.g. if moved to 'done')
    if (newStatus === 'done') {
      automationEngine.processTaskEvent(updatedTask, 'TASK_STATUS_DONE', rules);
    }

    // 5. Trigger Undo Toast
    setUndoToast({
      message: `Moved ${task.id} to ${newStatus.replace('_', ' ')}`,
      previousTask,
    });
  }, [tasks, canEdit, activeWorkspace.id, currentUser, rules]);

  const handleUndo = useCallback(() => {
    if (!undoToast) return;
    const prev = undoToast.previousTask;
    setTasks(current => current.map(t => t.id === prev.id ? prev : t));
    syncEngine.broadcast({ type: 'TASK_MUTATION', task: prev, action: 'updated' });
    setUndoToast(null);
  }, [undoToast]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    if (!canEdit) return;
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    syncEngine.broadcast({ type: 'TASK_MUTATION', task: updatedTask, action: 'updated' });
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  }, [canEdit, selectedTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') return;
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== taskId));
    syncEngine.broadcast({ type: 'TASK_MUTATION', task: taskToDelete, action: 'deleted' });
    setSelectedTask(null);
  }, [currentUser.role, tasks]);

  const handleCreateTask = useCallback((newTask: Task) => {
    if (!canEdit) return;
    setTasks(prev => [newTask, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: 'created new issue',
      target: `${newTask.id}: ${newTask.title}`,
      timestamp: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev]);

    syncEngine.broadcast({ type: 'TASK_MUTATION', task: newTask, action: 'created' });
    syncEngine.broadcast({ type: 'ACTIVITY_LOG', activity: newActivity });

    if (newTask.priority === 'urgent') {
      automationEngine.processTaskEvent(newTask, 'TASK_URGENT_CREATED', rules);
    }
  }, [canEdit, activeWorkspace.id, currentUser, rules]);

  // Documentation mutations
  const handleUpdateDoc = useCallback((doc: Document) => {
    setDocs(prev => prev.map(d => d.id === doc.id ? doc : d));
  }, []);

  const handleCreateDoc = useCallback(() => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      title: 'Untitled Document',
      icon: '📝',
      content: '# Untitled Document\n\nStart writing notes or specifications here...',
      authorId: currentUser.id,
      updatedAt: Date.now(),
    };
    setDocs(prev => [newDoc, ...prev]);
  }, [activeWorkspace.id, currentUser.id]);

  // Member & Role mutations
  const handleUpdateMemberRole = useCallback((userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
  }, [currentUser.id]);

  const handleInviteMember = useCallback((name: string, email: string, role: Role) => {
    const newMember: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role,
      status: 'online',
      title: 'Team Contributor',
    };
    setUsers(prev => [...prev, newMember]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: `invited ${name} as ${role}`,
      target: email,
      timestamp: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev]);
  }, [activeWorkspace.id, currentUser]);

  const viewMeta = {
    board: { title: `${activeWorkspace.name} / Sprint Backlog`, subtitle: 'Linear-style sprint board with optimistic transitions' },
    docs: { title: `${activeWorkspace.name} / Knowledge Wiki`, subtitle: 'Collaborative product specifications and technical RFCs' },
    automations: { title: `${activeWorkspace.name} / Automation Pipelines`, subtitle: 'Background workers, webhook dispatchers, and queue metrics' },
    activity: { title: `${activeWorkspace.name} / Audit Trail`, subtitle: 'Real-time timeline of all team actions and transitions' },
    team: { title: `${activeWorkspace.name} / Team & RBAC`, subtitle: 'Fine-grained role-based access control and member permissions' },
  }[activeView];

  return (
    <div className="app-container">
      {/* 1. Left Sidebar Navigation & Workspace Switcher */}
      <Sidebar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        activeView={activeView}
        onSelectView={setActiveView}
        currentUser={currentUser}
        onChangeRole={(newRole) => setCurrentUser(prev => ({ ...prev, role: newRole }))}
        onOpenCreateTask={() => {
          setInitialCreateStatus('todo');
          setCreateTaskModalOpen(true);
        }}
      />

      {/* 2. Main Content Area */}
      <div className="main-content">
        <Header
          title={viewMeta.title}
          subtitle={viewMeta.subtitle}
          teammates={users}
          presenceUsers={presenceUsers}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenInviteModal={() => setActiveView('team')}
        />

        <div className="view-body">
          {activeView === 'board' && (
            <KanbanBoard
              tasks={workspaceTasks}
              users={users}
              onSelectTask={setSelectedTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onQuickCreateTask={(status) => {
                setInitialCreateStatus(status);
                setCreateTaskModalOpen(true);
              }}
              canEdit={canEdit}
            />
          )}

          {activeView === 'docs' && (
            <DocsHub
              docs={workspaceDocs}
              users={users}
              currentUser={currentUser}
              onUpdateDoc={handleUpdateDoc}
              onCreateDoc={handleCreateDoc}
            />
          )}

          {activeView === 'automations' && (
            <AutomationCenter
              rules={workspaceRules}
              jobs={jobs}
              onToggleRule={(ruleId) => {
                setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
              }}
              onTriggerTestJob={(ruleName) => {
                automationEngine.enqueueJob(ruleName, `Manual trigger test by ${currentUser.name}`);
              }}
            />
          )}

          {activeView === 'activity' && (
            <ActivityLog activities={workspaceActivities} />
          )}

          {activeView === 'team' && (
            <TeamManagement
              users={users}
              currentUser={currentUser}
              onUpdateMemberRole={handleUpdateMemberRole}
              onInviteMember={handleInviteMember}
            />
          )}
        </div>
      </div>

      {/* 3. Task Details Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          users={users}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* 4. Create Task Modal */}
      {createTaskModalOpen && (
        <CreateTaskModal
          initialStatus={initialCreateStatus}
          workspaceId={activeWorkspace.id}
          users={users}
          onClose={() => setCreateTaskModalOpen(false)}
          onCreateTask={handleCreateTask}
        />
      )}

      {/* 5. Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        workspaces={workspaces}
        onSelectWorkspace={setActiveWorkspace}
        onNavigate={setActiveView}
        onOpenCreateTask={() => {
          setInitialCreateStatus('todo');
          setCreateTaskModalOpen(true);
        }}
      />

      {/* 6. Optimistic UI Undo Toast */}
      {undoToast && (
        <UndoToast
          message={undoToast.message}
          onUndo={handleUndo}
          onDismiss={() => setUndoToast(null)}
        />
      )}
    </div>
  );
};

export default App;
