import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function LeadDashboard() {
  return (
    <div className="kz-dashboard-grid">
      {/* Left Column: Stats & HR Workflow Inbox */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Command Center Stats */}
        <div className="kz-stats" style={{ justifyContent: 'flex-start', padding: '0', gap: '1.5rem' }}>
          {[
            { num: '3', label: 'Pending Approvals' },
            { num: 'W7', label: 'Active Sprint' },
            { num: '#12', label: 'Network Rank' },
          ].map((s) => (
            <div key={s.label} className="kz-step" style={{ flex: '0 1 180px', padding: '1.25rem 1.5rem' }}>
              <div className="kz-stat-num" style={{ fontSize: '1.6rem' }}>{s.num}</div>
              <div className="kz-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* HR Workflow / Action Required Inbox */}
        <div className="kz-step" style={{ padding: '2rem' }}>
          <div className="kz-step-num" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Action Required</div>
          <h3 style={{ marginBottom: '0.6rem', color: 'var(--foreground)' }}>HR & Operations Inbox</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Approve team standups, issue digital credentials, and manage role promotions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Inbox Item: Standup / Attendance */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>Missed Standup: Mike Johnson</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Yesterday, 09:00 AM</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Exempt</Button>
                <Button style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Warn</Button>
              </div>
            </div>

            {/* Inbox Item: Promotion / Credential */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>Promotion Request: Sarah Chen</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Backend Dev → Backend Lead</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Deny</Button>
                <Button style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#23a559' }}>Approve & Issue Credential</Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column: Network Pulse & Team Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Team Roster */}
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
            Team Roster
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--border)', padding: '2px 8px', borderRadius: '12px', color: 'var(--text-muted)' }}>
              3 Active
            </span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {/* Member 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--surface2)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Sarah Chen" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--foreground)' }}>Sarah Chen</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backend Lead</p>
                </div>
              </div>
              <Link href="/verify/kz-sarah-chen" target="_blank" className="kz-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                View Credential ↗
              </Link>
            </div>

            {/* Member 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--surface2)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="Mike Johnson" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--foreground)' }}>Mike Johnson</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Designer</p>
                </div>
              </div>
              <Link href="/verify/kz-mike-johnson" target="_blank" className="kz-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                View Credential ↗
              </Link>
            </div>
            
            {/* Member 3 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--surface2)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                  JD
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--foreground)' }}>John Doe</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frontend Dev</p>
                </div>
              </div>
              <Link href="/verify/kz-john-doe" target="_blank" className="kz-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                View Credential ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Ecosystem Pulse */}
        <div className="kz-step" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            color: 'var(--foreground)',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem'
          }}>
            Ecosystem Pulse
          </h3>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Discover trending startups and benchmark your velocity against the network.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'var(--surface2)', borderRadius: '6px' }}>
              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>1. Nexus UI</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>142 Tasks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'var(--surface2)', borderRadius: '6px' }}>
              <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>2. Acme Corp</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>128 Tasks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'var(--surface2)', borderRadius: '6px', border: '1px dashed var(--accent)' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent)' }}>12. Your Startup</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>45 Tasks</span>
            </div>
          </div>

          <Link href="/cities" className="kz-btn kz-btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', padding: '0.6rem' }}>
            Browse Network Directory →
          </Link>
        </div>
      </div>
    </div>
  );
}
