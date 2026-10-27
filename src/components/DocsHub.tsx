import React, { useState } from 'react';
import type { Document, User } from '../types/workspace';
import { BookOpen, Plus, CheckCircle2, Eye, Edit3 } from 'lucide-react';

interface DocsHubProps {
  docs: Document[];
  users: User[];
  currentUser: User;
  onUpdateDoc: (doc: Document) => void;
  onCreateDoc: () => void;
}

export const DocsHub: React.FC<DocsHubProps> = ({
  docs,
  users,
  currentUser: _currentUser,
  onUpdateDoc,
  onCreateDoc,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || '');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [savedTime, setSavedTime] = useState<string>('Just now');

  const activeDoc = docs.find(d => d.id === selectedDocId) || docs[0];

  const handleTitleChange = (newTitle: string) => {
    if (!activeDoc) return;
    onUpdateDoc({ ...activeDoc, title: newTitle, updatedAt: Date.now() });
    setSavedTime('Just now');
  };

  const handleContentChange = (newContent: string) => {
    if (!activeDoc) return;
    onUpdateDoc({ ...activeDoc, content: newContent, updatedAt: Date.now() });
    setSavedTime('Just now');
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!activeDoc) return;
    const updated = activeDoc.content + `\n${prefix}Text${suffix}`;
    handleContentChange(updated);
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Docs List Sidebar */}
      <div style={{
        width: '280px',
        borderRight: '1px solid var(--border-subtle)',
        background: 'rgba(11, 16, 27, 0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={15} color="var(--color-primary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>DOCUMENTS</span>
          </div>
          <button
            onClick={onCreateDoc}
            className="btn btn-ghost"
            style={{ padding: '3px 6px', fontSize: '12px' }}
            title="Create Document"
          >
            <Plus size={15} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                background: doc.id === activeDoc?.id ? 'var(--color-primary-soft)' : 'transparent',
                border: 'none',
                color: doc.id === activeDoc?.id ? '#fff' : 'var(--text-secondary)',
                fontWeight: doc.id === activeDoc?.id ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: '2px',
              }}
            >
              <span>{doc.icon}</span>
              <span style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {doc.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Preview Main Area */}
      {activeDoc ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Document Header & Mode Toggles */}
          <div style={{
            height: '48px',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(11, 16, 27, 0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>{activeDoc.icon}</span>
              <input
                type="text"
                value={activeDoc.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#fff',
                  width: '380px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {(() => {
                const author = users.find(u => u.id === activeDoc.authorId);
                return author ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <img src={author.avatar} alt={author.name} style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                    <span>{author.name}</span>
                  </div>
                ) : null;
              })()}
              <span style={{ fontSize: '11px', color: 'var(--color-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                <span>{savedTime}</span>
              </span>

              {/* Mode Switcher */}
              <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', padding: '2px' }}>
                <button
                  onClick={() => setMode('edit')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: mode === 'edit' ? 600 : 400,
                    background: mode === 'edit' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: mode === 'edit' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Edit3 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => setMode('preview')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: mode === 'preview' ? 600 : 400,
                    background: mode === 'preview' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: mode === 'preview' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Eye size={12} />
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Quick Formatting Bar if Edit mode */}
          {mode === 'edit' && (
            <div style={{
              padding: '6px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '6px',
              background: 'rgba(7, 10, 18, 0.4)',
            }}>
              <button onClick={() => insertFormatting('## ')} className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: '11px' }}>
                H2
              </button>
              <button onClick={() => insertFormatting('### ')} className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: '11px' }}>
                H3
              </button>
              <button onClick={() => insertFormatting('- ')} className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: '11px' }}>
                Bullet
              </button>
              <button onClick={() => insertFormatting('```\n', '\n```')} className="btn btn-ghost font-mono" style={{ padding: '3px 8px', fontSize: '11px' }}>
                &lt;/&gt; Code
              </button>
              <button onClick={() => insertFormatting('> **Note**: ')} className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: '11px' }}>
                Callout
              </button>
            </div>
          )}

          {/* Editor Body or Markdown Rendered View */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
            {mode === 'edit' ? (
              <textarea
                value={activeDoc.content}
                onChange={(e) => handleContentChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
              />
            ) : (
              <div style={{ maxWidth: '780px', lineHeight: '1.7', fontSize: '14px', color: 'var(--text-primary)' }}>
                {activeDoc.content.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} style={{ fontSize: '24px', fontWeight: 800, margin: '16px 0 8px 0', color: '#fff' }}>{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={idx} style={{ fontSize: '18px', fontWeight: 700, margin: '14px 0 6px 0', color: '#fff' }}>{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={idx} style={{ marginLeft: '16px', color: 'var(--text-secondary)' }}>{line.replace('- ', '')}</li>;
                  }
                  if (line.startsWith('> ')) {
                    return (
                      <blockquote key={idx} style={{
                        borderLeft: '3px solid var(--color-primary)',
                        padding: '6px 12px',
                        background: 'var(--color-primary-soft)',
                        margin: '10px 0',
                        borderRadius: '0 6px 6px 0'
                      }}>
                        {line.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (!line.trim()) return <div key={idx} style={{ height: '8px' }} />;
                  return <p key={idx} style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>{line}</p>;
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Select or create a document to start writing.
        </div>
      )}
    </div>
  );
};
