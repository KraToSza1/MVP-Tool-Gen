const fs = require('fs');
const path = require('path');

console.log("Current working directory:", process.cwd());
console.log("Script directory (__dirname):", __dirname);

console.log("Files in current directory:");
console.log(fs.readdirSync(__dirname));



// These are correct!
const filePath = path.join(__dirname, 'Complete-WillSuite-Form-Data-FINAL.json');
const outputPath = path.join(__dirname, 'Complete-WillSuite-Form-Data-FINAL-patched.json');

// Replacement fields
const professionalExecutorFields = [
  {
    "id": "professionalExecutorType",
    "type": "radio",
    "label": "Professional Executor",
    "required": true,
    "options": [
      { "value": "Aristone", "label": "Aristone" },
      { "value": "Other", "label": "Other (please specify)" }
    ]
  },
  {
    "id": "professionalExecutorOtherDetails",
    "type": "text",
    "label": "If 'Other', please specify the company and/or individual",
    "required": true,
    "conditions": [
      { "field": "professionalExecutorType", "operator": "eq", "value": "Other" }
    ]
  }
];

const substituteProfessionalExecutorFields = [
  {
    "id": "substituteProfessionalExecutorType",
    "type": "radio",
    "label": "Substitute Professional Executor",
    "required": true,
    "options": [
      { "value": "Aristone", "label": "Aristone" },
      { "value": "Other", "label": "Other (please specify)" }
    ]
  },
  {
    "id": "substituteProfessionalExecutorOtherDetails",
    "type": "text",
    "label": "If 'Other', please specify the company and/or individual",
    "required": true,
    "conditions": [
      { "field": "substituteProfessionalExecutorType", "operator": "eq", "value": "Other" }
    ]
  }
];

// Read once!
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Helper function to patch a section
function patchFields(sectionId, modalFieldId, newFields) {
  const trusteesSection = data.formSections.find(s => s.formSection === "Trustees/Executors");
  if (!trusteesSection) {
    console.error('❌ Trustees/Executors section not found');
    return;
  }
  const sectionField = trusteesSection.fields.find(f => f.id === sectionId);
  if (!sectionField || !Array.isArray(sectionField.subFields)) {
    console.error(`❌ SectionField '${sectionId}' not found or no subFields`);
    return;
  }
  const modal = sectionField.subFields.find(sf => sf.id === modalFieldId);
  if (!modal) {
    console.error(`❌ ModalField '${modalFieldId}' not found`);
    return;
  }
  modal.fields = newFields;
}

// Patch both modals in the loaded data
patchFields(
  "professionalExecutorSection",
  "addProfessionalExecutorModalFields",
  professionalExecutorFields
);

patchFields(
  "substituteProfessionalExecutorSection",
  "addSubstituteProfessionalExecutorModalFields",
  substituteProfessionalExecutorFields
);

// Write once at the end!
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`✅ Patch complete! Patched file written to: ${outputPath}`);
