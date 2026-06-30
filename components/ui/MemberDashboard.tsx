import React from 'react';
import Link from 'next/link';
import { MemberPresence, Member } from '@/components/ui/MemberPresence';

const mockMembers: Member[] = [
  { id: '1', name: 'Alex Rivera', role: 'Frontend Lead', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', status: 'online' },
  { id: '2', name: 'Sarah Chen', role: 'Backend Dev', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'idle' },
  { id: '3', name: 'Mike Johnson', role: 'Designer', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d', status: 'offline' },
  { id: '4', name: 'You', role: 'Member', avatarUrl: '', status: 'online' },
];

export function MemberDashboard() {
  return (
    <div className="kz-dashboard-grid">
      {/* Left Column: Stats & Primary Actions */}
      <div>
        {/* Stats row */}
        <div className="kz-stats" style={{ justifyContent: 'flex-start', padding: '0', marginBottom: '2.5rem', gap: '1.5rem' }}>
          {[
            { num: 'W7', label: 'Current Sprint' },
            { num: '0', label: 'Tasks Shipped' },
            { num: '4', label: 'Team Members' },
          ].map((s) => (
            <div key={s.label} className="kz-step" style={{ flex: '0 1 180px', padding: '1.25rem 1.5rem' }}>
              <div className="kz-stat-num" style={{ fontSize: '1.6rem' }}>{s.num}</div>
              <div className="kz-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Protected content card */}
        <div className="kz-step" style={{ padding: '2rem' }}>
          <div className="kz-step-num">Protected Route ✓</div>
          <h3 style={{ marginBottom: '0.6rem', color: 'var(--foreground)' }}>You&apos;re authenticated</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            This page is guarded by the route middleware. Anyone without a valid session is redirected to /login before any content renders — no flash.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/dashboard/sprint" className="kz-btn kz-btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}>
              View Active Sprint →
            </Link>
            <Link href="/dashboard/standup" className="kz-btn kz-btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem', background: '#ff9800', color: '#fff', border: 'none' }}>
              Submit Standup →
            </Link>
            <Link href="/cities" className="kz-btn" style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem', border: '1px solid var(--border)', background: 'transparent' }}>
              Browse Companies
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Team Presence */}
      <div className="kz-step" style={{ padding: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: 700, 
          color: 'var(--foreground)',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Team Members
          <span style={{ 
            fontSize: '0.75rem', 
            backgroundColor: 'var(--border)', 
            padding: '2px 8px', 
            borderRadius: '12px',
            color: 'var(--text-muted)'
          }}>
            {mockMembers.filter(m => m.status === 'online').length} Online
          </span>
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Online & Idle Members */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px' }}>
              Online — {mockMembers.filter(m => m.status !== 'offline').length}
            </div>
            {mockMembers.filter(m => m.status !== 'offline').map(member => (
              <MemberPresence key={member.id} member={member} />
            ))}
          </div>

          {/* Offline Members */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px' }}>
              Offline — {mockMembers.filter(m => m.status === 'offline').length}
            </div>
            {mockMembers.filter(m => m.status === 'offline').map(member => (
              <div key={member.id} style={{ opacity: 0.6 }}>
                <MemberPresence member={member} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
