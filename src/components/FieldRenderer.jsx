import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import UniversalModal from './UniversalModal';
import ArrayFieldSection from './ArrayFieldSection';
import { UserIcon } from "@heroicons/react/24/outline";
import { getAutofillOptions } from '../utils/autofillUtils';

// --- CONDITION LOGIC ---
function evaluateConditions(conditions, formValues, logic = "AND") {
  if (!conditions) return true;
    console.log("[COND DEBUG]", { conditions, formValues, logic });

  if (Array.isArray(conditions)) {
    // Use passed logic if present, else default to AND
    const effectiveLogic = logic || "AND";
    const results = conditions.map(cond =>
      evaluateConditions(cond, formValues) // Each array element is usually an object; logic only applies at this level
    );
    return effectiveLogic === "AND"
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  if (typeof conditions === "object" && conditions.operator) {
    // Handle compound logic (AND/OR)
    if (conditions.operator === "AND" || conditions.operator === "OR") {
      const results = conditions.clauses.map(cond =>
        evaluateConditions(cond, formValues)
      );
      return conditions.operator === "AND"
        ? results.every(Boolean)
        : results.some(Boolean);
    }
    // Leaf operators
    const value = formValues[conditions.field];
    if (conditions.operator === "eq") return value === conditions.value;
    if (conditions.operator === "neq") return value !== conditions.value;
    if (conditions.operator === "in") return Array.isArray(conditions.value)
      ? conditions.value.includes(value)
      : false;
    return false;
  }
  return false;
}

// --- UNIVERSAL BUTTON/MODAL ADD HANDLER ---
function AddModalButton({ field, parentSection, formValues, setFormValues }) {
  // Debug logs for tracing button/modals
  console.log('[AddModalButton] field:', field);
  console.log('[AddModalButton] parentSection:', parentSection);
  if (parentSection) {
    console.log('[AddModalButton] parentSection.subFields:', parentSection.subFields);
  }
  // Find modalFields sibling in the parentSection
  let modalFields = null;
  let modalTitle = field.label || 'Add Entry';
  if (parentSection && Array.isArray(parentSection.subFields)) {
    // Looks for sibling whose type is modalFields and has a similar id
    const siblingModal = parentSection.subFields.find(
      f => f.type === 'modalFields' &&
        (
          f.id === field.id.replace('Button', 'ModalFields') ||
          f.id.toLowerCase().includes(field.id.replace('Button', '').replace('add', '').toLowerCase())
        )
    );
    if (siblingModal) {
      modalFields = siblingModal.fields;
      if (siblingModal.label) modalTitle = siblingModal.label;
    }
  }
  console.log('[AddModalButton] modalFields found:', modalFields);

  const [showModal, setShowModal] = useState(false);

  // Compute where to save modal data in formValues, e.g. guardianData, partnerData, etc
  const targetFieldId = (() => {
    if (field.id.startsWith('add')) return field.id.replace('add', '').replace('Button', 'Data');
    return field.id.replace('Button', 'Data');
  })();
  const addedEntry = formValues[targetFieldId];

  return (
    <>
      <div className="mb-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            console.log('[AddModalButton] Button clicked! Setting showModal = true');
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
          {field.label}
        </button>
        {addedEntry && (
          <span className="text-green-700 font-semibold">
            Entry Added
          </span>
        )}
      </div>
      {modalFields && showModal && (
        <UniversalModal
          show={showModal}
          title={modalTitle}
          fields={modalFields}
          initialValues={addedEntry || {}}
          onSave={data => {
            setFormValues(prev => ({
              ...prev,
              [targetFieldId]: data,
            }));
            setShowModal(false);
            console.log('[AddModalButton] Modal saved, data:', data);
          }}
          onClose={() => {
            setShowModal(false);
            console.log('[AddModalButton] Modal closed without saving');
          }}
        />
      )}
      {/* Extra: show a warning if modalFields is NOT found */}
      {!modalFields && (
        <div className="text-red-500 text-xs mb-2">No modal fields found for this Add button! Check your form JSON structure.</div>
      )}
    </>
  );
}

// --- MAIN FIELD RENDERER ---
export default function FieldRenderer({ field, formValues, setFormValues, parentSection }) {
  // All hooks must be at the top (no conditions!)
  const sigCanvasRef = useRef({});
  const [showInputs, setShowInputs] = useState({});

  // --- DEBUG: Field Render ---
  console.log(`[FieldRenderer] Rendering field: ${field.id}, type: ${field.type}`, field);

  // --- CONDITIONS ---
  if (field.conditions && !evaluateConditions(field.conditions, formValues)) {
    return null;
  }

    // --- Display field (info only, no input) ---
  if (field.type === 'display') {
    return (
      <div className="mb-4 text-indigo-700 font-semibold text-sm">
        {field.label || field.value || ''}
      </div>
    );
  }

  // --- Hidden field (used for internal/calculation fields, not shown) ---
  if (field.type === 'hidden') {
    return null;
  }

  // --- ARRAY/REPEATER FIELD ---
if (field.type === "array" && Array.isArray(field.subFields)) {
   console.log("[DEBUG] Rendering ARRAY field:", field.id, "Current formValues:", formValues);
    return (
      <RepeaterField
        field={field}
        value={formValues[field.id] || []}
        onChange={arr => setFormValues(prev => ({
          ...prev,
          [field.id]: arr
        }))}
      />
    );
  }

  // --- UNIVERSAL ADD BUTTON (covers all: partner, guardian, trustee, etc) ---
  if (field.type === 'button' && field.action === 'openAddForm') {
    // Debug all add buttons
    console.log(`[FieldRenderer] Showing AddModalButton for: ${field.id}`);
    console.log('[FieldRenderer] Rendering button field:', field.id, field);

    return (
      <AddModalButton
        field={field}
        parentSection={parentSection}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    );
  }

  // --- Standard Fields ---
  if (
    field.type === 'text' ||
    field.type === 'number' ||
    field.type === 'email'
  ) {
    let inputType = field.type;
    if (field.id.toLowerCase().includes('email')) inputType = 'email';
    if (field.id.toLowerCase().includes('mobile') || field.id.toLowerCase().includes('tel')) inputType = 'tel';

    const shouldUseAutofill = field.useAutofill === true;
    const autofillOptions = shouldUseAutofill ? getAutofillOptions(field, formValues) : [];

    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={inputType}
          list={shouldUseAutofill ? `${field.id}-autofill-list` : undefined}
          inputMode={inputType === 'tel' ? 'numeric' : undefined}
          maxLength={field.id === 'postcode' ? 8 : field.maxLength || undefined}
          pattern={field.pattern || undefined}
          value={formValues[field.id] || ''}
          onChange={e => {
            const newValue = field.id === 'postcode'
              ? e.target.value.toUpperCase()
              : e.target.value;
            setFormValues(prev => ({
              ...prev,
              [field.id]: newValue,
            }));
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
          required={field.required}
        />
        {shouldUseAutofill && (
          <datalist id={`${field.id}-autofill-list`}>
            {autofillOptions.map((option, idx) => (
              <option key={`${field.id}-opt-${idx}`} value={option} />
            ))}
          </datalist>
        )}
      </div>
    );
  }

  // --- Textarea field ---
  if (field.type === 'textarea') {
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.infoText && (
          <p className="text-xs text-gray-500 mb-1 italic">{field.infoText}</p>
        )}
        <textarea
          rows={field.rows || 3}
          placeholder={field.placeholder || ''}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
          value={formValues[field.id] || ''}
          onChange={e =>
            setFormValues(prev => ({
              ...prev,
              [field.id]: e.target.value,
            }))
          }
          required={field.required}
        />
      </div>
    );
  }

  // --- Radio field ---
  if (field.type === 'radio' && field.options) {
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
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
                onChange={e => {
                  setFormValues(prev => ({
                    ...prev,
                    [field.id]: e.target.value,
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

  // --- Checkbox group field ---
  if (field.type === 'checkboxGroup' && field.options) {
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
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
                onChange={e => {
                  const newValue = Array.isArray(formValues[field.id])
                    ? [...formValues[field.id]]
                    : [];
                  if (e.target.checked) {
                    newValue.push(opt.value);
                  } else {
                    const index = newValue.indexOf(opt.value);
                    if (index > -1) newValue.splice(index, 1);
                  }
                  setFormValues(prev => ({
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
            ref={ref => (sigCanvasRef.current[field.id] = ref)}
            onEnd={() => {
              const dataUrl = sigCanvasRef.current[field.id]?.getTrimmedCanvas()?.toDataURL('image/png');
              setFormValues(prev => ({
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
            setFormValues(prev => ({
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
        <label className="block font-semibold text-gray-800 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.infoText && (
          <div className="text-xs text-gray-500 mb-1 italic">{field.infoText}</div>
        )}
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
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
          min={0}
          value={formValues[field.id] || ''}
          onChange={e =>
            setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white"
        />
      </div>
    );
  }

  // --- Section field (groups of subfields) ---
  if (field.type === 'section' && Array.isArray(field.subFields)) {
    console.log(`[FieldRenderer] Rendering section: ${field.id}, Subfields:`, field.subFields.map(f => f.id));
    return (
      <div className="mb-6">
        <label className="block font-semibold text-gray-800 mb-2">{field.label}</label>
        <div className="space-y-4">
          {field.subFields.map(subField => (
            <FieldRenderer
              key={subField.id}
              field={subField}
              formValues={formValues}
              setFormValues={setFormValues}
              parentSection={field}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- Defensive fallback ---
  console.warn(`[FieldRenderer] No field component found for type: ${field.type} or id: ${field.id}`, field);
  return null;
}
