import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import UniversalModal from './UniversalModal';

const guardianFields = [
  { id: "title", type: "text", label: "Title" },
  { id: "firstName", type: "text", label: "First Name(s)", required: true },
  { id: "middleNames", type: "text", label: "Middle Name(s)" },
  { id: "lastName", type: "text", label: "Last Name", required: true },
  { id: "knownAs", type: "text", label: "Known As" },
  { id: "alias", type: "text", label: "Alias" },
  { id: "dob", type: "date", label: "Date of Birth (dd/mm/yyyy)" },
  { id: "gender", type: "radio", label: "Gender", options: [
      { value: "Male", label: "Male" },
      { value: "Other", label: "Other" },
      { value: "Female", label: "Female" }
    ]
  },
  { id: "mobile", type: "text", label: "Mobile" },
  { id: "tel2", type: "text", label: "Tel 2." },
  { id: "email", type: "email", label: "Email" },
  { id: "occupation", type: "text", label: "Occupation" },
  { id: "address", type: "textarea", label: "Address" },
  { id: "relationship", type: "text", label: "Relationship To Aristone" }
];

const substituteGuardianFields = [
  { id: "title", type: "text", label: "Title" },
  { id: "firstName", type: "text", label: "First Name(s)", required: true },
  { id: "middleNames", type: "text", label: "Middle Name(s)" },
  { id: "lastName", type: "text", label: "Last Name", required: true },
  { id: "knownAs", type: "text", label: "Known As" },
  { id: "alias", type: "text", label: "Alias" },
  { id: "dob", type: "date", label: "Date of Birth (dd/mm/yyyy)" },
  { id: "gender", type: "radio", label: "Gender", options: [
      { value: "Male", label: "Male" },
      { value: "Other", label: "Other" },
      { value: "Female", label: "Female" }
    ]
  },
  { id: "mobile", type: "text", label: "Mobile" },
  { id: "tel2", type: "text", label: "Tel 2." },
  { id: "email", type: "email", label: "Email" },
  { id: "occupation", type: "text", label: "Occupation" },
  { id: "address", type: "textarea", label: "Address" },
  { id: "relationship", type: "text", label: "Relationship To Aristone" }
];

const executorFields = [
  { id: "title", type: "text", label: "Title" },
  { id: "firstName", type: "text", label: "First Name(s)", required: true },
  { id: "middleNames", type: "text", label: "Middle Name(s)" },
  { id: "lastName", type: "text", label: "Last Name", required: true },
  { id: "knownAs", type: "text", label: "Known As" },
  { id: "alias", type: "text", label: "Alias" },
  { id: "dob", type: "date", label: "Date of Birth (dd/mm/yyyy)" },
  { id: "gender", type: "radio", label: "Gender", options: [
      { value: "Male", label: "Male" },
      { value: "Other", label: "Other" },
      { value: "Female", label: "Female" }
    ]
  },
  { id: "mobile", type: "text", label: "Mobile" },
  { id: "tel2", type: "text", label: "Tel 2." },
  { id: "email", type: "email", label: "Email" },
  { id: "occupation", type: "text", label: "Occupation" },
  { id: "address", type: "textarea", label: "Address" },
  { id: "relationship", type: "text", label: "Relationship" }
];

const substituteExecutorFields = [
  { id: "title", type: "text", label: "Title" },
  { id: "firstName", type: "text", label: "First Name(s)", required: true },
  { id: "middleNames", type: "text", label: "Middle Name(s)" },
  { id: "lastName", type: "text", label: "Last Name", required: true },
  { id: "knownAs", type: "text", label: "Known As" },
  { id: "alias", type: "text", label: "Alias" },
  { id: "dob", type: "date", label: "Date of Birth (dd/mm/yyyy)" },
  { id: "gender", type: "radio", label: "Gender", options: [
      { value: "Male", label: "Male" },
      { value: "Other", label: "Other" },
      { value: "Female", label: "Female" }
    ]
  },
  { id: "mobile", type: "text", label: "Mobile" },
  { id: "tel2", type: "text", label: "Tel 2." },
  { id: "email", type: "email", label: "Email" },
  { id: "occupation", type: "text", label: "Occupation" },
  { id: "address", type: "textarea", label: "Address" },
  { id: "relationship", type: "text", label: "Relationship" }
];

