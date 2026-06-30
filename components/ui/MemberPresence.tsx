import React from 'react';

export type PresenceStatus = 'online' | 'idle' | 'offline';

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  status: PresenceStatus;
}

interface MemberPresenceProps {
  member: Member;
}

export function MemberPresence({ member }: MemberPresenceProps) {
  const getStatusColor = (status: PresenceStatus) => {
    switch (status) {
      case 'online':
        return '#23a559'; // Discord Green
      case 'idle':
        return '#f0b232'; // Discord Yellow
      case 'offline':
      default:
        return '#80848e'; // Discord Gray
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      borderRadius: '8px',
      transition: 'background-color 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ position: 'relative', display: 'flex' }}>
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: 'var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {member.avatarUrl ? (
            <img 
              src={member.avatarUrl} 
              alt={member.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
              {member.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Presence Indicator */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(member.status),
          border: '3px solid var(--background)', // Gives the cutout effect
          transform: 'translate(10%, 10%)'
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <span style={{ 
          fontWeight: 600, 
          fontSize: '0.95rem', 
          color: 'var(--foreground)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {member.name}
        </span>
        <span style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {member.role}
        </span>
      </div>
    </div>
  );
}
