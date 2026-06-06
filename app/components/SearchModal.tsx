'use client'
import { useEffect, useRef, useState } from "react";
import { Search, X, Loader2, School, Trash2, Frown, ShirtIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import UniformDetailModal from "./UniformDetailModal";

interface Uniform {
  id: string;
  school: string;
  uniformCombo: string;
  uniformImage?: string;
  schoolType: "primary" | "secondary";
  compoundWear?: string;
  compoundImage?: string;
  churchWear?: string;
  churchImage?: string;
}

type SearchState = "idle" | "loading" | "results" | "empty";

function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [uniforms, setUniforms] = useState<Uniform[]>([]);
  const [results, setResults] = useState<Uniform[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/uniforms")
      .then((res) => res.json())
      .then(setUniforms)
      .catch(console.error);
    // Auto-focus the input when modal opens
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSearchState("idle");
      setSelectedUniform(null);
    }
  }, [isOpen]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchState("loading");
    const found = uniforms.filter((u) =>
      u.school.toLowerCase().includes(query.toLowerCase())
    );
    // Small delay so the loading state is visible (feels less jarring)
    setTimeout(() => {
      setResults(found);
      setSearchState(found.length > 0 ? "results" : "empty");
    }, 300);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this uniform?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/uniforms/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setUniforms((prev) => prev.filter((u) => u.id !== id));
        setResults((prev) => prev.filter((u) => u.id !== id));
        if (selectedUniform?.id === id) setSelectedUniform(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="bg-white w-full max-w-2xl rounded-2xl border border-gray-100 shadow-xl flex flex-col"
          style={{ maxHeight: "85vh" }}
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-0.5">Find a school uniform</h2>
                <p className="text-xs text-gray-400">Search by school name</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Search bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g. St. Joseph's Academy"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full h-10 pl-9 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-all active:scale-95 flex-shrink-0"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Results area */}
          <div className="flex-1 overflow-y-auto p-5">
            {searchState === "idle" && (
              <EmptyState icon={<School size={22} />} message="Type a school name to begin" />
            )}

            {searchState === "loading" && (
              <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
                <Loader2 size={18} className="animate-spin text-purple-500" />
                Searching…
              </div>
            )}

            {searchState === "empty" && (
              <EmptyState icon={<Frown size={22} />} message={`No uniforms found for "${query}"`} />
            )}

            {searchState === "results" && (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {results.map((r) => (
                      <UniformCard
                        key={r.id}
                        uniform={r}
                        deleting={deleting === r.id}
                        onOpen={() => setSelectedUniform(r)}
                        onDelete={() => handleDelete(r.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Detail modal */}
        <UniformDetailModal
          uniform={selectedUniform}
          onClose={() => setSelectedUniform(null)}
          onDelete={handleDelete}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
      <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function UniformCard({
  uniform: r,
  deleting,
  onOpen,
  onDelete,
}: {
  uniform: Uniform;
  deleting: boolean;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onOpen}
      className="relative bg-white rounded-2xl border border-gray-100 hover:border-purple-300 overflow-hidden cursor-pointer group transition-all"
    >
      {/* Image */}
      <div className="w-full h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
        {r.uniformImage ? (
          <img
            src={r.uniformImage}
            alt={r.school}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ShirtIcon size={28} className="text-gray-300" />
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-medium text-gray-800 text-sm truncate mb-0.5">{r.school}</p>
        <p className="text-xs text-gray-500 truncate mb-2">{r.uniformCombo}</p>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
          r.schoolType === "primary"
            ? "bg-purple-50 text-purple-700"
            : "bg-sky-50 text-sky-700"
        }`}>
          {r.schoolType}
        </span>

        {/* Compound / Church thumbnails */}
        {(r.compoundImage || r.churchImage) && (
          <div className="grid grid-cols-2 gap-1.5 mt-2.5">
            {[
              { img: r.compoundImage, label: "Compound" },
              { img: r.churchImage, label: "Church" },
            ].map(({ img, label }) =>
              img ? (
                <div key={label} className="relative rounded-md overflow-hidden">
                  <img src={img} alt={label} className="w-full h-12 object-cover" />
                  <span className="absolute bottom-0 inset-x-0 text-[9px] text-white bg-black/40 text-center py-0.5">
                    {label}
                  </span>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Delete button — only visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        disabled={deleting}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 border border-red-200 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Delete uniform"
      >
        {deleting
          ? <Loader2 size={13} className="animate-spin" />
          : <Trash2 size={13} />
        }
      </button>
    </motion.div>
  );
}

export default SearchModal;