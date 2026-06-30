'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';

export function StandupForm() {
  const [isWithinWindow, setIsWithinWindow] = useState<boolean>(true);
  const [formData, setFormData] = useState({ yesterday: '', today: '', blockers: '' });
  const [errors, setErrors] = useState({ yesterday: false, today: false, blockers: false });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadySubmittedData, setAlreadySubmittedData] = useState<any>(null);

  const [currentDateStr, setCurrentDateStr] = useState('');

  // 1. Initial Fetch & Time Window Check
  useEffect(() => {
    const checkTimeWindow = () => {
      // Secret testing bypass requested by user
      if (typeof window !== 'undefined' && localStorage.getItem('DEBUG_BYPASS_TIME') === 'true') {
        setIsWithinWindow(true);
      } else {
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: 'numeric', minute: 'numeric' });
        const parts = formatter.formatToParts(new Date());
        const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

        const timeInMinutes = hour * 60 + minute;
        const startMinutes = 9 * 60 + 30; // 9:30
        const endMinutes = 10 * 60 + 30;  // 10:30

        setIsWithinWindow(timeInMinutes >= startMinutes && timeInMinutes <= endMinutes);
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/standups');
        if (res.ok) {
          const data = await res.json();
          if (data.standup) {
            setAlreadySubmittedData(data.standup);
            setIsSubmitted(true);
          }
        }
      } catch (e) {}
      setIsLoading(false);
    };

    const dateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long', month: 'short', day: 'numeric' });
    setCurrentDateStr(dateFormatter.format(new Date()));

    checkTimeWindow();
    fetchStatus();
    const interval = setInterval(checkTimeWindow, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Validation & Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const newErrors = {
      yesterday: formData.yesterday.trim() === '',
      today: formData.today.trim() === '',
      blockers: formData.blockers.trim() === ''
    };

    setErrors(newErrors);

    if (!newErrors.yesterday && !newErrors.today && !newErrors.blockers) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/standups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
          setIsSubmitted(true);
        } else {
          setApiError(data.error || 'Failed to submit standup.');
        }
      } catch (e) {
        setApiError('A network error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 3. Loading State
  if (isLoading) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Skeleton style={{ width: '100%', height: '400px', borderRadius: '12px' }} />
      </div>
    );
  }

  // 4. Success / Already Submitted State
  if (isSubmitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--surface)', padding: '3rem 2rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }} id="standup-success">
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>
          ✓
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '1rem' }}>
          {alreadySubmittedData ? `You have already submitted your standup today.` : `Standup submitted for ${currentDateStr}`}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Your team has been updated. Have a great day!
        </p>

        {alreadySubmittedData && (
          <div style={{ textAlign: 'left', background: 'var(--background)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Yesterday</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{alreadySubmittedData.yesterday}</p>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Today</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{alreadySubmittedData.today}</p>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Blockers</h4>
            <p style={{ fontSize: '0.9rem' }}>{alreadySubmittedData.blockers}</p>
          </div>
        )}

        <Link href="/dashboard" className="kz-btn" style={{ padding: '0.75rem 2rem' }}>
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // 5. Default / Error / Blocked State
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }} id="standup-form">
      {/* Time Window Warning Banner */}
      {!isWithinWindow && (
        <div id="standup-warning" style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <span>⚠️</span> Standup window is 9:30–10:30 IST. Come back then.
        </div>
      )}

      {/* API Error Banner */}
      {apiError && (
        <div style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <span>🚨</span> {apiError}
        </div>
      )}

      <div style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Daily Standup</h1>
          <p style={{ color: 'var(--text-muted)' }}>{currentDateStr}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Field: Yesterday */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              What did you do yesterday?
            </label>
            <textarea
              className={`kz-input ${errors.yesterday ? 'error' : ''}`}
              value={formData.yesterday}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, yesterday: e.target.value }));
                if (errors.yesterday) setErrors(prev => ({ ...prev, yesterday: false }));
              }}
              style={{ width: '100%', minHeight: '100px', resize: 'vertical', borderColor: errors.yesterday ? 'var(--destructive)' : undefined }}
              placeholder="e.g. Shipped the auth pages..."
              disabled={!isWithinWindow || isSubmitting}
            />
            {errors.yesterday && <p style={{ color: 'var(--destructive)', fontSize: '0.8rem', marginTop: '0.4rem' }}>This field is required</p>}
          </div>

          {/* Field: Today */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              What are you doing today?
            </label>
            <textarea
              className={`kz-input ${errors.today ? 'error' : ''}`}
              value={formData.today}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, today: e.target.value }));
                if (errors.today) setErrors(prev => ({ ...prev, today: false }));
              }}
              style={{ width: '100%', minHeight: '100px', resize: 'vertical', borderColor: errors.today ? 'var(--destructive)' : undefined }}
              placeholder="e.g. Working on the standup form UI..."
              disabled={!isWithinWindow || isSubmitting}
            />
            {errors.today && <p style={{ color: 'var(--destructive)', fontSize: '0.8rem', marginTop: '0.4rem' }}>This field is required</p>}
          </div>

          {/* Field: Blockers */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Anything blocking you? <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Write 'None' if not)</span>
            </label>
            <textarea
              className={`kz-input ${errors.blockers ? 'error' : ''}`}
              value={formData.blockers}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, blockers: e.target.value }));
                if (errors.blockers) setErrors(prev => ({ ...prev, blockers: false }));
              }}
              style={{ width: '100%', minHeight: '80px', resize: 'vertical', borderColor: errors.blockers ? 'var(--destructive)' : undefined }}
              placeholder="None"
              disabled={!isWithinWindow || isSubmitting}
            />
            {errors.blockers && <p style={{ color: 'var(--destructive)', fontSize: '0.8rem', marginTop: '0.4rem' }}>This field is required</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="kz-btn kz-btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '1rem', opacity: (!isWithinWindow || isSubmitting) ? 0.5 : 1 }}
            disabled={!isWithinWindow || isSubmitting}
            id="standup-submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Standup'}
          </button>
        </form>
      </div>
    </div>
  );
}
