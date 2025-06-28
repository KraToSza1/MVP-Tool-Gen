import React, { useState } from 'react';
import FieldRenderer from './FieldRenderer';

export default function RepeaterField({ field, value = [], onChange }) {
  const [entries, setEntries] = useState(value.length > 0 ? value : [{}]);

  const handleEntryChange = (index, updatedField) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [updatedField.id]: updatedField.value,
    };
    setEntries(updatedEntries);
    onChange(field.id, updatedEntries);
  };

  const addEntry = () => {
    const updatedEntries = [...entries, {}];
    setEntries(updatedEntries);
    onChange(field.id, updatedEntries);
  };

  const removeEntry = indexToRemove => {
    const updatedEntries = entries.filter((_, i) => i !== indexToRemove);
    setEntries(updatedEntries);
    onChange(field.id, updatedEntries);
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold mb-2">{field.label}</label>
      {entries.map((entry, index) => (
        <div key={index} className="border border-gray-300 rounded p-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field.subFields.map(subField => (
              <FieldRenderer
                key={subField.id}
                field={subField}
                value={entry[subField.id] || ''}
                onChange={val =>
                  handleEntryChange(index, {
                    id: subField.id,
                    value: val,
                  })
                }
              />
            ))}
          </div>
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(index)}
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
        Add Another
      </button>
    </div>
  );
}
