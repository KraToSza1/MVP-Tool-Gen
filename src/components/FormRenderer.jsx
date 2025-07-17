import React, { useState, useEffect } from 'react';
import formData from '../data/Complete-WillSuite-Form-Data-FINAL.json';
import Sidebar from './Sidebar.jsx';
import FieldRenderer from './FieldRenderer.jsx';
import { Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument.jsx';
import WillPreview from './WillPreview.jsx';
import AddModalButton from './AddModalButton.jsx';

// --- DEBUG: Log formData structure on load ---
console.log('[DEBUG] Loaded formData:', formData);

/**
 * Format an array of person objects (used for arrays in deepGet).
 */
function formatPersonArray(arr, keys = ["relationship", "fullName", "email", "partnerAddress", "address"]) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return arr
    .map(item => {
      if (typeof item === "object" && item !== null) {
        if (item.fullDetails) return item.fullDetails;
        // Join all relevant keys if present, skipping empty values
        return keys.map(k => item[k]).filter(Boolean).join(" | ");
      }
      return String(item);
    })
    .filter(Boolean)
    .join("; ");
}

/**
 * Safely get nested data by path, supporting arrays and objects.
 */
function deepGet(obj, path) {
  if (!obj || !path) return '';
  const parts = path.split(/[:.]/);
  let current = obj;
  for (let part of parts) {
    if (current == null) return '';
    current = current[part];
  }
  if (Array.isArray(current)) {
    return formatPersonArray(current);
  }
  if (current && typeof current === 'object') {
    return (
      current.fullDetails ||
      current.value ||
      Object.values(current)
        .filter(v => typeof v === 'string' && v.trim() !== '')
        .join(' ')
    );
  }
  if (current === undefined || current === null) return '';
  return String(current);
}

/**
 * Interpolates text like "Hello {{field:foo}}" with values from form data.
 * Supports fallback: {{field:foo|Unknown}}
 */
const interpolateText = (text, values) => {
  if (typeof text !== 'string') return text;
  return text.replace(/\{\{field:([^}|]+)(?:\|([^}]+))?\}\}/g, (_, path, fallback) => {
    const trimmedPath = path.trim();
    let result = deepGet(values, trimmedPath);
    if (result === '' || result === undefined || result === null) {
      result = fallback !== undefined ? fallback : '';
    }
    return result;
  });
};
const buildInitialValues = () => {
  const initialValues = {};
  const traverseFields = (fields) => {
    fields.forEach((field) => {
      if (field.type === 'section' && field.subFields) {
        traverseFields(field.subFields);
      } else {
        if (field.type === 'checkboxGroup') {
          initialValues[field.id] = field.value ?? [];
        } else {
          initialValues[field.id] = field.value ?? '';
        }
      }
    });
  };
  formData.formSections.forEach((section) => {
    traverseFields(section.fields);
  });
  console.log('[INIT] Initial form values:', initialValues);
  return initialValues;
};

