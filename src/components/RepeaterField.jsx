import React, { useState, useEffect } from 'react';
import FieldRenderer from './FieldRenderer';

export default function RepeaterField({ field, value = [], onChange }) {
  const [entries, setEntries] = useState(value && value.length ? value : [{}]);

  // Whenever parent updates value, keep in sync:
  useEffect(() => {
    setEntries(value && value.length ? value : [{}]);
  }, [value]);

  // Called when any sub-field changes
  const handleSubFieldChange = (entryIndex, subFieldId, subValue) => {
    const updatedEntries = entries.map((entry, idx) =>
      idx === entryIndex ? { ...entry, [subFieldId]: subValue } : entry
    );
    setEntries(updatedEntries);
    onChange(updatedEntries); // Pass just the array!
  };

  const addEntry = () => {
    const updatedEntries = [...entries, {}];
    setEntries(updatedEntries);
    onChange(updatedEntries);
  };

  const removeEntry = (idx) => {
    const updatedEntries = entries.filter((_, i) => i !== idx);
    setEntries(updatedEntries);
    onChange(updatedEntries);
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold mb-2">{field.label}</label>
      {entries.map((entry, entryIdx) => (
        <div key={entryIdx} className="border border-gray-300 rounded p-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field.subFields.map(subField => (
              <FieldRenderer
                key={subField.id}
                field={subField}
                formValues={entry}
                setFormValues={(changed) => {
                  // changed = { [subField.id]: value }
                  const subFieldId = Object.keys(changed)[0];
                  const subValue = changed[subFieldId];
                  handleSubFieldChange(entryIdx, subFieldId, subValue);
                }}
                parentSection={field}
              />
            ))}
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(entryIdx)}
              className="absolute top-2 right-2 text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}
<button
  type="button"
  onClick={addEntry}
  className="px-4 py-2 mt-2 bg-indigo-600 text-white rounded shadow"
>
  {field.addButtonLabel || "Add Partner"}
</button>
    </div>
  );
}