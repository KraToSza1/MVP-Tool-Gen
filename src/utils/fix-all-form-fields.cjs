const fs = require('fs');

// Set your paths HERE:
const INPUT = '../data/Complete-WillSuite-Form-Data-REACTREADY.json'; // <- CORRECT
const OUTPUT = '../data/Complete-WillSuite-Form-Data-FINAL.json';   // <- CORRECT

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// --- 1. THE COMPLETE PERSON FIELDS BLOCK ---
const standardPersonFields = [
  {
    id: "title", type: "radio", label: "Title", required: true,
    options: [
      { value: "Mr", label: "Mr" }, { value: "Mrs", label: "Mrs" },
      { value: "Miss", label: "Miss" }, { value: "Ms", label: "Ms" },
      { value: "Dr", label: "Dr" }, { value: "Prof", label: "Prof" },
      { value: "Sir", label: "Sir" }, { value: "Dame", label: "Dame" },
      { value: "Lord", label: "Lord" }, { value: "Lady", label: "Lady" },
      { value: "Other", label: "Other" }
    ]
  },
  { id: "firstName", type: "text", label: "First Name(s)", required: true },
  { id: "middleName", type: "text", label: "Middle Name(s)" },
  { id: "lastName", type: "text", label: "Last Name", required: true },
  { id: "knownAs", type: "text", label: "Known As" },
  { id: "alias", type: "text", label: "Alias" },
  { id: "dateOfBirth", type: "date", label: "Date of Birth", required: true },
  {
    id: "gender", type: "radio", label: "Gender", required: true,
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" }
    ]
  },
  { id: "mobile", type: "text", label: "Mobile", required: true },
  { id: "email", type: "text", label: "Email", required: true },
  { id: "address1", type: "text", label: "Address 1", required: true },
  { id: "address2", type: "text", label: "Address 2" },
  { id: "address3", type: "text", label: "Address 3" }
];

// --- 2. FIX FIELD LOGIC ---
function normalizeFieldId(sectionPrefix, fieldId) {
  if (fieldId.startsWith(sectionPrefix)) return fieldId;
  return `${sectionPrefix}${fieldId.charAt(0).toUpperCase()}${fieldId.slice(1)}`;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function fixField(field, sectionPrefix, globalIds) {
  // Step 1: Make address1, email, mobile, gender, dateOfBirth REQUIRED
  const mustBeRequired = ['address1', 'email', 'mobile', 'gender', 'dateOfBirth'];
  if (mustBeRequired.includes(field.id)) {
    field.required = true;
  }

  // Step 2: Unique ID for context
  if (['title', 'postcode', 'address1', 'address2', 'address3', 'address4', 'address5', 'address'].includes(field.id)) {
    field.id = normalizeFieldId(sectionPrefix, field.id);
  }
  // Step 3: No duplicate global IDs
  while (globalIds.has(field.id)) {
    field.id += '_dupe';
  }
  globalIds.add(field.id);

  // Step 4: Add "value" if missing
  if (typeof field.value === "undefined") {
    field.value = field.type === "checkboxGroup" ? [] : "";
  }

  // Step 5: Clause text placeholders
  if (field.willClauseText) {
    field.willClauseText = field.willClauseText.replace(/\{\{field:title\}\}/g, `{{field:${field.id}}}`);
  }

  // Step 6: Fix radio/checkbox option format
  if ((field.type === "radio" || field.type === "checkboxGroup") && Array.isArray(field.options)) {
    field.options = field.options.map(opt =>
      typeof opt === "object"
        ? { value: String(opt.value), label: String(opt.label) }
        : { value: String(opt), label: String(opt) }
    );
  }

  // Step 7: For sections (esp. for people roles!), process subfields
  if (field.type === "section" && Array.isArray(field.subFields)) {
    // Find add button (e.g. "Add Guardian", "Add Executor", etc.)
    let hasAddButton = false;
    let newSubFields = [];
    field.subFields.forEach(sub => {
      if (sub.type === "button" && sub.action === "openAddForm") {
        hasAddButton = true;
        // --- Inject modal fields block right after the button if not present
        newSubFields.push(sub);

        const modalIdPrefix = sub.id.replace(/Button$/, '');
        // Only inject if NOT already present
        if (!field.subFields.some(sf => sf.id === `${modalIdPrefix}ModalFields`)) {
          const modalFields = deepClone(standardPersonFields).map(f => ({
            ...f,
            id: `${modalIdPrefix}_${f.id}`,
            value: f.type === "checkboxGroup" ? [] : "",
            required: f.required || false
          }));
          newSubFields.push({
            id: `${modalIdPrefix}ModalFields`,
            type: "modalFields",
            label: `Enter details for ${modalIdPrefix.replace(/([A-Z])/g, ' $1')}`,
            fields: modalFields
          });
        }
      } else {
        newSubFields.push(sub);
      }
    });
    // If no add button, just process as normal
    field.subFields = newSubFields.map(sub => fixField(sub, field.id.replace('Section',''), globalIds));
  }

  return field;
}

function traverseSections(sections, globalIds) {
  for (const section of sections) {
    const sectionPrefix = section.id || (section.formSection ? section.formSection.replace(/\s+/g, '').toLowerCase() : 'section');
    if (Array.isArray(section.fields)) {
      section.fields = section.fields.map(f => fixField(f, sectionPrefix, globalIds));
    }
  }
  return sections;
}

// MAIN
const globalIds = new Set();
data.formSections = traverseSections(data.formSections, globalIds);

fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
console.log('All form fields fixed and modal entry blocks injected everywhere needed. Output:', OUTPUT);
