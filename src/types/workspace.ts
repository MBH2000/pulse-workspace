export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  status: 'online' | 'busy' | 'offline';
  title: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon: string;
  plan: 'Enterprise' | 'Team' | 'Starter';
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: number;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  labels: string[];
  points: number;
  dueDate: string;
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: number;
  updatedAt: number;
}

export interface Document {
  id: string;
  workspaceId: string;
  title: string;
  icon: string;
  content: string;
  authorId: string;
  updatedAt: number;
}

export interface ActivityItem {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: number;
}

export interface AutomationRule {
  id: string;
  workspaceId: string;
  name: string;
  triggerEvent: string;
  actionType: string;
  enabled: boolean;
  executionsCount: number;
}

export interface QueueJob {
  id: string;
  ruleName: string;
  status: 'completed' | 'processing' | 'failed';
  queuedAt: number;
  durationMs: number;
  payload: string;
}

export interface PresenceUser {
  id: string;
  name: string;
  avatar: string;
  activeTaskId?: string;
  activeDocId?: string;
  lastSeen: number;
}
