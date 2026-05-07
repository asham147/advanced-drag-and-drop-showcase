import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
  rectIntersection,
  UniqueIdentifier,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

interface KanbanCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  icon: string;
  cards: KanbanCard[];
}

const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    icon: "📋",
    cards: [
      { id: "c1", title: "Landing Page", description: "Design the new landing page layout", tags: ["Design", "UI"], icon: "🎨", color: "from-violet-500 to-purple-600" },
      { id: "c2", title: "Database Schema", description: "Define the database structure", tags: ["Backend"], icon: "🗃️", color: "from-blue-500 to-cyan-600" },
      { id: "c3", title: "Auth Flow", description: "Implement OAuth2 authentication", tags: ["Security"], icon: "🔐", color: "from-emerald-500 to-teal-600" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    icon: "⚡",
    cards: [
      { id: "c4", title: "Dashboard UI", description: "Build the main dashboard components", tags: ["Frontend", "UI"], icon: "📊", color: "from-amber-500 to-orange-600" },
      { id: "c5", title: "REST API", description: "Create API endpoints for users", tags: ["Backend", "API"], icon: "🔌", color: "from-pink-500 to-rose-600" },
    ],
  },
  {
    id: "review",
    title: "Review",
    icon: "🔍",
    cards: [
      { id: "c6", title: "Mobile Nav", description: "Responsive navigation component", tags: ["Mobile", "UI"], icon: "📱", color: "from-indigo-500 to-blue-600" },
    ],
  },
  {
    id: "done",
    title: "Done",
    icon: "✅",
    cards: [
      { id: "c7", title: "Project Setup", description: "Initialize repo and dependencies", tags: ["DevOps"], icon: "🏗️", color: "from-teal-500 to-emerald-600" },
      { id: "c8", title: "CI/CD Pipeline", description: "Configure GitHub Actions", tags: ["DevOps"], icon: "🚀", color: "from-cyan-500 to-blue-600" },
    ],
  },
];

function DroppableColumn({ column, children }: { column: KanbanColumn; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex-1 min-w-[220px] sm:min-w-[260px]">
      <div
        ref={setNodeRef}
        className={`
          rounded-2xl border p-2 sm:p-3 min-h-[300px] sm:min-h-[400px] transition-all duration-300
          ${isOver
            ? "bg-brand-500/10 border-brand-500/50 shadow-lg shadow-brand-500/10"
            : "bg-white/[0.03] border-white/10"
          }
        `}
      >
        <div className="flex items-center gap-2 p-2 mb-2">
          <span className="text-lg">{column.icon}</span>
          <h3 className="font-semibold text-sm sm:text-base text-white">{column.title}</h3>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
            {column.cards.length}
          </span>
        </div>
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function KanbanCardComponent({ card, isOverlay }: { card: KanbanCard; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: card.id });

  const style = !isOverlay ? {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.3 : 1,
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  } : {};

  return (
    <div
      ref={!isOverlay ? setNodeRef : undefined}
      style={style}
      {...(!isOverlay ? attributes : {})}
      {...(!isOverlay ? listeners : {})}
      className={`
        kanban-card p-2.5 sm:p-3 rounded-xl border cursor-grab active:cursor-grabbing select-none
        ${isOverlay
          ? "drag-overlay bg-slate-800/95 border-brand-500/50"
          : "bg-white/5 border-white/10 hover:border-white/20"
        }
      `}
    >
      <div className="flex items-start gap-2 sm:gap-2.5">
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-xs sm:text-sm shrink-0`}>
          {card.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-xs sm:text-sm text-white">{card.title}</h4>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-2">{card.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function findCard(columns: KanbanColumn[], id: UniqueIdentifier): { card: KanbanCard; columnId: string } | null {
  for (const col of columns) {
    const card = col.cards.find((c) => c.id === id);
    if (card) return { card, columnId: col.id };
  }
  return null;
}

export function KanbanBoardDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const collisionDetectionStrategy = (args: Parameters<typeof pointerWithin>[0]) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    return rectIntersection(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = findCard(columns, active.id);
    const overId = over.id;

    let targetColumnId: string | null = null;
    for (const col of columns) {
      if (col.id === overId) {
        targetColumnId = col.id;
        break;
      }
      if (col.cards.some((c) => c.id === overId)) {
        targetColumnId = col.id;
        break;
      }
    }

    if (!activeData || !targetColumnId || activeData.columnId === targetColumnId) return;

    setColumns((prev) => {
      const newCols = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const sourceCol = newCols.find((c) => c.id === activeData.columnId);
      const targetCol = newCols.find((c) => c.id === targetColumnId);
      if (!sourceCol || !targetCol) return prev;

      const cardIdx = sourceCol.cards.findIndex((c) => c.id === active.id);
      const [card] = sourceCol.cards.splice(cardIdx, 1);

      const overCard = targetCol.cards.find((c) => c.id === overId);
      const insertIdx = overCard
        ? targetCol.cards.indexOf(overCard)
        : targetCol.cards.length;

      targetCol.cards.splice(insertIdx, 0, card);
      return newCols;
    });
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveId(null);
  };

  const activeCard = activeId ? findCard(columns, activeId)?.card : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
            ↔
          </span>
          Drag cards between columns to organize tasks
        </div>
        <button
          onClick={() => setColumns(initialColumns)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-400 hover:text-white transition-all self-start"
        >
          ↺ Reset
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          {columns.map((column) => (
            <DroppableColumn key={column.id} column={column}>
              {column.cards.map((card) => (
                <KanbanCardComponent key={card.id} card={card} />
              ))}
              {column.cards.length === 0 && (
                <div className="flex items-center justify-center py-8 text-slate-600 text-sm border border-dashed border-white/10 rounded-xl">
                  Drop cards here
                </div>
              )}
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 250,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
        }}>
          {activeCard ? <KanbanCardComponent card={activeCard} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
