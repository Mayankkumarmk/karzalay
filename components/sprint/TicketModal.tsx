import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Ticket = {
  id: string;
  title: string;
  description?: string;
  assignee: { name: string; avatar: string; color: string };
  priority: 'P1' | 'P2' | 'P3';
  sprint: string;
  status: 'not_started' | 'in_progress' | 'in_review' | 'done';
  blocked?: boolean;
};

interface TicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: Ticket['status']) => void;
}

export function TicketModal({ ticket, onClose, onStatusChange }: TicketModalProps) {
  useEffect(() => {
    if (ticket) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [ticket]);

  if (!ticket) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            background: 'var(--background)',
            width: '100%',
            maxWidth: '900px',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{ticket.id}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="kz-btn" style={{ padding: '0.5rem', background: 'transparent', border: 'none' }}>
                Share
              </button>
              <button 
                onClick={onClose}
                className="kz-btn" 
                style={{ padding: '0.5rem', background: 'transparent', border: 'none', fontSize: '1.25rem', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
          </div>

          {/* 2-Column Layout */}
          <div style={{ display: 'flex', flex: 1, overflowY: 'auto' }}>
            
            {/* Left Column (Main Content) */}
            <div style={{ flex: 1, padding: '2rem', borderRight: '1px solid var(--border)' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '2rem' }}>
                {ticket.title}
              </h1>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Description</h3>
                {ticket.description ? (
                  <p style={{ color: 'var(--foreground)', lineHeight: 1.6 }}>{ticket.description}</p>
                ) : (
                  <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'text' }}>
                    Add a description...
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Subtasks</h3>
                <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No subtasks added.
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Activity</h3>
                <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '6px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No recent activity.
                </div>
              </div>
            </div>

            {/* Right Column (Metadata Sidebar) */}
            <div style={{ width: '320px', padding: '2rem', background: 'var(--surface-sunken)' }}>
              
              <div style={{ marginBottom: '2rem' }}>
                <select 
                  className="kz-input" 
                  value={ticket.status}
                  onChange={(e) => onStatusChange?.(ticket.id, e.target.value as any)}
                  style={{ 
                    fontWeight: 600, 
                    background: ticket.status === 'in_progress' ? 'var(--primary)' : 
                               ticket.status === 'in_review' ? '#ff9800' : 
                               ticket.status === 'done' ? '#4caf50' : 'var(--surface)',
                    color: ticket.status === 'not_started' ? 'var(--foreground)' : '#fff',
                    borderColor: 'transparent',
                    textTransform: 'uppercase',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="not_started">NOT STARTED</option>
                  <option value="in_progress">IN PROGRESS</option>
                  <option value="in_review">IN REVIEW</option>
                  <option value="done">DONE</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Assignee</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }} className="hover:bg-surface">
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: ticket.assignee.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                      {ticket.assignee.avatar}
                    </div>
                    <span style={{ color: 'var(--foreground)' }}>{ticket.assignee.name}</span>
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Priority</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="kz-badge" style={{ background: ticket.priority === 'P1' ? 'var(--primary)' : 'var(--surface)', color: ticket.priority === 'P1' ? 'var(--primary-foreground)' : 'var(--foreground)' }}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Sprint</div>
                  <div style={{ color: 'var(--foreground)' }}>{ticket.sprint}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Reporter</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#607d8b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                      S
                    </div>
                    <span style={{ color: 'var(--foreground)' }}>System Admin</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
