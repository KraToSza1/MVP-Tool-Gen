import React, { useState, useEffect } from 'react';

export default function UniversalModal({ show, onClose, onSave, fields, title }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setForm({});
      setErrors({});
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (id, value) => {
    setForm((f) => ({ ...f, [id]: value }));
    setErrors((e) => ({ ...e, [id]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !form[field.id]) {
        newErrors[field.id] = 'Required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderInput = (field) => {
    const value = form[field.id] || '';
    const commonProps = {
      id: field.id,
      value,
      onChange: (e) => handleChange(field.id, e.target.value),
      className: 'w-full border rounded px-3 py-2 mt-1',
      placeholder: field.placeholder || '',
    };

    switch (field.type) {
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'textarea':
        return <textarea rows="3" {...commonProps} />;
      case 'date':
        return <input type="date" {...commonProps} />;
      case 'radio':
        return (
          <div className="flex flex-col gap-1 mt-1">
            {field.options?.map((opt, idx) => (
              <label key={opt.value || `opt-${idx}`} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={form[field.id] === opt.value}
                  onChange={() => handleChange(field.id, opt.value)}
                  className="accent-indigo-600"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title || 'Add Entry'}</h2>
        {fields.map((field, idx) => (
          <div key={field.id || `field-${idx}`} className="mb-4">
            <label className="block font-semibold text-gray-800 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderInput(field)}
            {errors[field.id] && (
              <div className="text-red-500 text-xs mt-1">{errors[field.id]}</div>
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button
            onClick={() => {
              if (validate()) {
                onSave(form);
                onClose();
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}