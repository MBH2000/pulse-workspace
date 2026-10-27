import type { Task, ActivityItem, PresenceUser } from '../types/workspace';

export type SyncEvent =
  | { type: 'TASK_MUTATION'; task: Task; action: 'created' | 'updated' | 'deleted' }
  | { type: 'ACTIVITY_LOG'; activity: ActivityItem }
  | { type: 'PRESENCE_PING'; user: PresenceUser };

type SyncListener = (event: SyncEvent) => void;

class SyncEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();
  private simulatedPresenceInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('pulse_workspace_sync');
      this.channel.onmessage = (messageEvent: MessageEvent<SyncEvent>) => {
        this.notify(messageEvent.data);
      };
    }
    this.startSimulatedPresence();
  }

  public subscribe(listener: SyncListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(event: SyncEvent) {
    // Notify local listeners
    this.notify(event);
    // Broadcast across browser tabs / windows
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }
  }

  private notify(event: SyncEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  private startSimulatedPresence() {
    // Periodically simulate teammate presence updates (e.g. typing or switching tasks)
    const teammates = [
      { id: 'u-sarah', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
      { id: 'u-marcus', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
      { id: 'u-elena', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
    ];

    if (typeof window !== 'undefined') {
      this.simulatedPresenceInterval = window.setInterval(() => {
        const randomTeammate = teammates[Math.floor(Math.random() * teammates.length)];
        this.notify({
          type: 'PRESENCE_PING',
          user: {
            ...randomTeammate,
            lastSeen: Date.now(),
          },
        });
      }, 8000);
    }
  }

  public destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (this.simulatedPresenceInterval !== null) {
      clearInterval(this.simulatedPresenceInterval);
      this.simulatedPresenceInterval = null;
    }
  }
}

export const syncEngine = new SyncEngine();
