import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  priority: "high" | "medium" | "low";
}

const priorityStyles = {
  high: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const initialItems: SortableItemData[] = [
  { id: "1", title: "Design System Update", subtitle: "Update color tokens and typography", icon: "🎨", color: "from-violet-500 to-purple-600", priority: "high" },
  { id: "2", title: "API Integration", subtitle: "Connect payment gateway endpoints", icon: "🔌", color: "from-blue-500 to-cyan-600", priority: "high" },
  { id: "3", title: "User Testing", subtitle: "Schedule usability testing sessions", icon: "🧪", color: "from-emerald-500 to-teal-600", priority: "medium" },
  { id: "4", title: "Performance Audit", subtitle: "Analyze bundle size and load times", icon: "⚡", color: "from-amber-500 to-orange-600", priority: "medium" },
  { id: "5", title: "Documentation", subtitle: "Write API docs for new endpoints", icon: "📖", color: "from-pink-500 to-rose-600", priority: "low" },
  { id: "6", title: "Code Review", subtitle: "Review pull requests from team", icon: "🔍", color: "from-indigo-500 to-blue-600", priority: "low" },
  { id: "7", title: "Bug Fixes", subtitle: "Fix reported UI inconsistencies", icon: "🐛", color: "from-red-500 to-pink-600", priority: "high" },
  { id: "8", title: "Deploy Release", subtitle: "Push v2.1 to production", icon: "🚀", color: "from-teal-500 to-emerald-600", priority: "medium" },
];

function SortableItem({ item, isDragOverlay }: { item: SortableItemData; isDragOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={!isDragOverlay ? style : undefined}
      {...(!isDragOverlay ? attributes : {})}
      {...(!isDragOverlay ? listeners : {})}
      className={`
        group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing select-none
        ${isDragOverlay
          ? "drag-overlay bg-slate-800/95 border-brand-500/50 rounded-xl"
          : "bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20"
        }
        ${isDragging ? "z-50" : ""}
      `}
    >
      {/* Drag Handle */}
      <div className="flex flex-col gap-[2px] opacity-40 group-hover:opacity-80 transition-opacity shrink-0">
        <span className="block w-1 h-1 rounded-full bg-white" />
        <span className="block w-1 h-1 rounded-full bg-white" />
        <span className="block w-1 h-1 rounded-full bg-white" />
        <span className="block w-1 h-1 rounded-full bg-white" />
        <span className="block w-1 h-1 rounded-full bg-white" />
        <span className="block w-1 h-1 rounded-full bg-white" />
      </div>

      {/* Icon */}
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-base sm:text-lg shrink-0 shadow-lg`}>
        {item.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base text-white truncate">{item.title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 truncate">{item.subtitle}</p>
      </div>

      {/* Priority Badge */}
      <span className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full border font-medium shrink-0 ${priorityStyles[item.priority]}`}>
        {item.priority}
      </span>

      {/* Order Number */}
      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs text-slate-500 font-mono shrink-0">
        #
      </span>
    </div>
  );
}

export function SortableListDemo() {
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
            ↕
          </span>
          Drag items to reorder the list
        </div>
        <button
          onClick={() => setItems(initialItems)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-400 hover:text-white transition-all self-start"
        >
          ↺ Reset
        </button>
      </div>

      {/* Sortable List */}
      <div className="max-w-2xl">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="w-5 text-right text-xs text-slate-600 font-mono shrink-0">{index + 1}</span>
                  <div className="flex-1">
                    <SortableItem item={item} />
                  </div>
                </div>
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
          }}>
            {activeItem ? <SortableItem item={activeItem} isDragOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
