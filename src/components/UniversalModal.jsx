import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { UserIcon } from "@heroicons/react/24/outline";

// Pass: show, onClose, onSave, fields, title (and optionally: initialValues)
export default function UniversalModal({
  show,
  onClose,
  onSave,
  fields,
  title,
  initialValues = {},
}) {
  const [form, setForm] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const sigRefs = useRef({}); // For handling multiple signature fields

  // Restore values and errors when opened
  useEffect(() => {
    if (show) {
      setForm(initialValues || {});
      setErrors({});
      // Restore signatures to canvas if value is present
      setTimeout(() => {
        fields.forEach((field) => {
          if (
            field.type === "signature" &&
            initialValues[field.id] &&
            sigRefs.current[field.id]
          ) {
            sigRefs.current[field.id].fromDataURL(initialValues[field.id]);
          }
        });
      }, 100);
    }
  }, [show, initialValues, fields]);

  if (!show) return null;

  const handleChange = (id, value) => {
    setForm((f) => ({ ...f, [id]: value }));
    setErrors((e) => ({ ...e, [id]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required) {
        // Signature: check for presence of signature
        if (field.type === "signature") {
          if (!form[field.id] || form[field.id] === "") newErrors[field.id] = "Required";
        }
        // CheckboxGroup: must have at least one selected
        else if (field.type === "checkboxGroup") {
          if (!Array.isArray(form[field.id]) || form[field.id].length === 0) newErrors[field.id] = "Required";
        }
        // Others: value must not be empty
        else if (!form[field.id] || form[field.id] === "") {
          newErrors[field.id] = "Required";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderInput = (field) => {
    const value = form[field.id] || (field.type === "checkboxGroup" ? [] : "");
    const commonProps = {
      id: field.id,
      value,
      onChange: (e) => handleChange(field.id, e.target.value),
      className: "w-full border rounded px-3 py-2 mt-1",
      placeholder: field.placeholder || "",
      ...(field.maxLength ? { maxLength: field.maxLength } : {}),
      ...(field.pattern ? { pattern: field.pattern } : {}),
    };

    switch (field.type) {
      case "number":
        return <input type="number" {...commonProps} />;
      case "currency":
        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">R</span>
            <input type="number" step="0.01" min="0" {...commonProps} />
          </div>
        );
      case "textarea":
        return <textarea rows={field.rows || 3} {...commonProps} />;
      case "date":
        return <input type="date" {...commonProps} />;
      case "email":
        return <input type="email" {...commonProps} />;
      case "radio":
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
      case "checkboxGroup":
        return (
          <div className="flex flex-col gap-1 mt-1">
            {field.options?.map((opt, idx) => (
              <label key={opt.value || `opt-${idx}`} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={Array.isArray(form[field.id]) && form[field.id].includes(opt.value)}
                  onChange={(e) => {
                    let next = Array.isArray(form[field.id]) ? [...form[field.id]] : [];
                    if (e.target.checked) next.push(opt.value);
                    else next = next.filter((v) => v !== opt.value);
                    handleChange(field.id, next);
                  }}
                  className="accent-indigo-600"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "signature":
        return (
          <div className="my-2">
            <SignatureCanvas
              penColor="black"
              canvasProps={{ width: 400, height: 100, className: "sigCanvas w-full h-24 border" }}
              ref={(ref) => (sigRefs.current[field.id] = ref)}
              onEnd={() => {
                const dataUrl = sigRefs.current[field.id]?.getTrimmedCanvas()?.toDataURL("image/png");
                handleChange(field.id, dataUrl);
              }}
            />
            <button
              type="button"
              className="mt-1 text-xs text-red-500 underline"
              onClick={() => {
                sigRefs.current[field.id]?.clear();
                handleChange(field.id, "");
              }}
            >
              Clear Signature
            </button>
          </div>
        );
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <UserIcon className="w-8 h-8 text-indigo-600" />
          <h2 className="text-xl font-bold">{title || "Add Entry"}</h2>
        </div>
        {fields.map((field, idx) => (
          <div key={field.id || `field-${idx}`} className="mb-4">
            <label className="block font-semibold text-gray-800 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.infoText && (
              <div className="text-xs text-gray-500 mb-1">{field.infoText}</div>
            )}
            {renderInput(field)}
            {errors[field.id] && (
              <div className="text-red-500 text-xs mt-1">{errors[field.id]}</div>
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              if (validate()) {
                onSave(form); // ONLY close on success
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
