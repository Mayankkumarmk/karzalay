'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import { Skeleton } from '@/components/ui/Skeleton';
import { MemberDashboard } from '@/components/ui/MemberDashboard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role?.toUpperCase() === 'LEAD') {
        router.push('/dashboard/lead');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role?.toUpperCase() === 'LEAD') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
          <Skeleton style={{ width: '120px', height: '24px' }} />
        </div>
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
          <Skeleton style={{ width: '30%', height: '1.5rem', marginBottom: '0.5rem' }} />
          <Skeleton style={{ width: '60%', height: '3rem', marginBottom: '1rem' }} />
          <Skeleton style={{ width: '40%', height: '1.2rem', marginBottom: '3rem' }} />
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} style={{ flex: '0 1 180px', height: '100px' }} />
            ))}
          </div>
          <Skeleton style={{ width: '100%', height: '200px' }} />
        </main>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <Navbar />

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="kz-section-tag" style={{ textAlign: 'left', marginBottom: '0.4rem' }}>Dashboard</p>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              {user?.email} · <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            </p>
          </div>

          <MemberDashboard />
          
        </main>
      </div>
    </OnboardingGuard>
  );
}
