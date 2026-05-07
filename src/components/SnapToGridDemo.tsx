import { useState, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
  useDraggable,
} from "@dnd-kit/core";

const GRID_SIZE = 80;
const GRID_COLS = 8;
const GRID_ROWS = 5;
const CONTAINER_WIDTH = GRID_COLS * GRID_SIZE;
const CONTAINER_HEIGHT = GRID_ROWS * GRID_SIZE;

interface GridItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  gridX: number;
  gridY: number;
}

const initialItems: GridItem[] = [
  { id: "g1", label: "Header", icon: "🏠", color: "from-violet-500 to-purple-600", gridX: 0, gridY: 0 },
  { id: "g2", label: "Nav", icon: "🧭", color: "from-blue-500 to-cyan-600", gridX: 1, gridY: 0 },
  { id: "g3", label: "Hero", icon: "🌟", color: "from-amber-500 to-orange-600", gridX: 2, gridY: 0 },
  { id: "g4", label: "Sidebar", icon: "📋", color: "from-emerald-500 to-teal-600", gridX: 0, gridY: 1 },
  { id: "g5", label: "Content", icon: "📝", color: "from-pink-500 to-rose-600", gridX: 1, gridY: 1 },
  { id: "g6", label: "Widget", icon: "📊", color: "from-indigo-500 to-blue-600", gridX: 2, gridY: 1 },
  { id: "g7", label: "Gallery", icon: "🖼️", color: "from-red-500 to-pink-600", gridX: 3, gridY: 1 },
  { id: "g8", label: "Footer", icon: "🦶", color: "from-teal-500 to-emerald-600", gridX: 0, gridY: 3 },
  { id: "g9", label: "CTA", icon: "📢", color: "from-orange-500 to-red-600", gridX: 3, gridY: 2 },
  { id: "g10", label: "Form", icon: "📝", color: "from-cyan-500 to-blue-600", gridX: 4, gridY: 2 },
];

function DraggableGridItem({ item, isSnapping }: { item: GridItem; isSnapping: string | null }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

  const isThisSnapping = isSnapping === item.id;

  const style: React.CSSProperties = {
    position: "absolute",
    left: item.gridX * GRID_SIZE,
    top: item.gridY * GRID_SIZE,
    width: GRID_SIZE - 4,
    height: GRID_SIZE - 4,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: isDragging ? "none" : isThisSnapping
      ? "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      : "box-shadow 0.2s ease, border-color 0.2s ease",
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        rounded-xl border-2 flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing select-none
        ${isDragging
          ? "border-brand-400 shadow-2xl shadow-brand-500/40 bg-slate-800/95 scale-105"
          : isThisSnapping
          ? "border-emerald-400 shadow-lg shadow-emerald-500/30 bg-slate-800/80 scale-105"
          : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/[0.08]"
        }
      `}
    >
      <span className="text-lg sm:text-xl">{item.icon}</span>
      <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 text-center leading-tight">{item.label}</span>
    </div>
  );
}

export function SnapToGridDemo() {
  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [snappingId, setSnappingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const snapToGrid = useCallback((x: number, y: number) => {
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    return {
      gridX: Math.max(0, Math.min(GRID_COLS - 1, Math.round(snappedX / GRID_SIZE))),
      gridY: Math.max(0, Math.min(GRID_ROWS - 1, Math.round(snappedY / GRID_SIZE))),
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const item = items.find((i) => i.id === event.active.id);
    if (item) {
      setDragOffset({ x: item.gridX * GRID_SIZE, y: item.gridY * GRID_SIZE });
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    setDragOffset((prev) => ({
      x: prev.x + event.delta.x,
      y: prev.y + event.delta.y,
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const id = event.active.id as string;
    const item = items.find((i) => i.id === id);
    if (item) {
      const newOffset = {
        x: dragOffset.x + (event.delta.x || 0),
        y: dragOffset.y + (event.delta.y || 0),
      };
      const snapped = snapToGrid(newOffset.x, newOffset.y);

      setSnappingId(id);
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, gridX: snapped.gridX, gridY: snapped.gridY } : i
        )
      );

      setTimeout(() => setSnappingId(null), 400);
    }
    setActiveId(null);
  };

  const handleReset = () => setItems(initialItems);

  // Build grid cell occupation map
  const occupiedCells = new Set<string>();
  items.forEach((item) => {
    if (item.id !== activeId) {
      occupiedCells.add(`${item.gridX},${item.gridY}`);
    }
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-6 h-6 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400">
            ⊞
          </span>
          Drag items freely — they snap to the grid on release
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-400 hover:text-white transition-all self-start"
        >
          ↺ Reset
        </button>
      </div>

      {/* Grid Info */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-white/20 bg-white/5" /> Empty cell
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-brand-500/30 border border-brand-500/50" /> Occupied
        </span>
        <span>Grid: {GRID_COLS}×{GRID_ROWS} ({GRID_SIZE}px)</span>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div
          className="relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
          style={{
            width: CONTAINER_WIDTH,
            height: CONTAINER_HEIGHT,
            minWidth: "100%",
          }}
        >
          {/* Grid Lines */}
          {Array.from({ length: GRID_COLS }).map((_, col) =>
            Array.from({ length: GRID_ROWS }).map((_, row) => {
              const key = `${col},${row}`;
              const isOccupied = occupiedCells.has(key);
              return (
                <div
                  key={key}
                  className={`
                    absolute rounded-lg transition-all duration-300
                    ${isOccupied ? "bg-brand-500/5 border border-brand-500/20" : "border border-white/5 hover:border-white/15"}
                  `}
                  style={{
                    left: col * GRID_SIZE + 2,
                    top: row * GRID_SIZE + 2,
                    width: GRID_SIZE - 4,
                    height: GRID_SIZE - 4,
                  }}
                />
              );
            })
          )}

          {/* Grid Items */}
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            {items.map((item) => (
              <DraggableGridItem key={item.id} item={item} isSnapping={snappingId} />
            ))}
          </DndContext>
        </div>
      </div>

      {/* Item Positions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-3xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs"
          >
            <span>{item.icon}</span>
            <span className="text-slate-400 truncate">{item.label}</span>
            <span className="ml-auto text-slate-600 font-mono">
              {item.gridX},{item.gridY}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
