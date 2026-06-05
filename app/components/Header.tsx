'use client'
import { useState } from "react";
import AddUniformModal from "./AddUniformModal";
import SearchModal from "./SearchModal";

function Header() {
  const [isAddModalOpen, setAddModalOpen] = useState(true);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  return (
  <header className="relative mt-20 flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-16 py-12 bg-gradient-to-br from-purple-50 to-white shadow-sm rounded-2xl mb-10">

      {/* Add & Search Modals */}
      <AddUniformModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      /> 
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Text Section */}
      <div className="flex flex-col items-start justify-center w-full md:w-1/2 space-y-5 text-center md:text-left">
        <div>
          <h2 className="text-lg md:text-xl text-gray-500 font-medium">
            Professional & Reliable
          </h2>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Uniforms <span className="text-purple-600">Made For You</span>
          </h1>
          <p className="text-gray-600 mt-3 text-sm md:text-base">
            Simplify your uniform selection — add, manage, and find the perfect
            school combinations instantly.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:opacity-90 hover:shadow-lg active:scale-95 transition-all"
          >
            Add Uniform
          </button>

          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-gray-300 text-gray-800 font-semibold hover:bg-gray-100 active:scale-95 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
        <img
          src="/images/header-image2.png"
          alt="uniform display"
          className="rounded-2xl shadow-lg object-cover md:h-[420px] h-[300px] w-full md:w-[90%] hover:scale-[1.02] transition-transform"
        />
      </div>
    </header>
  );
}

export default Header;
