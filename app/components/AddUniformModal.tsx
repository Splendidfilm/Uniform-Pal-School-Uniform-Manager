'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, School } from "lucide-react";

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
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warn" } | null>(null);
  const [uniformImage, setUniformImage] = useState<File | null>(null);
  const [compoundImage, setCompoundImage] = useState<File | null>(null);
  const [churchImage, setChurchImage] = useState<File | null>(null);
  const [uniformPreview, setUniformPreview] = useState<string | null>(null);
  const [compoundPreview, setCompoundPreview] = useState<string | null>(null);
  const [churchPreview, setChurchPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string, type: "success" | "error" | "warn") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const reset = () => {
    setSchool(""); setSchoolType(""); setUniformCombo("");
    setCompoundWear(""); setChurchWear("");
    setUniformImage(null); setCompoundImage(null); setChurchImage(null);
    setUniformPreview(null); setCompoundPreview(null); setChurchPreview(null);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "uniform" | "compound" | "church"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === "uniform") { setUniformImage(file); setUniformPreview(result); }
      else if (type === "compound") { setCompoundImage(file); setCompoundPreview(result); }
      else { setChurchImage(file); setChurchPreview(result); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!school.trim() || !uniformCombo.trim()) {
      showToast("Please fill in school name and uniform combination.", "warn");
      return;
    }
    const formData = new FormData();
    formData.append("school", school.trim());
    formData.append("schoolType", schoolType);
    formData.append("uniformCombo", uniformCombo.trim());
    formData.append("compoundWear", compoundWear.trim());
    formData.append("churchWear", churchWear.trim());
    if (uniformImage) formData.append("uniformImage", uniformImage);
    if (compoundImage) formData.append("compoundImage", compoundImage);
    if (churchImage) formData.append("churchImage", churchImage);

    try {
      setIsSaving(true);
      const response = await fetch("/api/uniforms", { method: "POST", body: formData });
      const result = await response.json();
      if (response.ok) {
        showToast("Uniform added successfully!", "success");
        setTimeout(() => { reset(); onClose(); }, 1800);
      } else {
        showToast(result.error || "Failed to add uniform.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const toastColors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warn: "bg-amber-500",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] ${toastColors[toast.type]} text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white w-full max-w-xl rounded-2xl border border-gray-100 overflow-y-auto max-h-[92vh] shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-7 pb-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1.5">Add uniform</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
              <School size={12} /> New entry
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all mt-0.5"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-7 flex flex-col gap-6">

          {/* School type toggle */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">School type</p>
            <div className="flex bg-gray-100 rounded-full p-1 w-fit gap-1">
              {(["primary", "secondary"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSchoolType(type)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    schoolType === type
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Fields (only show when type selected) */}
          <AnimatePresence>
            {schoolType && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5"
              >
                {/* School name */}
                <Field label="School name">
                  <input
                    type="text"
                    placeholder="e.g. St. Joseph's Academy"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="field-input"
                  />
                </Field>

                {/* Uniform combination */}
                <Field label="Uniform combination">
                  <input
                    type="text"
                    placeholder="e.g. White shirt + navy trousers"
                    value={uniformCombo}
                    onChange={(e) => setUniformCombo(e.target.value)}
                    className="field-input"
                  />
                </Field>

                {/* Uniform image upload */}
                <Field label="Uniform photo">
                  <UploadZone
                    preview={uniformPreview}
                    label="Click to upload uniform photo"
                    onChange={(e) => handleImageUpload(e, "uniform")}
                    onClear={() => { setUniformPreview(null); setUniformImage(null); }}
                  />
                </Field>

                {/* Secondary extras */}
                {schoolType === "secondary" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="h-px bg-gray-100" />
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Additional wear</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Compound wear", value: compoundWear, set: setCompoundWear, preview: compoundPreview, type: "compound" as const, clearPreview: () => { setCompoundPreview(null); setCompoundImage(null); } },
                        { label: "Church wear", value: churchWear, set: setChurchWear, preview: churchPreview, type: "church" as const, clearPreview: () => { setChurchPreview(null); setChurchImage(null); } },
                      ].map(({ label, value, set, preview, type, clearPreview }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 border border-gray-100">
                          <p className="text-xs font-semibold text-gray-500">{label}</p>
                          <input
                            type="text"
                            placeholder="Describe combination"
                            value={value}
                            onChange={(e) => set(e.target.value)}
                            className="field-input"
                          />
                          <UploadZone
                            preview={preview}
                            label="Upload photo"
                            compact
                            onChange={(e) => handleImageUpload(e, type)}
                            onClear={clearPreview}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold text-sm tracking-wide transition-all active:scale-[0.98] mt-1"
          >
            {isSaving ? "Saving…" : "Save uniform"}
          </button>

        </div>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      {children}
    </div>
  );
}

function UploadZone({
  preview,
  label,
  compact = false,
  onChange,
  onClear,
}: {
  preview: string | null;
  label: string;
  compact?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <label className="relative block cursor-pointer group">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className={`w-full object-cover rounded-xl ${compact ? "h-40" : "h-56"}`}
          />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClear(); }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl group-hover:border-purple-400 group-hover:bg-purple-50 transition-all ${compact ? "py-5" : "py-8"}`}>
          <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-all">
            <Upload size={16} className="text-gray-400 group-hover:text-purple-500 transition-all" />
          </div>
          <span className="text-sm text-gray-400 group-hover:text-purple-500 font-medium transition-all">{label}</span>
          <span className="text-xs text-gray-300">PNG, JPG up to 10MB</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={onChange} className="hidden" />
    </label>
  );
}



export default AddUniformModal;