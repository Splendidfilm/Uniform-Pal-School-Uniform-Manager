'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";


function AddUniformModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [schoolType, setSchoolType] = useState<"primary" | "secondary" | "">("");
  const [school, setSchool] = useState("");
  const [uniformCombo, setUniformCombo] = useState("");
  const [compoundWear, setCompoundWear] = useState("");
  const [churchWear, setChurchWear] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [requiredMessage, setRequiredMessage] = useState<string | null>(null);

  // Image states
  const [uniformImage, setUniformImage] = useState<File | null>(null);
  const [compoundImage, setCompoundImage] = useState<File | null>(null);
  const [churchImage, setChurchImage] = useState<File | null>(null);
  const [uniformPreview, setUniformPreview] = useState<string | null>(null);
  const [compoundPreview, setCompoundPreview] = useState<string | null>(null);
  const [churchPreview, setChurchPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setChurchImage(null);
    setUniformImage(null);
    setCompoundImage(null);
    setChurchPreview(null);
    setCompoundPreview(null);
    setUniformPreview(null);
    setChurchWear("");
    setSchool("");
    setCompoundWear("");
    setSchoolType("");
    setUniformCombo("");
  };

  const showRequired = (message: string) => {
    setRequiredMessage(message);
    setTimeout(() => setRequiredMessage(null), 2500);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "uniform" | "compound" | "church"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "uniform") {
        setUniformImage(file);
        setUniformPreview(reader.result as string);
      } else if (type === "compound") {
        setCompoundImage(file);
        setCompoundPreview(reader.result as string);
      } else {
        setChurchImage(file);
        setChurchPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

const handleSave = async () => {
    // 1. Core Validation Check
    if (!school.trim() || !uniformCombo.trim()) {
      showRequired("Please fill in school name and uniform combination.");
      return;
    }

    // 2. Prepare Form Data Package
    const formData = new FormData();
    formData.append("school", school.trim());
    formData.append("schoolType", schoolType);
    formData.append("uniformCombo", uniformCombo.trim());
    formData.append("compoundWear", compoundWear.trim());
    formData.append("churchWear", churchWear.trim());

    // Append images if they exist
    if (uniformImage) formData.append("uniformImage", uniformImage);
    if (compoundImage) formData.append("compoundImage", compoundImage);
    if (churchImage) formData.append("churchImage", churchImage);

    try {
      // 3. Directly target the unified Next.js API route 
      setIsSaving(true);
      const response = await fetch("/api/uniforms", {
        method: "POST",
        body: formData, // Browser auto-sets multipart headers!
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Uniform added successfully!");
        setTimeout(() => {
          reset();
          setSuccessMessage(null);
          onClose();
        }, 1800);
      } else {
        // Updated to catch 'result.error' from our new backend contract
        setFailedMessage(result.error || "❌ Failed to add uniform.");
        setTimeout(() => setFailedMessage(null), 2500);
      }
    } catch (error) {
      console.error("Network error:", error);
      setFailedMessage("Network error. Could not add uniform.");
      setTimeout(() => setFailedMessage(null), 2500);
    } finally{
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-md  z-50  ">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-xl border border-gray-100 overflow-y-auto max-h-[90vh] p-6 md:p-10 relative py-4"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-all"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-6">
          Add New <span className="text-purple-600">Uniform</span>
        </h2>

        {/* School type toggle */}
        <div className="relative bg-gray-100 rounded-full w-72 h-12 flex items-center justify-between px-2 mx-auto mb-6">
          <motion.div
            layout
            className="absolute top-1 bottom-1 rounded-full bg-purple-500 transition-all"
            animate={{
              left:
                schoolType === "primary"
                  ? 4
                  : schoolType === "secondary"
                  ? "50%"
                  : 4,
              width: schoolType ? "48%" : "0%",
            }}
          />
          <button
            onClick={() => setSchoolType("primary")}
            className={`z-10 w-1/2 py-2 text-center font-medium transition-all ${
              schoolType === "primary" ? "text-white" : "text-gray-500"
            }`}
          >
            Primary
          </button>
          <button
            onClick={() => setSchoolType("secondary")}
            className={`z-10 w-1/2 py-2 text-center font-medium transition-all ${
              schoolType === "secondary" ? "text-white" : "text-gray-500"
            }`}
          >
            Secondary
          </button>
        </div>

        {/* Main form */}
        {schoolType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-5"
          >
            <input
              type="text"
              placeholder="School Name"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <input
              type="text"
              placeholder="Uniform Combination"
              value={uniformCombo}
              onChange={(e) => setUniformCombo(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            />

            {/* Uniform Image */}
            <label className="relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-400 transition-all p-4">
              {uniformPreview ? (
                <img
                  src={uniformPreview}
                  alt="Uniform Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-gray-400 text-sm">Upload Uniform</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "uniform")}
                className="hidden"
              />
            </label>

            {/* Secondary school fields */}
            {schoolType === "secondary" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {[
                  {
                    label: "Compound Wear",
                    value: compoundWear,
                    setter: setCompoundWear,
                    preview: compoundPreview,
                    type: "compound",
                  },
                  {
                    label: "Church Wear",
                    value: churchWear,
                    setter: setChurchWear,
                    preview: churchPreview,
                    type: "church",
                  },
                ].map(({ label, value, setter, preview, type }) => (
                  <div key={label} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder={`Enter ${label}`}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    <label className="relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-400 transition-all p-4">
                      {preview ? (
                        <img
                          src={preview}
                          alt={`${label} Preview`}
                          className="w-full h-56 object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mb-2" />
                          <span className="text-gray-400 text-sm">
                            Upload {label}
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, type as "compound" | "church")
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Save button */}
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-600 text-white px-10 py-3 rounded-full font-semibold hover:bg-purple-700 active:scale-95 transition-all"
          >
            {isSaving ? "Saving to cloud...." : "Save Uniform"}
          </button>
        </div>

        {/* Messages */}
        <>
          {successMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-10 bg-green-500 text-white px-6 py-3 rounded-full shadow-md font-medium"
            >
              {successMessage}
            </motion.div>
          )}
          {failedMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-10 bg-red-500 text-white px-6 py-3 rounded-full shadow-md font-medium"
            >
              {failedMessage}
            </motion.div>
          )}
          {requiredMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-20 bg-orange-500 text-white px-6 py-3 rounded-full shadow-md font-medium"
            >
              {requiredMessage}
            </motion.div>
          )}
        </>
      </motion.div>
    </div>
  );
}

export default AddUniformModal;
