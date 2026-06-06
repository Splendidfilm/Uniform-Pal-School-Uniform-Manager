'use client'
import { useState } from "react";
import { Menu, X, Plus, Search, Shirt } from "lucide-react";
import AddUniformModal from "./AddUniformModal";
import SearchModal from "./SearchModal";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Uniforms", id: "uniforms" },
];

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false); // close mobile menu after navigating
  };

  return (
    <>
      <AddUniformModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setSearchModalOpen(false)} />

      <nav className="fixed top-0 inset-x-0 z-40 border-b border-gray-100 bg-white/75 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-10 h-14">

          {/* Logo */}
          <a href="#home" onClick={() => handleScroll("home")} className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shirt size={14} className="text-white" />
            </div>
            <span className="text-base font-semibold text-gray-900">
              uniform<span className="text-purple-600">pal</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Search size={13} /> Search
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-purple-600 hover:bg-purple-700 text-xs font-medium text-white transition-all"
            >
              <Plus size={13} /> Add uniform
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-5 py-4">
            <div className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => handleScroll(id)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2.5 rounded-xl text-left transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="h-px bg-gray-100 mb-4" />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setSearchModalOpen(true); setMobileOpen(false); }}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Search size={15} /> Search
              </button>
              <button
                onClick={() => { setAddModalOpen(true); setMobileOpen(false); }}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 text-sm font-medium text-white transition-all"
              >
                <Plus size={15} /> Add uniform
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Nav;