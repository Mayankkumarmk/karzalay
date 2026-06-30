'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/Card';
import { TicketModal, Ticket } from './TicketModal';
import { Skeleton } from '@/components/ui/Skeleton';

// --- Types ---
type ColumnId = 'not_started' | 'in_progress' | 'in_review' | 'done';

interface ColumnType {
  id: ColumnId;
  title: string;
  color: string;
}

const COLUMNS: ColumnType[] = [
  { id: 'not_started', title: 'Not Started', color: 'var(--text-muted)' },
  { id: 'in_progress', title: 'In Progress', color: 'var(--primary)' },
  { id: 'in_review', title: 'In Review', color: '#ff9800' },
  { id: 'done', title: 'Done', color: '#4caf50' },
];

// --- Droppable Column Container ---
function BoardColumn({ 
  column, 
  tickets, 
  onTicketClick, 
  onCreateClick 
}: { 
  column: ColumnType; 
  tickets: Ticket[]; 
  onTicketClick: (t: Ticket) => void;
  onCreateClick: () => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'Column', column },
  });

  return (
    <div 
      style={{ 
        flex: '0 0 340px', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'var(--surface)', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid var(--border)',
        padding: '1rem', 
        borderRadius: '12px',
        scrollSnapAlign: 'start',
        minHeight: '500px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: column.color }}>{column.title}</h3>
        <span className="kz-badge" style={{ background: column.color, color: column.id === 'not_started' ? 'var(--foreground)' : '#fff' }}>{tickets.length}</span>
      </div>

      <SortableContext 
        id={column.id}
        items={tickets.map(t => t.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '2rem' }}>
          {tickets.map((ticket) => (
            <SortableTicketCard 
              key={ticket.id} 
              ticket={ticket} 
              onClick={() => onTicketClick(ticket)} 
            />
          ))}
          
          {tickets.length === 0 && (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem 1rem', 
              border: '2px dashed var(--border)', 
              borderRadius: '8px', 
              opacity: 0.7 
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nothing here yet.</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// --- Sortable Item Component ---
function SortableTicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id, data: { type: 'Ticket', ticket } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // Completely hide original while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TicketCard ticket={ticket} onClick={onClick} />
    </div>
  );
}

// --- Presentation Card ---
function TicketCard({ ticket, onClick, isOverlay = false }: { ticket: Ticket; onClick?: () => void; isOverlay?: boolean }) {
  return (
    <Card 
      padded 
      shadow={!isOverlay} 
      onClick={(e) => {
        if (e.defaultPrevented) return;
        onClick?.();
      }}
      style={{ 
        borderLeft: `4px solid ${ticket.blocked ? 'var(--destructive)' : ticket.status === 'in_progress' ? 'var(--primary)' : ticket.status === 'in_review' ? '#ff9800' : ticket.status === 'done' ? '#4caf50' : 'gray'}`,
        boxShadow: isOverlay ? '0 12px 24px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
        transform: isOverlay ? 'rotate(2deg) scale(1.02)' : undefined,
        cursor: 'grab',
        background: 'var(--background)' // ensure card pops off column background
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {ticket.blocked ? (
           <span className="kz-badge" style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)' }}>Blocked</span>
        ) : (
          <span className="kz-badge" style={{ background: ticket.priority === 'P1' ? 'var(--primary)' : 'var(--surface)', color: ticket.priority === 'P1' ? 'var(--primary-foreground)' : 'var(--foreground)', border: ticket.priority === 'P1' ? 'none' : '1px solid var(--border)' }}>{ticket.priority}</span>
        )}
        <span className="kz-badge" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)' }}>{ticket.sprint}</span>
      </div>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>{ticket.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: ticket.assignee.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{ticket.assignee.avatar}</div>
        {ticket.assignee.name}
      </div>
    </Card>
  );
}

// --- Main Board Component ---
export function SprintBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetch('/api/tickets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const columns = useMemo(() => COLUMNS, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = tickets.find((t) => t.id === active.id);
    if (ticket) setActiveTicket(ticket);
  };

  const updateTicketStatus = async (ticketId: string, status: ColumnId) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('API failed');
    } catch (err) {
      console.error('Failed to update ticket:', err);
      fetch('/api/tickets', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setTickets(data));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTicket = active.data.current?.type === 'Ticket';
    const isOverTicket = over.data.current?.type === 'Ticket';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTicket) return;

    setTickets((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      let overIndex = prev.findIndex((t) => t.id === overId);

      const activeTicket = prev[activeIndex];

      if (isOverTicket) {
        const overTicket = prev[overIndex];
        if (activeTicket.status !== overTicket.status) {
          activeTicket.status = overTicket.status;
          updateTicketStatus(String(activeId), overTicket.status);
          return arrayMove(prev, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      }

      if (isOverColumn) {
        activeTicket.status = overId as ColumnId;
        updateTicketStatus(String(activeId), overId as ColumnId);
        return arrayMove(prev, activeIndex, prev.length);
      }

      return prev;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null);
  };

  const handleStatusChangeInModal = (id: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    updateTicketStatus(id, newStatus);
  };

  const handleCreateMockTicket = () => {
    const newTicket: Ticket = {
      id: `KZ-${Math.floor(Math.random() * 1000) + 200}`,
      title: 'New User Story',
      status: 'not_started',
      priority: 'P2',
      sprint: 'W3',
      assignee: { name: 'Unassigned', avatar: '?', color: 'var(--border)' }
    };
    setTickets(prev => [...prev, newTicket]);
    // Optionally fire a POST /api/tickets call here when backend is ready
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '2rem', flex: 1 }}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} style={{ flex: '0 0 340px', minHeight: '500px', borderRadius: '12px' }} />
        ))}
      </div>
    );
  }

  const dropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={handleCreateMockTicket} className="kz-btn kz-btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          + Create Ticket
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '2rem', scrollSnapType: 'x mandatory', flex: 1 }}>
            {columns.map((col) => (
              <BoardColumn 
                key={col.id} 
                column={col} 
                tickets={tickets.filter(t => t.status === col.id)} 
                onTicketClick={setSelectedTicket}
                onCreateClick={handleCreateMockTicket}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeTicket ? <TicketCard ticket={activeTicket} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TicketModal 
        ticket={selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
        onStatusChange={handleStatusChangeInModal} 
      />
    </>
  );
}
