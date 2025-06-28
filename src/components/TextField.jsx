import React from "react";

export default function TextField({ field, formValues, setFormValues }) {
  return (
    <input
      type="text"
      value={formValues[field.id] || ""}
      onChange={e =>
        setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))
      }
      placeholder={field.label}
      style={{ margin: "8px 0", padding: "4px", width: "100%" }}
    />
  );
}