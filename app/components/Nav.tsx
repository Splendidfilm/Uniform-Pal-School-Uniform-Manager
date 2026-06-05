'use client'
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AddUniformModal from "./AddUniformModal";
import SearchModal from "./SearchModal";

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);

    const handleScroll =(id: string) =>{
      const section = document.getElementById(id)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center">
    <div>
        <h1 className='text-3xl font-bold text-center my-4 text-purple-500 w-1/3'>UniformPal</h1>
    </div>
        </div>

        {/* Links + CTA (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <a
          onClick={() => handleScroll("home")}
            href="#home"
            className="text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200"
          >
            Home
          </a>
          <a
          onClick={() => handleScroll("uniforms")}
            href="#uniforms"
            className="text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200"
          >
            Uniforms
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all active:scale-95 opacity-95"
          >
            Add Uniform
          </button>
          <button
            onClick={() => setSearchModalOpen(true)}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all active:scale-95 opacity-95"
          >
            Search
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <a
          onClick={() => handleScroll("home")}
              href="#home"
              className="block text-gray-700 font-medium hover:text-purple-600 transition-all active:scale-95 opacity-95"
            >
              Home
            </a>
            <a
          onClick={() => handleScroll("uniforms")}
              href="#uniforms"
              className="block text-gray-700 font-medium hover:text-purple-600 transition-all active:scale-95 opacity-95"
            >
              Uniforms
            </a>
            <div className="pt-4 border-t border-gray-200 space-y-2 transition-all">
              <button
                onClick={() => { setAddModalOpen(true)}}
                className="w-full px-4 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all active:scale-95 opacity-95"
              >
                Add Uniform
              </button>
              <button
                onClick={() => {setSearchModalOpen(true)}}
                className="w-full px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all active:scale-95 opacity-95"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      <AddUniformModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </nav>
  );
}

export default Nav;

