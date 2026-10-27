import type { Workspace, User, Task, Document, AutomationRule, ActivityItem } from '../types/workspace';

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-eng',
    name: 'Engineering Squad',
    slug: 'engineering',
    icon: '⚡',
    plan: 'Enterprise',
  },
  {
    id: 'ws-prod',
    name: 'Product & Design',
    slug: 'product',
    icon: '🎨',
    plan: 'Enterprise',
  },
  {
    id: 'ws-growth',
    name: 'Growth & Marketing',
    slug: 'growth',
    icon: '🚀',
    plan: 'Team',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.internal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'owner',
    status: 'online',
    title: 'Principal Full Stack Architect',
  },
  {
    id: 'u-sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.internal',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'online',
    title: 'Staff Frontend Engineer',
  },
  {
    id: 'u-marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@company.internal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'member',
    status: 'busy',
    title: 'Backend Systems Specialist',
  },
  {
    id: 'u-elena',
    name: 'Elena Rostova',
    email: 'elena.r@company.internal',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    role: 'viewer',
    status: 'offline',
    title: 'Product Design Lead',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'ENG-101',
    workspaceId: 'ws-eng',
    title: 'Implement distributed WebSockets gateway with Redis pub/sub',
    description: 'We need to scale our real-time messaging pipeline. Set up Redis streams and socket connection clustering across instances.',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'u-marcus',
    labels: ['Backend', 'Infrastructure', 'WebSocket'],
    points: 8,
    dueDate: '2026-09-25',
    subtasks: [
      { id: 'st-1', title: 'Spin up Redis Cluster on AWS ElastiCache', completed: true },
      { id: 'st-2', title: 'Implement heartbeat ping/pong protocol', completed: true },
      { id: 'st-3', title: 'Stress test 10k concurrent socket handshakes', completed: false },
    ],
    comments: [
      {
        id: 'c-1',
        userId: 'u-sarah',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        content: 'Benchmarks look promising! Average connection latency dropped under 12ms.',
        createdAt: Date.now() - 3600000 * 4,
      },
    ],
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'ENG-102',
    workspaceId: 'ws-eng',
    title: 'Audit and optimize Core Web Vitals (INP < 50ms & LCP < 1.2s)',
    description: 'Profile long animation frames and offload heavy JSON table parsing into a dedicated Web Worker.',
    status: 'in_review',
    priority: 'high',
    assigneeId: 'u-sarah',
    labels: ['Frontend', 'Performance', 'CWV'],
    points: 5,
    dueDate: '2026-09-22',
    subtasks: [
      { id: 'st-4', title: 'Implement virtualized list viewport', completed: true },
      { id: 'st-5', title: 'Move data transformations to Web Worker', completed: true },
    ],
    comments: [],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'ENG-103',
    workspaceId: 'ws-eng',
    title: 'Migrate session tokens to cryptographically signed JWT with refresh rotation',
    description: 'Ensure secure cross-origin HTTP-only cookie delivery and implement automated token refresh on 401 interceptors.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'u-alex',
    labels: ['Security', 'Auth', 'API'],
    points: 5,
    dueDate: '2026-09-28',
    subtasks: [
      { id: 'st-6', title: 'Draft RFC for token rotation scheme', completed: true },
      { id: 'st-7', title: 'Implement Axios/Fetch refresh queue', completed: false },
    ],
    comments: [],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000 * 10,
  },
  {
    id: 'ENG-104',
    workspaceId: 'ws-eng',
    title: 'Configure automated Playwright visual regression testing in GitHub Actions',
    description: 'Set up snapshot comparison tests across Chromium and WebKit on every PR to prevent CSS layout drift.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'u-alex',
    labels: ['CI/CD', 'QA', 'Automation'],
    points: 3,
    dueDate: '2026-09-18',
    subtasks: [
      { id: 'st-8', title: 'Create base screenshots fixture', completed: true },
      { id: 'st-9', title: 'Integrate artifact upload in GitHub workflow', completed: true },
    ],
    comments: [],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'ENG-105',
    workspaceId: 'ws-eng',
    title: 'Design multi-tenant database partitioning scheme with PostgreSQL RLS',
    description: 'Implement Row-Level Security policies to strictly isolate tenant queries at the database engine layer.',
    status: 'backlog',
    priority: 'urgent',
    assigneeId: 'u-marcus',
    labels: ['Database', 'PostgreSQL', 'Multi-Tenant'],
    points: 8,
    dueDate: '2026-10-05',
    subtasks: [],
    comments: [],
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
];

