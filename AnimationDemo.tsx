import { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useDraggable,
} from "@dnd-kit/core";

interface AnimItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  animation: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

const animationTypes = [
  { id: "spring", label: "Spring", description: "Bouncy overshoot effect", easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
  { id: "smooth", label: "Smooth", description: "Elegant ease-in-out", easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { id: "elastic", label: "Elastic", description: "Rubber band snap-back", easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" },
  { id: "bounce", label: "Bounce", description: "Playful bounce effect", easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
  { id: "expo", label: "Expo", description: "Dramatic overshoot", easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
];

const initialItems: AnimItem[] = [
  { id: "a1", label: "Spring", icon: "🎯", color: "from-violet-500 to-purple-600", animation: "spring", x: 0, y: 0, rotation: 0, scale: 1 },
  { id: "a2", label: "Smooth", icon: "🌊", color: "from-blue-500 to-cyan-600", animation: "smooth", x: 0, y: 0, rotation: 0, scale: 1 },
  { id: "a3", label: "Elastic", icon: "🧸", color: "from-emerald-500 to-teal-600", animation: "elastic", x: 0, y: 0, rotation: 0, scale: 1 },
  { id: "a4", label: "Bounce", icon: "🏀", color: "from-amber-500 to-orange-600", animation: "bounce", x: 0, y: 0, rotation: 0, scale: 1 },
  { id: "a5", label: "Expo", icon: "🚀", color: "from-pink-500 to-rose-600", animation: "expo", x: 0, y: 0, rotation: 0, scale: 1 },
  { id: "a6", label: "Twist", icon: "🌀", color: "from-indigo-500 to-blue-600", animation: "spring", x: 0, y: 0, rotation: 0, scale: 1 },
  { id: "a7", label: "Pulse", icon: "💫", color: "from-red-500 to-pink-600", animation: "elastic", x: 0, y: 0, rotation: 0, scale: 1 },
  { id: "a8", label: "Flip", icon: "🃏", color: "from-teal-500 to-emerald-600", animation: "expo", x: 0, y: 0, rotation: 0, scale: 1 },
];

function DraggableAnimItem({ item }: { item: AnimItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

  const easing = animationTypes.find((a) => a.id === item.animation)?.easing || "ease";

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.1 : 1}) rotate(${isDragging ? 5 : 0}deg)`
      : `scale(${item.scale}) rotate(${item.rotation}deg)`,
    transition: isDragging
      ? "box-shadow 0.2s ease"
      : `all 0.6s ${easing}`,
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
        w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-2xl border-2 flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing select-none
        ${isDragging
          ? "border-brand-400 shadow-2xl shadow-brand-500/40 bg-slate-800/95"
          : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/[0.08]"
        }
      `}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-lg sm:text-xl shadow-lg`}>
        {item.icon}
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-slate-400">{item.label}</span>
    </div>
  );
}

function StaggerGrid() {
  const [items, setItems] = useState<string[]>(["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚪", "🟤", "⚫"]);
  const [visible, setVisible] = useState<boolean[]>(new Array(9).fill(true));
  const [animating, setAnimating] = useState(false);

  const staggerAnimation = useCallback(() => {
    if (animating) return;
    setAnimating(true);

    // Hide with stagger
    setVisible(new Array(9).fill(false));

    // Shuffle
    const shuffled = [...items].sort(() => Math.random() - 0.5);

    setTimeout(() => {
      setItems(shuffled);
      // Show with stagger
      setVisible(new Array(9).fill(true));
      setTimeout(() => setAnimating(false), 600);
    }, 400);
  }, [items, animating]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-300">Stagger Animation</h4>
        <button
          onClick={staggerAnimation}
          disabled={animating}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-500/20 hover:bg-accent-500/30 border border-accent-500/30 text-xs text-accent-400 hover:text-accent-300 transition-all disabled:opacity-50"
        >
          ✦ Shuffle
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-fit">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl sm:text-3xl"
            style={{
              transition: `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
              transitionDelay: visible[index] ? `${index * 60}ms` : `${(8 - index) * 40}ms`,
              transform: visible[index] ? "scale(1) rotate(0deg)" : "scale(0) rotate(180deg)",
              opacity: visible[index] ? 1 : 0,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MorphingShapes() {
  const [shape, setShape] = useState(0);
  const shapes = [
    { borderRadius: "16px", rotate: 0, scale: 1, color: "from-violet-500 to-purple-600" },
    { borderRadius: "50%", rotate: 90, scale: 0.8, color: "from-blue-500 to-cyan-600" },
    { borderRadius: "50% 0%", rotate: 180, scale: 1.1, color: "from-emerald-500 to-teal-600" },
    { borderRadius: "0% 50%", rotate: 270, scale: 0.9, color: "from-pink-500 to-rose-600" },
    { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", rotate: 360, scale: 1, color: "from-amber-500 to-orange-600" },
  ];

  const current = shapes[shape];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-300">Morph Transitions</h4>
        <button
          onClick={() => setShape((prev) => (prev + 1) % shapes.length)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/30 text-xs text-brand-400 hover:text-brand-300 transition-all"
        >
          ↻ Morph ({shape + 1}/{shapes.length})
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div
          className={`w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${current.color} shadow-2xl`}
          style={{
            borderRadius: current.borderRadius,
            transform: `rotate(${current.rotate}deg) scale(${current.scale})`,
            transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        />
        <div className="space-y-1 text-xs text-slate-500 font-mono">
          <p>border-radius: <span className="text-brand-400">{current.borderRadius}</span></p>
          <p>rotate: <span className="text-emerald-400">{current.rotate}°</span></p>
          <p>scale: <span className="text-amber-400">{current.scale}</span></p>
        </div>
      </div>
    </div>
  );
}

// Persistent wave animation
function WaveAnimationLive() {
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const frameRef = useRef<number>(0);
  const bars = 16;

  useEffect(() => {
    if (!playing) return;
    const animate = () => {
      setTick((t) => t + 1);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [playing]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-300">Wave Effect</h4>
        <button
          onClick={() => setPlaying(!playing)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
            playing
              ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
              : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
          }`}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
      <div className="flex items-end gap-[3px] h-24 px-1">
        {Array.from({ length: bars }).map((_, i) => {
          const time = tick * 0.03;
          const wave1 = Math.sin(time + (i / bars) * Math.PI * 3) * 0.4;
          const wave2 = Math.sin(time * 1.5 + (i / bars) * Math.PI * 2) * 0.2;
          const height = playing ? 30 + (wave1 + wave2 + 0.6) * 50 : 15;
          const hue = 220 + (i / bars) * 60;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: `${height}%`,
                background: `linear-gradient(to top, hsl(${hue}, 80%, 50%), hsl(${hue + 30}, 80%, 60%))`,
                transition: !playing ? "height 0.5s ease" : undefined,
                opacity: playing ? 0.7 + (i / bars) * 0.3 : 0.3,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function AnimationDemo() {
  const [items] = useState(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedEasing, setSelectedEasing] = useState("cubic-bezier(0.175, 0.885, 0.32, 1.275)");
  const [showItems, setShowItems] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveId(null);
  };

  const handleEasingChange = (easing: string) => {
    setSelectedEasing(easing);
    setShowItems(false);
    setTimeout(() => setShowItems(true), 50);
  };

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Info */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
          ✨
        </span>
        Explore different animation easings and effects
      </div>

      {/* Free-form Draggable Items */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-300">Drag & Release Animations</h4>

        {/* Easing Selector */}
        <div className="flex flex-wrap gap-2">
          {animationTypes.map((anim) => (
            <button
              key={anim.id}
              onClick={() => handleEasingChange(anim.easing)}
              className={`
                px-3 py-1.5 rounded-lg border text-xs transition-all
                ${selectedEasing === anim.easing
                  ? "bg-brand-500/20 border-brand-500/40 text-brand-400"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }
              `}
            >
              {anim.label}
            </button>
          ))}
        </div>

        {/* Draggable Grid */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 min-h-[140px]">
            {items.map((item, index) =>
              showItems ? (
                <div
                  key={item.id}
                  style={{
                    animation: `fadeInUp 0.4s ${index * 60}ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both`,
                  }}
                >
                  <DraggableAnimItem item={item} />
                </div>
              ) : (
                <div key={item.id} className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px]" />
              )
            )}
          </div>

          <DragOverlay dropAnimation={{
            duration: 400,
            easing: selectedEasing,
          }}>
            {activeItem ? (
              <div
                className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-2xl border-2 border-brand-400 shadow-2xl shadow-brand-500/40 bg-slate-800/95 flex flex-col items-center justify-center gap-1"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${activeItem.color} flex items-center justify-center text-lg sm:text-xl shadow-lg`}>
                  {activeItem.icon}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400">{activeItem.label}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Stagger Animation */}
      <StaggerGrid />

      {/* Divider */}
      <div className="border-t border-white/10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Morphing Shapes */}
        <MorphingShapes />

        {/* Wave Animation */}
        <WaveAnimationLive />
      </div>

      {/* Easing Curves Visualization */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-300">Easing Curves</h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {animationTypes.map((anim) => (
            <button
              key={anim.id}
              onClick={() => handleEasingChange(anim.easing)}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedEasing === anim.easing
                  ? "bg-brand-500/10 border-brand-500/30"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedEasing === anim.easing ? "bg-brand-400" : "bg-slate-500"
                  }`}
                  style={{
                    transition: `all 0.3s ${anim.easing}`,
                  }}
                />
              </div>
              <p className="text-xs font-medium text-white">{anim.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{anim.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
