import React, { useState } from "react";
import UniversalModal from "./UniversalModal";

export default function ArrayFieldSection({ field, values = [], setValues }) {
  const [modalOpen, setModalOpen] = useState(false);

  // The entry schema for each modal add
  const entryFields = field.subFields || field.fields;

  // Optional: track editing
  // const [editingIdx, setEditingIdx] = useState(null);

  return (
    <div className="mb-6 bg-white rounded-xl shadow p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4">{field.label || "Add Entry"}</h2>
      {(!values || values.length === 0) && (
        <div className="bg-blue-100 text-blue-900 rounded p-3 my-2 text-sm">
          {field.emptyText || `No ${field.label || "entry"} has been specified.`}
        </div>
      )}
      {values && values.map((entry, idx) => (
        <div key={entry.id || idx} className="mb-2 flex items-center flex-wrap gap-2">
          {entryFields.map(f => {
            const val = entry[f.id];
            if (val === undefined || val === "") return null;
            return (
              <span
                key={`${f.id}-${entry.id || idx}`}
                className="px-2 py-1 bg-gray-100 rounded text-gray-800 text-sm"
              >
                <b>{f.label || f.id}:</b> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
              </span>
            );
          })}
          <button
            type="button"
            className="text-red-600 text-xs px-2 py-1 rounded hover:bg-red-100 ml-2"
            onClick={() => {
              if (!setValues) return;
              const updated = values.filter((_, i) => i !== idx);
              setValues(updated);
            }}
          >
            Remove
          </button>
          {/* Optional Edit Button:
          <button
            type="button"
            className="text-indigo-600 text-xs px-2 py-1 rounded hover:bg-indigo-50 ml-1"
            onClick={() => {
              setEditingIdx(idx);
              setModalOpen(true);
            }}
          >
            Edit
          </button>
          */}
        </div>
      ))}
      <button
        type="button"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
        onClick={() => setModalOpen(true)}
      >
        Add {field.label || "Entry"}
      </button>
      <UniversalModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={entry => {
          if (!setValues) return;
          setValues([...(values || []), { ...entry, id: Date.now().toString() }]);
          setModalOpen(false);
        }}
        fields={entryFields}
        title={field.title || `Add ${field.label || "Entry"}`}
      />
    </div>
  );
}
