'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import { SprintBoard } from '@/components/sprint/SprintBoard';

import { Skeleton } from '@/components/ui/Skeleton';

export default function SprintPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        <div style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
          <Skeleton style={{ width: '120px', height: '24px' }} />
        </div>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem 0 1.5rem', overflow: 'hidden' }}>
          <Skeleton style={{ width: '25%', height: '2.5rem', marginBottom: '0.5rem' }} />
          <Skeleton style={{ width: '15%', height: '1.2rem', marginBottom: '2rem' }} />
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '2rem', flex: 1 }}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} style={{ flex: '0 0 340px', minHeight: '500px', borderRadius: '12px' }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        {/* Navbar is strictly the header, board takes remaining height to allow internal scroll */}
        <div style={{ flexShrink: 0 }}>
          <Navbar />
        </div>

        {/* Content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem 0 1.5rem', overflow: 'hidden' }}>
          
          {/* Welcome header */}
          <div style={{ marginBottom: '2rem', flexShrink: 0 }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
              Active Sprint
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Week 3 · Drag and drop to update status
            </p>
          </div>

          {/* Board Container */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <SprintBoard />
          </div>

        </main>
      </div>
    </OnboardingGuard>
  );
}
