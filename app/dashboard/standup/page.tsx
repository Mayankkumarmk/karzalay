'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import { StandupForm } from '@/components/standup/StandupForm';
import { Skeleton } from '@/components/ui/Skeleton';

export default function StandupPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        <div style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
          <Skeleton style={{ width: '120px', height: '24px' }} />
        </div>
        <main style={{ flex: 1, padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <Skeleton style={{ width: '100%', height: '500px', borderRadius: '12px' }} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        <div style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '2rem' }}>
          <a href="/dashboard" style={{ fontWeight: 700, color: 'var(--foreground)', textDecoration: 'none' }}>Karzalay</a>
        </div>
        <main style={{ flex: 1, padding: '4rem 1.5rem' }}>
          <StandupForm />
        </main>
      </div>
    </OnboardingGuard>
  );
}