const trusteeFields = [
  { id: "title", type: "text", label: "Title" },
  { id: "firstName", type: "text", label: "First Name(s)", required: true },
  { id: "middleNames", type: "text", label: "Middle Name(s)" },
  { id: "lastName", type: "text", label: "Last Name", required: true },
  { id: "knownAs", type: "text", label: "Known As" },
  { id: "alias", type: "text", label: "Alias" },
  { id: "dob", type: "date", label: "Date of Birth (dd/mm/yyyy)" },
  { id: "gender", type: "radio", label: "Gender", options: [
      { value: "Male", label: "Male" },
      { value: "Other", label: "Other" },
      { value: "Female", label: "Female" }
    ]
  },
  { id: "mobile", type: "text", label: "Mobile" },
  { id: "tel2", type: "text", label: "Tel 2." },
  { id: "email", type: "email", label: "Email" },
  { id: "occupation", type: "text", label: "Occupation" },
  { id: "address", type: "textarea", label: "Address" },
  { id: "relationship", type: "text", label: "Relationship" }
];

const substituteTrusteeFields = [
  { id: "title", type: "text", label: "Title" },
  { id: "firstName", type: "text", label: "First Name(s)", required: true },
  { id: "middleNames", type: "text", label: "Middle Name(s)" },
  { id: "lastName", type: "text", label: "Last Name", required: true },
  { id: "knownAs", type: "text", label: "Known As" },
  { id: "alias", type: "text", label: "Alias" },
  { id: "dob", type: "date", label: "Date of Birth (dd/mm/yyyy)" },
  { id: "gender", type: "radio", label: "Gender", options: [
      { value: "Male", label: "Male" },
      { value: "Other", label: "Other" },
      { value: "Female", label: "Female" }
    ]
  },
  { id: "mobile", type: "text", label: "Mobile" },
  { id: "tel2", type: "text", label: "Tel 2." },
  { id: "email", type: "email", label: "Email" },
  { id: "occupation", type: "text", label: "Occupation" },
  { id: "address", type: "textarea", label: "Address" },
  { id: "relationship", type: "text", label: "Relationship" }
];

// Map section id to fields and titles
const sectionConfig = {
  guardiansSection: {
    fields: guardianFields,
    title: "Add Guardian",
    label: "Guardian",
    emptyText: "No guardian has been specified."
  },
  substituteGuardiansSection: {
    fields: substituteGuardianFields,
    title: "Add Substitute Guardian",
    label: "Substitute Guardian",
    emptyText: "No substitute guardian has been specified."
  },
  executorsSection: {
    fields: executorFields,
    title: "Add Executor",
    label: "Executor",
    emptyText: "No executor has been specified."
  },
  substituteExecutorsSection: {
    fields: substituteExecutorFields,
    title: "Add Substitute Executor",
    label: "Substitute Executor",
    emptyText: "No substitute executor has been specified."
  },
  trusteesSection: {
    fields: trusteeFields,
    title: "Add Trustee",
    label: "Trustee",
    emptyText: "No trustee has been specified."
  },
  substituteTrusteesSection: {
    fields: substituteTrusteeFields,
    title: "Add Substitute Trustee",
    label: "Substitute Trustee",
    emptyText: "No substitute trustee has been specified."
  }
};

function evaluateConditions(conditions, formValues) {
  if (!conditions) return true;
  const evalClause = (clause) => {
    if (clause.operator === 'AND' || clause.operator === 'OR') {
      const results = clause.clauses.map(evalClause);
      return clause.operator === 'AND' ? results.every(Boolean) : results.some(Boolean);
    }
    const value = formValues[clause.field];
    if (clause.operator === 'eq') return value === clause.value;
    if (clause.operator === 'neq') return value !== clause.value;
    if (clause.operator === 'in') return Array.isArray(clause.value) ? clause.value.includes(value) : false;
    return false;
  };
  return Array.isArray(conditions)
    ? conditions.every(evalClause)
    : evalClause(conditions);
}