function buildAggregatedValues(formValues) {
  const joinSection = (section, field) =>
    (formValues[section] || [])
      .map(entry => entry[field])
      .filter(Boolean)
      .join(', ');

  const joinFullDetails = (section) =>
    (formValues[section] || [])
      .map(entry => entry.fullDetails || [entry.relationship, entry.fullName, entry.address].filter(Boolean).join(' '))
      .filter(Boolean)
      .join(', ');

  const getTextarea = (section, field) =>
    (formValues[section] && formValues[section][field]) ? formValues[section][field] : '';

  return {
    'executorsSection.fullDetails': joinFullDetails('executorsSection'),
    'substituteExecutorsSection.fullDetails': joinFullDetails('substituteExecutorsSection'),
    'professionalExecutorSection.fullDetails': joinFullDetails('professionalExecutorSection'),
    'substituteProfessionalExecutorSection.fullDetails': joinFullDetails('substituteProfessionalExecutorSection'),
    'digitalExecutorsSection.fullDetails': joinFullDetails('digitalExecutorsSection'),
    'trusteesSection.fullDetails': joinFullDetails('trusteesSection'),
    'substituteTrusteesSection.fullDetails': joinFullDetails('substituteTrusteesSection'),
    'professionalTrusteesSection.fullDetails': joinFullDetails('professionalTrusteesSection'),
    'substituteProfessionalTrusteesSection.fullDetails': joinFullDetails('substituteProfessionalTrusteesSection'),
    'guardiansSection.fullDetails': joinFullDetails('guardiansSection'),
    'substituteGuardiansSection.fullDetails': joinFullDetails('substituteGuardiansSection'),
    'separateTrusteesSection.fullDetails': joinFullDetails('separateTrusteesSection'),
    'signingOnBehalfSection.fullDetails': joinFullDetails('signingOnBehalfSection'),
    'interpreterSection.fullDetails': joinFullDetails('interpreterSection'),
    'petCarerSection.fullDetails': joinFullDetails('petCarerSection'),
    'substitutePetCarerSection.fullDetails': joinFullDetails('substitutePetCarerSection'),
    'debtorSection.fullDetails': joinFullDetails('debtorSection'),
    'excludedPersonSection.fullDetails': joinFullDetails('excludedPersonSection'),
    'chattelsGiftBeneficiarySection.fullDetails': joinFullDetails('chattelsGiftBeneficiarySection'),
    'chattelRecipientsSection.relationshipList': joinSection('chattelRecipientsSection', 'relationship'),
    'chattelRecipientsSection.nameList': joinSection('chattelRecipientsSection', 'fullName'),
    'chattelRecipientsSection.addressList': joinSection('chattelRecipientsSection', 'address'),
    'excludedPersonSection.relationshipList': joinSection('excludedPersonSection', 'relationship'),
    'excludedPersonSection.nameList': joinSection('excludedPersonSection', 'fullName'),
    'excludedPersonSection.addressList': joinSection('excludedPersonSection', 'address'),
    'petCarerSection.relationshipList': joinSection('petCarerSection', 'relationship'),
    'petCarerSection.nameList': joinSection('petCarerSection', 'fullName'),
    'petCarerSection.addressList': joinSection('petCarerSection', 'address'),
    'substitutePetCarerSection.relationshipList': joinSection('substitutePetCarerSection', 'relationship'),
    'substitutePetCarerSection.nameList': joinSection('substitutePetCarerSection', 'fullName'),
    'substitutePetCarerSection.addressList': joinSection('substitutePetCarerSection', 'address'),
    'debtorSection.relationshipList': joinSection('debtorSection', 'relationship'),
    'debtorSection.nameList': joinSection('debtorSection', 'fullName'),
    'debtorSection.addressList': joinSection('debtorSection', 'address'),
    'monetaryGiftsSection.fullList': getTextarea('monetaryGiftsSection', 'monetaryGiftsDetails'),
    'specificGiftsSection.fullList': getTextarea('specificGiftsSection', 'specificGiftsDetails'),
    'propertyGiftsSection.fullList': getTextarea('propertyGiftsSection', 'propertyGiftsDetails'),
    'residualGiftsSection.details': getTextarea('residualGiftsSection', 'residualGiftsDetails'),
    'furtherResidualGiftsSection.details': getTextarea('furtherResidualGiftsSection', 'furtherResidualGiftsDetails'),
    'charityBenefitSection.details': getTextarea('charityBenefitSection', 'charityBenefitDetails'),
    'bprTrustSection.details': getTextarea('bprTrustSection', 'bprTrustDetails'),
    'bprTrustSection.scheduleNumber': getTextarea('bprTrustSection', 'bprTrustScheduleNumber'),
    'bprTrustSection.terms': getTextarea('bprTrustSection', 'bprTrustTerms'),
    'propertyTrustSection.propertyDetails': getTextarea('propertyTrustSection', 'propertyTrustDetails'),
    'propertyTrustSection.scheduleNumber': getTextarea('propertyTrustSection', 'propertyTrustScheduleNumber'),
    'propertyTrustSection.terms': getTextarea('propertyTrustSection', 'propertyTrustTerms'),
    'lifeTenantSectionFLIT.details': getTextarea('lifeTenantSectionFLIT', 'lifeTenantDetails'),
    'beneficiariesSectionFLIT.details': getTextarea('beneficiariesSectionFLIT', 'beneficiariesDetails'),
    'trustEndDistributionSectionFLIT.details': getTextarea('trustEndDistributionSectionFLIT', 'trustEndDistributionDetails'),
  };
}

