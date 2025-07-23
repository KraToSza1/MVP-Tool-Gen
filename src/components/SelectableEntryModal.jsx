import React, { useState, useEffect } from "react";

// Universal modal for Guardians, Executors, Trustees, Partners, etc.
// Pass storageKey="guardians", "executors", etc. for entity-specific smart fill.
export default function PersonModal({
  show,
  onClose,
  onSave,
  fields,
  title = "Add Person",
  storageKey = "people"
}) {
  const [step, setStep] = useState(0); // 0 = choose/add, 1 = new details, 2 = select existing
  const [form, setForm] = useState({});
  const [existing, setExisting] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // Load existing entries from localStorage when modal opens
  useEffect(() => {
    if (!show) return;
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
      setExisting(stored);
    } catch {
      setExisting([]);
    }
    setStep(0);
    setForm({});
    setSelectedId("");
  }, [show, storageKey]);

  if (!show) return null;

  // Save new entry if not duplicate (by all main fields)
  const saveToStorage = (person) => {
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {}
    // Check for duplicate by firstName+lastName+dateOfBirth (edit this if needed)
    const exists = stored.some(
      (g) =>
        (g.id && person.id && g.id === person.id) ||
        (
          g.firstName?.trim().toLowerCase() === (person.firstName || "").trim().toLowerCase() &&
          g.lastName?.trim().toLowerCase() === (person.lastName || "").trim().toLowerCase() &&
          g.dateOfBirth === person.dateOfBirth
        )
    );
    if (!exists) {
      const updated = [...stored, person];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setExisting(updated);
    }
  };

  // Assign an ID for new entries if not present
  const getOrCreateId = (data) =>
    data.id ||
    [
      data.firstName || "",
      data.lastName || "",
      data.dateOfBirth || "",
      Date.now()
    ].join("_");

  const handleFieldChange = (id, value) =>
    setForm((f) => ({ ...f, [id]: value }));

  // Main modal UI
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {/* Step 0: Choose to add new or pick existing */}
        {step === 0 && (
          <div className="flex flex-col gap-2 mb-4">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={() => setStep(1)}
            >
              Add a new {title.replace("Add ", "")}
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setStep(2)}
              disabled={!existing || existing.length === 0}
            >
              Select from existing
            </button>
          </div>
        )}

        {/* Step 1: Add new entry form */}
        {step === 1 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              const id = getOrCreateId(form);
              const entry = { ...form, id };
              onSave(entry);         // Pass up to parent
              saveToStorage(entry);  // Save to local storage
              setForm({});
              setStep(0);
              onClose();
            }}
          >
            {fields.map(field => (
              <div key={field.id} className="mb-2">
                <label className="block font-semibold">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={field.type === "date" ? "date" : "text"}
                  value={form[field.id] || ""}
                  onChange={e => handleFieldChange(field.id, e.target.value)}
                  className="w-full border rounded px-2 py-1"
                  placeholder={field.placeholder || ""}
                  required={!!field.required}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => { setStep(0); setForm({}); }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Select from existing */}
        {step === 2 && (
          <div>
            <select
              className="w-full border rounded px-2 py-1 mb-4"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {existing.map((g, idx) => (
                <option key={g.id || `person-${idx}`} value={g.id}>
                  {/* Customise display label below as needed */}
                  {g.firstName} {g.lastName} {g.knownAs ? `(${g.knownAs})` : ""}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={!selectedId}
                onClick={() => {
                  const selected = existing.find(g => g.id === selectedId);
                  if (selected) onSave(selected);
                  setSelectedId("");
                  setStep(0);
                  onClose();
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
