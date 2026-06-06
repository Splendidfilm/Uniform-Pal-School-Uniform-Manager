'use client'
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import AddUniformModal from "./AddUniformModal";
import SearchModal from "./SearchModal";

const STATS = [
  { value: "120+", label: "Schools listed" },
  { value: "3 types", label: "Uniform categories" },
  { value: "Fast", label: "Instant search" },
];

function Header() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <>
      <AddUniformModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setSearchModalOpen(false)} />

      <header className="flex flex-col md:flex-row items-center gap-8 w-full px-8 md:px-12 py-10 bg-white border border-gray-100 rounded-2xl mt-10 mb-8">

        {/* Text side */}
        <div className="flex flex-col gap-5 w-full md:w-1/2">

          {/* Eyebrow badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full w-fit">
            ✦ Professional & reliable
          </span>

          {/* Heading + description */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Uniforms<br />
              <span className="text-purple-600">made for you</span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Simplify uniform selection — add, manage, and find the perfect school combinations instantly.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all active:scale-95"
            >
              <Plus size={15} /> Add uniform
            </button>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all active:scale-95"
            >
              <Search size={15} /> Search
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-5 pt-1 flex-wrap">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-6 bg-gray-200" />}
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-800">{s.value}</span>
                  <span className="text-xs text-gray-400">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image side */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src="/images/header-image2.png"
              alt="Uniform display"
              className="w-full h-[280px] md:h-[360px] object-cover rounded-2xl border border-gray-100"
            />
            {/* Floating badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink" />
              <div>
                <p className="text-xs font-medium text-gray-800 leading-none mb-0.5">Always up to date</p>
                <p className="text-[10px] text-gray-400">Real-time uniform info</p>
              </div>
            </div>
          </div>
        </div>

      </header>
    </>
  );
}

export default Header;