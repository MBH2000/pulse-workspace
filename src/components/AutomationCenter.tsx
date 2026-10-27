import React from 'react';
import type { AutomationRule, QueueJob } from '../types/workspace';
import { Zap, Play, Activity } from 'lucide-react';

interface AutomationCenterProps {
  rules: AutomationRule[];
  jobs: QueueJob[];
  onToggleRule: (ruleId: string) => void;
  onTriggerTestJob: (ruleName: string) => void;
}

export const AutomationCenter: React.FC<AutomationCenterProps> = ({
  rules,
  jobs,
  onToggleRule,
  onTriggerTestJob,
}) => {
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const avgDuration = jobs.length > 0
    ? Math.round(jobs.reduce((acc, j) => acc + (j.durationMs || 250), 0) / jobs.length)
    : 240;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '24px' }}>
      {/* Header & Worker Diagnostics HUD */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
          Automations & Background Job Queue
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Asynchronous event pipelines powered by BullMQ-style background workers with real-time webhooks.
        </p>

        {/* Worker Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>QUEUE WORKER STATUS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-green)' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>ACTIVE & POLLING</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>JOBS PROCESSED</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
              {completedCount} Completed
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVG EXECUTION TIME</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-cyan)', marginTop: '4px' }}>
              {avgDuration} ms
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SUCCESS RATE</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-green)', marginTop: '4px' }}>
              100.0%
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Rules vs Live Queue Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1 }}>
        {/* Active Rules List */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color="var(--color-primary)" />
            <span>Configured Event Rules</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: '1.4' }}>
                      {rule.name}
                    </div>
                    <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Trigger: <span style={{ color: 'var(--color-cyan)' }}>{rule.triggerEvent}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`btn ${rule.enabled ? 'btn-primary' : ''}`}
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => onTriggerTestJob(rule.name)}
                      className="btn"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Test Trigger Rule"
                    >
                      <Play size={12} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '8px' }}>
                  <span>Action: {rule.actionType}</span>
                  <span className="font-mono">{rule.executionsCount} total executions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Background Queue Execution Log */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={15} color="var(--color-green)" />
            <span>Live Worker Execution Stream</span>
          </h3>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '8px 12px',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'grid',
              gridTemplateColumns: '80px 1fr 70px',
              background: 'rgba(7, 10, 18, 0.5)',
            }}>
              <span>STATUS</span>
              <span>JOB / PAYLOAD</span>
              <span style={{ textAlign: 'right' }}>LATENCY</span>
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {jobs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No jobs queued yet. Move a task to Done or click the play button above to test!
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 70px',
                      alignItems: 'center',
                      fontSize: '11px',
                    }}
                  >
                    <div>
                      {job.status === 'completed' ? (
                        <span style={{
                          color: 'var(--color-green)',
                          background: 'var(--color-green-soft)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}>
                          DONE
                        </span>
                      ) : (
                        <span style={{
                          color: 'var(--color-amber)',
                          background: 'var(--color-amber-soft)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}>
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                      <div style={{ color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.ruleName.split('->')[0]}
                      </div>
                      <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.payload}
                      </div>
                    </div>

                    <div className="font-mono" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {job.durationMs ? `${job.durationMs}ms` : '...'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