export default function FieldRenderer({ field, formValues, setFormValues }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState([]);
  const [modalSection, setModalSection] = useState("");
  const sigCanvasRef = useRef({});

  // --- Section modal handler ---
  if (sectionConfig[field.id]) {
    const section = sectionConfig[field.id];
    const entries = Array.isArray(formValues[field.id]) ? formValues[field.id] : [];

    // Debug: Section rendering

    return (
      <div className="mb-6 bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg">
        <div className="font-semibold text-indigo-700 mb-2">{field.label}</div>
        {entries.length === 0 && (
          <div className="bg-blue-100 text-blue-900 rounded p-3 my-2 text-sm">
            {section.emptyText}
          </div>
        )}
        {entries.map((g, idx) => (
          <div key={g.id || idx} className="mb-2">
            {section.fields.map(f => (
              <span key={`${f.id}-${g.id || idx}`} className="mr-2">{g[f.id]}</span>
            ))}
            <button
              type="button"
              className="text-red-600 text-xs px-2 py-1 rounded hover:bg-red-100 ml-2"
              onClick={() => {
                const updated = entries.filter((_, i) => i !== idx);
                setFormValues(prev => ({
                  ...prev,
                  [field.id]: updated,
                }));
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded mt-2"
          onClick={() => {
            setModalFields(section.fields);
            setModalSection(field.id);
            setModalOpen(true);
          }}
        >
          Add {section.label}
        </button>
        <UniversalModal
          show={modalOpen && modalSection === field.id}
          onClose={() => {
            setModalOpen(false);
          }}
          onSave={entry => {
            setFormValues(prev => ({
              ...prev,
              [field.id]: [...entries, { ...entry, id: Date.now().toString() }]
            }));
            setModalOpen(false);
          }}
          fields={modalFields}
          title={section.title}
        />
      </div>
    );
  }

  // --- Inline single-value add button (legacy support) ---
  if (field.type === 'button' && field.action === 'openAddForm') {
    const targetFieldId = field.id.replace('add', '').replace('Button', 'Data');
    return (
      <div className="mb-6">
        <button
          type="button"
          onClick={() =>
            setShowInputs((prev) => ({ ...prev, [targetFieldId]: true }))
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          {field.label}
        </button>
        {showInputs[targetFieldId] && (
          <input
            type="text"
            className="mt-3 w-full px-4 py-2 border rounded shadow-sm bg-white text-gray-800"
            placeholder={`Enter ${targetFieldId.replace(/([A-Z])/g, ' $1')}`}
            value={formValues[targetFieldId] || ''}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                [targetFieldId]: e.target.value,
              }))
            }
          />
        )}
      </div>
    );
  }

  // --- Standard text/number field ---
  if (field.type === 'text' || field.type === 'number') {
    // Debug: Rendering text/number field
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1" title="Required">*</span>}
        </label>
        {field.infoText && (
          <p className="text-xs text-gray-500 mb-1 italic">{field.infoText}</p>
        )}
        <input
          type={field.type}
          placeholder={field.placeholder || ''}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
          value={formValues[field.id] || ''}
          onChange={(e) => {
            setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))
          }
          }
        />
      </div>
    );
  }

  // --- Textarea field ---
  if (field.type === 'textarea') {
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1" title="Required">*</span>}
        </label>
        {field.infoText && (
          <p className="text-xs text-gray-500 mb-1 italic">{field.infoText}</p>
        )}
        <textarea
          rows={field.rows || 3}
          placeholder={field.placeholder || ''}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
          value={formValues[field.id] || ''}
          onChange={(e) => {
            setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))
          }}
        />
      </div>
    );
  }

  // --- Radio field ---
  if (field.type === 'radio' && field.options) {
    const selectedOption = field.options.find(
      (opt) => opt.value === formValues[field.id]
    );
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1" title="Required">*</span>}
        </label>
        {field.infoText && (
          <p className="text-xs text-gray-500 mb-1 italic">{field.infoText}</p>
        )}
        <div className="mt-2 space-y-2">
          {field.options.map((opt, idx) => (
            <label key={opt.value || `opt-${idx}`} className="flex items-center gap-2">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                className="accent-indigo-600"
                checked={formValues[field.id] === opt.value}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
              />
              <span className="text-gray-800">{opt.label}</span>
            </label>
          ))}
        </div>
        {selectedOption?.willClauseText && (
          <div className="mt-3 p-3 bg-indigo-100 text-indigo-900 rounded text-sm shadow-inner">
            {selectedOption.willClauseText}
          </div>
        )}
      </div>
    );
  }

  // --- Checkbox group field ---
  if (field.type === 'checkboxGroup' && field.options) {
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1" title="Required">*</span>}
        </label>
        {field.infoText && (
          <p className="text-xs text-gray-500 mb-1 italic">{field.infoText}</p>
        )}
        <div className="mt-2 flex flex-col space-y-2">
          {field.options.map((opt, idx) => (
            <label key={opt.value || `opt-${idx}`} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-indigo-600"
                checked={
                  Array.isArray(formValues[field.id])
                    ? formValues[field.id].includes(opt.value)
                    : false
                }
                onChange={(e) => {
                  const newValue = Array.isArray(formValues[field.id])
                    ? [...formValues[field.id]]
                    : [];
                  if (e.target.checked) {
                    newValue.push(opt.value);
                  } else {
                    const index = newValue.indexOf(opt.value);
                    if (index > -1) newValue.splice(index, 1);
                  }
                  setFormValues((prev) => ({
                    ...prev,
                    [field.id]: newValue,
                  }));
                }}
              />
              <span className="text-gray-800">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // --- Signature field ---
  if (field.type === 'signature') {
    return (
      <div className="my-6">
        <label className="block font-semibold text-gray-800 mb-2">{field.label}</label>
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 500, height: 100, className: 'sigCanvas w-full h-24' }}
            ref={(ref) => (sigCanvasRef.current[field.id] = ref)}
            onEnd={() => {
              const dataUrl = sigCanvasRef.current[field.id]?.getTrimmedCanvas()?.toDataURL('image/png');
              setFormValues((prev) => ({
                ...prev,
                [field.id]: dataUrl,
              }));
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            sigCanvasRef.current[field.id]?.clear();
            setFormValues((prev) => ({
              ...prev,
              [field.id]: '',
            }));
          }}
          className="mt-2 text-sm text-red-500 hover:underline"
        >
          Clear Signature
        </button>
        {field.subLabel && (
          <p className="text-xs text-gray-500 mt-2">{field.subLabel}</p>
        )}
      </div>
    );
  }

  // --- Date field ---
  if (field.type === 'date') {
    return (
      <div className="mb-6">
        <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1" title="Required">*</span>}
        </label>
        {field.infoText && <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 italic">{field.infoText}</div>}
        <input
          type="date"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
          value={formValues[field.id] || ''}
          onChange={e => {
            setFormValues(prev => ({ ...prev, [field.id]: e.target.value }));
          }}
        />
      </div>
    );
  }

  // --- Currency field ---
  if (field.type === 'currency') {
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">{field.label}</label>
        <input
          type="number"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          value={formValues[field.id] || ''}
          onChange={e => {
            setFormValues(prev => ({ ...prev, [field.id]: e.target.value }));
          }}
        />
      </div>
    );
  }

  // --- Section field ---
  if (field.type === 'section') {
    // Optionally render subfields here if needed
    return null;
  }

  // --- Defensive fallback ---
  console.warn(`[FieldRenderer] No field component found for type: ${field.type} or id: ${field.id}`, field);
  return null;
}
