import { useState, useCallback, useRef } from "react";

interface DroppedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(type: string): string {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type.includes("pdf")) return "📕";
  if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return "📦";
  if (type.includes("json") || type.includes("javascript") || type.includes("typescript")) return "⚡";
  if (type.includes("text") || type.includes("document") || type.includes("word")) return "📄";
  if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) return "📊";
  if (type.includes("presentation") || type.includes("powerpoint")) return "📑";
  return "📎";
}

function getTypeColor(type: string): string {
  if (type.startsWith("image/")) return "from-pink-500 to-rose-600";
  if (type.startsWith("video/")) return "from-purple-500 to-indigo-600";
  if (type.startsWith("audio/")) return "from-amber-500 to-orange-600";
  if (type.includes("pdf")) return "from-red-500 to-pink-600";
  if (type.includes("zip") || type.includes("rar")) return "from-amber-500 to-yellow-600";
  if (type.includes("json") || type.includes("javascript")) return "from-yellow-500 to-amber-600";
  return "from-blue-500 to-cyan-600";
}

export function FileDropDemo() {
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: DroppedFile[] = Array.from(fileList).map((f, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      lastModified: f.lastModified,
    }));

    const newIds = newFiles.map((f) => f.id);
    setFiles((prev) => [...newFiles, ...prev]);
    setRecentlyAdded(newIds);

    setTimeout(() => {
      setRecentlyAdded((prev) => prev.filter((id) => !newIds.includes(id)));
    }, 800);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounterRef.current = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            ↓
          </span>
          Drop files from your desktop onto the zone below
        </div>
        {files.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-sm text-rose-400 hover:text-rose-300 transition-all self-start"
          >
            ✕ Clear All
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div className="max-w-3xl">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            file-drop-zone relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer
            ${isDragOver
              ? "border-brand-400 bg-brand-500/10 scale-[1.02]"
              : "border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.05]"
            }
          `}
        >
          {isDragOver && (
            <>
              <div className="absolute inset-0 rounded-2xl bg-brand-500/5 animate-pulse-ring pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl border-2 border-brand-400/50 pointer-events-none" />
            </>
          )}

          <div className={`transition-transform duration-300 ${isDragOver ? "scale-110" : ""}`}>
            <div className="text-5xl sm:text-6xl mb-4">
              {isDragOver ? "📥" : "📁"}
            </div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors ${isDragOver ? "text-brand-400" : "text-white"}`}>
              {isDragOver ? "Drop files here!" : "Drag & Drop Files"}
            </h3>
            <p className="text-sm text-slate-400">
              or <span className="text-brand-400 underline underline-offset-2">browse</span> to select files
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Any file type supported • Multiple files OK
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Stats */}
        {files.length > 0 && (
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span>{files.length} file{files.length !== 1 ? "s" : ""}</span>
            <span>•</span>
            <span>Total: {formatFileSize(totalSize)}</span>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={file.id}
                className={`
                  flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group transition-all duration-500
                  ${recentlyAdded.includes(file.id) ? "animate-fade-in-up" : ""}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getTypeColor(file.type)} flex items-center justify-center text-base shrink-0 shadow-lg`}>
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-white truncate">{file.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500 truncate">{file.type}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
