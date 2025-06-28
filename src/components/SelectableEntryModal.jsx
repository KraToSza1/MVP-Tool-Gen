import React, { useState } from 'react';

export default function GuardianModal({ show, onClose, onSave, existingGuardians, fields, title }) {
  const [step, setStep] = useState(0); // 0 = choose/add, 1 = details, 2 = select existing
  const [form, setForm] = useState({});
  const [selectedId, setSelectedId] = useState('');

  if (!show) return null;

  const handleFieldChange = (id, value) => setForm(f => ({ ...f, [id]: value }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{title || 'Add Guardian'}</h2>
        {step === 0 && (
          <div className="flex gap-2 mb-4">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={() => setStep(1)}
            >
              Add a new Guardian
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setStep(2)}
              disabled={!existingGuardians || existingGuardians.length === 0}
            >
              Select from existing
            </button>
          </div>
        )}
        {step === 1 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              onSave(form);
              setForm({});
              setStep(0);
              onClose();
            }}
          >
            {fields.map(field => (
              <div key={field.id} className="mb-2">
                <label className="block font-semibold">{field.label}</label>
                <input
                  type="text"
                  value={form[field.id] || ''}
                  onChange={e => handleFieldChange(field.id, e.target.value)}
                  className="w-full border rounded px-2 py-1"
                  placeholder={field.placeholder || ''}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setStep(0); setForm({}); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <div>
            <select
              className="w-full border rounded px-2 py-1 mb-4"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">-- Select Guardian --</option>
              {existingGuardians.map((g, idx) => (
                <option key={g.id || `guardian-${idx}`} value={g.id}>
                  {g.firstName} {g.lastName} {g.knownAs ? `(${g.knownAs})` : ''}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setStep(0)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={!selectedId}
                onClick={() => {
                  const selected = existingGuardians.find(g => g.id === selectedId);
                  if (selected) onSave(selected);
                  setSelectedId('');
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