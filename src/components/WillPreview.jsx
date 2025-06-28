import React, { useState } from "react";
import { renderTemplate } from "../utils/templateUtils";

export default function WillPreview({ open, onClose, allClauses, formValues }) {
  const [draftSaved, setDraftSaved] = useState(false);

  const saveDraft = () => {
    const draft = {
      data: formValues,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('willFormDraft', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000); // Hide after 2 seconds
  };

  // --- DEBUG LOGS ---
  console.log("[WillPreview] open:", open);
  console.log("[WillPreview] allClauses:", allClauses);
  console.log("[WillPreview] formValues:", formValues);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Will Preview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <pre className="whitespace-pre-wrap text-sm mb-6">
          {allClauses.map((clause, idx) => {
            const rendered = renderTemplate(clause, formValues);
            console.log(`[WillPreview] Clause #${idx}:`, clause);
            console.log(`[WillPreview] Rendered #${idx}:`, rendered);
            return (
              <div key={idx} style={{ marginBottom: 16 }}>
                {rendered}
              </div>
            );
          })}
        </pre>
        <button
          onClick={saveDraft}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded shadow transition duration-200"
          type="button"
        >
          Save Draft
        </button>
        {draftSaved && (
          <div className="mt-4 text-green-600 font-semibold">Draft saved!</div>
        )}
      </div>
    </div>
  );
}