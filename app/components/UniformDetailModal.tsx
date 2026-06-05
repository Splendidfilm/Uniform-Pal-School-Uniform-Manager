'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Loader2 } from "lucide-react";
// import { hello } from "../../../UniformPal/Frontend/src/config";


const hello = 3000

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

interface Props {
  uniform: Uniform | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const UniformDetailModal: React.FC<Props> = ({ uniform, onClose, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setDeleting(false);
  }, [uniform]);

  if (!uniform) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `${hello}/delete-uniform/${encodeURIComponent(uniform.id)}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        alert("🗑️ Uniform deleted successfully!");
        onDelete(uniform.id);
        onClose();
      } else {
        alert("❌ Failed to delete uniform.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting uniform.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        key="detail-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-all"
          >
           <X size={22} />
          </button>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-600">
              {uniform.school}
            </h2>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-full flex items-center gap-1 font-medium text-sm transition-all"
            >
              {deleting ? (
                <Loader2 className="animate-spin text-red-600" size={16} />
              ) : (
                <>
                  <Trash2 size={16} /> Delete
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-center">{uniform.uniformCombo}</p>

            {uniform.uniformImage && (
              <img
                src={`${hello}${uniform.uniformImage}`}
                alt={uniform.school}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
            )}

            {uniform.schoolType === "secondary" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {uniform.compoundWear && (
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <h4 className="font-semibold text-gray-700">Compound Wear</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {uniform.compoundWear}
                    </p>
                    {uniform.compoundImage && (
                      <img
                        src={`${hello}${uniform.compoundImage}`}
                        alt="Compound Wear"
                        className="w-full h-40 object-cover rounded-md"
                      />
                    )}
                  </div>
                )}
                {uniform.churchWear && (
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <h4 className="font-semibold text-gray-700">Church Wear</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {uniform.churchWear}
                    </p>
                    {uniform.churchImage && (
                      <img
                        src={`${hello}${uniform.churchImage}`}
                        alt="Church Wear"
                        className="w-full h-40 object-cover rounded-md"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default UniformDetailModal;