export const INITIAL_DOCS: Document[] = [
  {
    id: 'doc-arch-rfc',
    workspaceId: 'ws-eng',
    title: 'System Architecture RFC 2026: Real-Time Sync & Scalability',
    icon: '📐',
    content: `# System Architecture RFC 2026

## 1. Executive Summary
This RFC outlines our architectural migration towards **event-driven distributed state synchronization** and sub-50ms latency guarantees.

## 2. Core Pillars
- **Non-blocking Ingestion**: Decouple incoming transport events from UI rendering cycles using requestAnimationFrame batching.
- **Optimistic Concurrency**: Immediate local mutation with automatic compensation rollbacks upon network failure.
- **Role-Based Access Control (RBAC)**: Fine-grained token permission checks enforced on both edge API gateways and client UI boundaries.

## 3. Technology Matrix
- **State Store**: TypeScript strict reactive reducer
- **Transport**: WebSockets + Server-Sent Events (SSE)
- **Database**: PostgreSQL with Row-Level Security (RLS)`,
    authorId: 'u-alex',
    updatedAt: Date.now() - 3600000 * 8,
  },
  {
    id: 'doc-style-guide',
    workspaceId: 'ws-eng',
    title: 'Design System & Component Guidelines',
    icon: '🎨',
    content: `# Design System & Component Guidelines

## Typography
- Primary: **Inter** for crisp scannability and legibility.
- Monospace: **JetBrains Mono** with tabular numerals (\`tabular-nums\`) for all metrics and counters.

## Color Semantics
- **Brand Accent**: \`#6366f1\` (Electric Indigo)
- **Positive**: \`#10b981\` (Emerald Green)
- **Warning**: \`#f59e0b\` (Amber)
- **Danger**: \`#ef4444\` (Rose Crimson)`,
    authorId: 'u-sarah',
    updatedAt: Date.now() - 86400000 * 2,
  },
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-done-notify',
    workspaceId: 'ws-eng',
    name: 'When Issue is moved to Done -> Broadcast Slack alert & dispatch audit hook',
    triggerEvent: 'TASK_STATUS_DONE',
    actionType: 'SLACK_WEBHOOK_AND_AUDIT',
    enabled: true,
    executionsCount: 42,
  },
  {
    id: 'rule-urgent-escalate',
    workspaceId: 'ws-eng',
    name: 'When Urgent task created -> Ping Tech Lead on PagerDuty',
    triggerEvent: 'TASK_URGENT_CREATED',
    actionType: 'PAGERDUTY_ALERT',
    enabled: true,
    executionsCount: 18,
  },
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    workspaceId: 'ws-eng',
    userId: 'u-marcus',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    action: 'moved task to In Progress',
    target: 'ENG-101: Distributed WebSockets gateway',
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'act-2',
    workspaceId: 'ws-eng',
    userId: 'u-sarah',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    action: 'submitted PR for review',
    target: 'ENG-102: Core Web Vitals optimization',
    timestamp: Date.now() - 3600000 * 5,
  },
  {
    id: 'act-3',
    workspaceId: 'ws-eng',
    userId: 'u-alex',
    userName: 'Alex Morgan',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    action: 'published architecture RFC',
    target: 'System Architecture RFC 2026',
    timestamp: Date.now() - 3600000 * 8,
  },
];
