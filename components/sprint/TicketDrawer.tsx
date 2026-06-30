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

interface TicketDrawerProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export function TicketDrawer({ ticket, onClose }: TicketDrawerProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (ticket) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [ticket]);

  return (
    <AnimatePresence>
      {ticket && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
              zIndex: 999
            }}
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '480px',
              background: 'var(--background)',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.1)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="kz-badge" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>{ticket.id}</span>
                <span className="kz-badge" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>{ticket.priority}</span>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem' }}
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--foreground)' }}>
                {ticket.title}
              </h2>

              {/* Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
                <div style={{ color: 'var(--text-muted)' }}>Status</div>
                <div>
                  <span className="kz-badge" style={{ 
                    background: ticket.status === 'in_progress' ? 'var(--primary)' : 
                               ticket.status === 'in_review' ? '#ff9800' : 
                               ticket.status === 'done' ? '#4caf50' : 'var(--border)',
                    color: ticket.status === 'not_started' ? 'var(--foreground)' : '#fff'
                  }}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div style={{ color: 'var(--text-muted)' }}>Assignee</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: ticket.assignee.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                    {ticket.assignee.avatar}
                  </div>
                  {ticket.assignee.name}
                </div>

                <div style={{ color: 'var(--text-muted)' }}>Sprint</div>
                <div style={{ color: 'var(--foreground)' }}>{ticket.sprint}</div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground)' }}>Description</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {ticket.description || "No description provided."}
                </p>
              </div>

              {/* Activity / Mock Comments */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--foreground)' }}>Activity</h3>
                <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border)', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>
                  No recent activity on this ticket.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
