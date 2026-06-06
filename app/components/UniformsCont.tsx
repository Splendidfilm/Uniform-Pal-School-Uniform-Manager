'use client'
import { useEffect, useState } from "react";
import { Trash2, Loader2, ShirtIcon, ArrowUpDown } from "lucide-react";
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

type FilterType = "all" | "primary" | "secondary";
type SortOrder = "asc" | "desc";

const FILTERS: FilterType[] = ["all", "primary", "secondary"];

function UniformsCont() {
  const [uniforms, setUniforms] = useState<Uniform[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/uniforms")
      .then((res) => res.json())
      .then(setUniforms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = uniforms
    .filter((u) => filterType === "all" || u.schoolType === filterType)
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.school.localeCompare(b.school)
        : b.school.localeCompare(a.school)
    );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this uniform?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/uniforms/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setUniforms((prev) => prev.filter((u) => u.id !== id));
        if (selectedUniform?.id === id) setSelectedUniform(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="w-full px-4 md:px-10 py-8">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5 max-w-6xl mx-auto">
        <div className="flex bg-gray-100 rounded-full p-1 gap-1">
          {FILTERS.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filterType === type
                  ? "bg-purple-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
          className="flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
        >
          <ArrowUpDown size={13} />
          {sortOrder === "asc" ? "A–Z" : "Z–A"}
        </button>
      </div>

      {/* Count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 mb-4 max-w-6xl mx-auto">
          {filtered.length} uniform{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* States */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-gray-400 text-sm">
          <Loader2 size={20} className="animate-spin text-purple-500" />
          Loading uniforms…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <ShirtIcon size={22} className="text-gray-300" />
          </div>
          <p className="text-sm">No uniforms for this filter</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto"
        >
          <AnimatePresence>
            {filtered.map((u) => (
              <UniformCard
                key={u.id}
                uniform={u}
                deleting={deleting === u.id}
                onOpen={() => setSelectedUniform(u)}
                onDelete={() => handleDelete(u.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <UniformDetailModal
        uniform={selectedUniform}
        onClose={() => setSelectedUniform(null)}
        onDelete={handleDelete}
      />
    </section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function UniformCard({
  uniform: u,
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
      <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        {u.uniformImage ? (
          <img
            src={u.uniformImage}
            alt={u.school}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ShirtIcon size={32} className="text-gray-200" />
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-medium text-gray-800 text-sm truncate mb-0.5">{u.school}</p>
        <p className="text-xs text-gray-500 truncate mb-2.5">{u.uniformCombo}</p>
        <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full capitalize ${
          u.schoolType === "primary"
            ? "bg-purple-50 text-purple-700"
            : "bg-sky-50 text-sky-700"
        }`}>
          {u.schoolType}
        </span>

        {/* Compound / Church thumbnails */}
        {(u.compoundImage || u.churchImage) && (
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            {[
              { img: u.compoundImage, label: "Compound" },
              { img: u.churchImage, label: "Church" },
            ].map(({ img, label }) =>
              img ? (
                <div key={label} className="relative rounded-lg overflow-hidden">
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

      {/* Delete — visible on hover only */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        disabled={deleting}
        className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 border border-red-200 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Delete uniform"
      >
        {deleting
          ? <Loader2 size={13} className="animate-spin" />
          : <Trash2 size={13} />}
      </button>
    </motion.div>
  );
}

export default UniformsCont;