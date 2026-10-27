import type { AutomationRule, QueueJob, Task } from '../types/workspace';

type QueueListener = (jobs: QueueJob[]) => void;

class AutomationEngine {
  private jobs: QueueJob[] = [];
  private listeners: Set<QueueListener> = new Set();

  public subscribe(listener: QueueListener) {
    this.listeners.add(listener);
    listener([...this.jobs]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public processTaskEvent(task: Task, eventType: string, rules: AutomationRule[]) {
    const matchingRules = rules.filter(r => r.enabled && r.triggerEvent === eventType);

    for (const rule of matchingRules) {
      this.enqueueJob(rule.name, `Payload: Task [${task.id}] - "${task.title}" (Status: ${task.status})`);
    }
  }

  public enqueueJob(ruleName: string, payload: string) {
    const jobId = `job-${Math.random().toString(36).substring(2, 8)}`;
    const newJob: QueueJob = {
      id: jobId,
      ruleName,
      status: 'processing',
      queuedAt: Date.now(),
      durationMs: 0,
      payload,
    };

    this.jobs.unshift(newJob);
    if (this.jobs.length > 30) this.jobs.pop();
    this.notify();

    // Simulate async background worker execution
    const executionDuration = Math.floor(250 + Math.random() * 400);
    setTimeout(() => {
      const idx = this.jobs.findIndex(j => j.id === jobId);
      if (idx !== -1) {
        this.jobs[idx] = {
          ...this.jobs[idx],
          status: 'completed',
          durationMs: executionDuration,
        };
        this.notify();
      }
    }, executionDuration);
  }

  public getJobs(): QueueJob[] {
    return this.jobs;
  }

  private notify() {
    for (const listener of this.listeners) {
      listener([...this.jobs]);
    }
  }
}

export const automationEngine = new AutomationEngine();