function saveFormToFile(formValues, filename = "willFormData.json") {
  const blob = new Blob([JSON.stringify(formValues, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function loadFormFromFile(setFormValues) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setFormValues(data);
        console.log('[FileLoader] Loaded form values:', data);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function collectClauses(fields, values) {
  let clauses = [];
  fields.forEach(field => {
    if (field.type === 'section' && Array.isArray(field.subFields)) {
      console.log(`[ClauseGen] Collecting section: ${field.id}, Subfields:`, field.subFields.map(f => f.id));
      clauses = clauses.concat(collectClauses(field.subFields, values[field.id] || {}));
    } else if (field.type === 'radio' && Array.isArray(field.options)) {
      const selected = field.options.find(opt => opt.value === values[field.id]);
      if (selected && selected.willClauseText) {
        clauses.push(interpolateText(selected.willClauseText, values));
      } else if (field.willClauseText) {
        clauses.push(interpolateText(field.willClauseText, values));
      }
    } else if (field.willClauseText) {
      clauses.push(interpolateText(field.willClauseText, values));
    }
  });
  return clauses;
}

export default function FormRenderer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formValues, setFormValues] = useState(() => {
    const saved = localStorage.getItem('willForm');
    const initial = saved ? JSON.parse(saved) : buildInitialValues();
    console.log('[INIT] useState formValues:', initial);
    return initial;
  });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFields, setExpandedFields] = useState({});
  const [willPreviewOpen, setWillPreviewOpen] = useState(false);
  const currentSection = formData.formSections[currentIndex];

  if (!currentSection) {
    return (
      <div className="p-8 text-red-600 font-bold">
        Error: This section does not exist. Please check your form data or navigation logic.
      </div>
    );
  }

  useEffect(() => {
    localStorage.setItem('willForm', JSON.stringify(formValues));
    console.log('[EFFECT] Saved formValues to localStorage:', formValues);
  }, [formValues]);

  useEffect(() => {
    console.log('[EFFECT] [Section] Now rendering:', currentSection.formSection);
    currentSection.fields.forEach(field => {
      console.log('[EFFECT] Field:', field.id, 'type:', field.type, 'conditions:', field.conditions, 'value:', formValues[field.id]);
    });
  }, [currentSection, formValues]);

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

  const checkFieldCompletion = (field) => {
    if (field.conditions && !evaluateConditions(field.conditions, formValues)) {
      console.log('[CheckField] Field', field.id, 'is hidden by conditions, treating as complete.');
      return true;
    }
    if (field.type === 'section' && Array.isArray(field.subFields)) {
      return field.subFields.every(checkFieldCompletion);
    }
    if (field.required) {
      const value = formValues[field.id];
      if (field.type === 'checkboxGroup') {
        return Array.isArray(value) && value.length > 0;
      }
      if (field.type === 'radio') {
        return typeof value === 'string' && value.trim() !== '';
      }
      if (field.type === 'currency' || field.type === 'number') {
        return value !== null && value !== undefined && value !== '';
      }
      return value !== '' && value !== null && value !== undefined;
    }
    return true;
  };

  const isFormFullyCompleted = () =>
    formData.formSections.every(section =>
      section.fields.every(checkFieldCompletion)
    );

  const isCurrentSectionComplete = () =>
    currentSection.fields.every(checkFieldCompletion);

  const goNext = () => {
    console.log("[NAV] Next clicked. Current index:", currentIndex, "Section complete?", isCurrentSectionComplete());
    if (currentIndex < formData.formSections.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitted(true);
      localStorage.removeItem('willForm');
      console.log("[NAV] Form submitted and localStorage cleared.");
    }
  };

  const goBack = () => {
    console.log("[NAV] Back clicked. Current index:", currentIndex);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const saveDraft = () => {
    localStorage.setItem('willForm', JSON.stringify(formValues));
    console.log('[Button] Saved draft:', formValues);
  };

  const allClauses = formData.formSections.flatMap(section =>
    section.fields
      .map(field => field.willClauseText)
      .filter(Boolean)
  );

  const aggregatedValues = buildAggregatedValues(formValues);
  const previewValues = { ...formValues, ...aggregatedValues };

  // --- MAIN DEBUG DUMP BEFORE RENDER ---
  console.log('[RENDER] Rendering section:', currentSection.formSection);
  currentSection.fields.forEach(field => {
    console.log('[RENDER] Will render field:', field.id, 'type:', field.type, 'conditions:', field.conditions, 'value:', formValues[field.id]);
  });

  const shouldShowAddPartner = () => {
  const ms = formValues.maritalStatus;
  const cont = formValues.contemplation;

  // 1. If maritalStatus is Civil Partnership, Married, or Cohabiting
  if (["Civil Partnership", "Married", "Cohabiting"].includes(ms)) {
    return true;
  }
  // 2. OR If maritalStatus is Single, Widowed, Divorced AND contemplation is one of the two options
  if (
    ["Single", "Widowed", "Divorced"].includes(ms) &&
    ["Contemplation of Civil Partnership", "Contemplation of Marriage"].includes(cont)
  ) {
    return true;
  }
  return false;
};

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 sm:p-10">
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / formData.formSections.length) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              Step {currentIndex + 1} of {formData.formSections.length}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {formData.formTitle || 'Will Questionnaire'}
            </h1>
            {currentIndex === formData.formSections.length - 1 && isFormFullyCompleted() ? (
              <PDFDownloadLink
                document={<PDFDocument formValues={formValues} />}
                fileName="Will-Preview.pdf"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
              >
                {({ loading }) => loading ? 'Generating PDF...' : (<><Download size={18} /><span>Download PDF</span></>)}
              </PDFDownloadLink>
            ) : (
              <span className="text-sm text-gray-400 italic">Complete all required fields to enable download</span>
            )}
          </div>

          <h2 className="text-xl font-semibold border-b pb-2 mb-8 text-gray-700 border-indigo-600">
            {currentSection.formSection}
          </h2>

          <div className="space-y-8">
            {currentSection.fields.map((field, idx) => (
              <div key={field.id || `field-${idx}`}>
                <FieldRenderer
                  field={{ ...field, willClauseText: interpolateText(field.willClauseText, previewValues) }}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  expandedFields={expandedFields}
                  setExpandedFields={setExpandedFields}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between mt-12 items-center">
            {/* Left side: Back button */}
            <button
              onClick={goBack}
              disabled={currentIndex === 0}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded disabled:opacity-50 transition duration-200"
            >
              Back
            </button>

            {/* Right side: Add Partner (ONLY on Step 2!) and Next */}
            <div className="flex flex-row gap-2 items-center">
              {/* Only show Add Partner on step 2 (index 1), AND only if conditions are met */}
              {currentIndex === 1 && shouldShowAddPartner() && (
                <AddModalButton
                  field={{
                    id: "addPartnerButton",
                    label: "Add Partner",
                    action: "openAddForm",
                    isRepeater: true,
                  }}
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              )}
              <button
                onClick={goNext}
                disabled={!isCurrentSectionComplete()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg transition disabled:opacity-50"
              >
                {currentIndex === formData.formSections.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start">
            <button
              type="button"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={() => {
                setWillPreviewOpen(true);
                console.log('[Button] Preview Will clicked');
              }}
            >
              Preview Will
            </button>

            <aside className="flex-1 bg-gray-100 border border-gray-300 p-4 rounded shadow-inner w-full">
              <h3 className="font-bold mb-2 text-gray-800">Clause Preview</h3>
              <div className="text-sm whitespace-pre-line text-gray-700">
                {collectClauses(currentSection.fields, previewValues).map((rendered, idx) => {
                  if (!rendered || !rendered.trim()) return null;
                  return (
                    <div key={`clause-${idx}`} className="mb-4">
                      {rendered}
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => saveFormToFile(formValues)}
            >
              Save Form Data
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => loadFormFromFile(setFormValues)}
            >
              Load Form Data
            </button>
          </div>
        </div>
      </main>

      {submitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Submission Complete!</h2>
            <p className="text-gray-700">Your will form has been submitted successfully.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <WillPreview
        open={willPreviewOpen}
        onClose={() => setWillPreviewOpen(false)}
        allClauses={allClauses}
        formValues={previewValues}
        onSaveDraft={saveDraft}
      />
    </div>
  );
}
