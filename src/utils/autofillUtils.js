/**
 * Collects unique string values from known repeatable form sections
 * for use in autofill dropdowns.
 * 
 * @param {Object} field - The field object currently being rendered
 * @param {Object} formValues - All current form values keyed by sectionId
 * @returns {string[]} - A list of unique string options for autofill
 */
export function getAutofillOptions(field, formValues) {
  const allValues = [];

  // These are known repeatable sections that may contain names
  const sectionsToScan = [
    'partnerData',
    'guardianData',
    'executorData',
    'substituteGuardianData',
    'childrenData',
    'trusteeData',
    'professionalExecutorData',
    'professionalTrusteeData'
  ];

  sectionsToScan.forEach(sectionId => {
    const section = formValues[sectionId];
    
    if (Array.isArray(section)) {
      section.forEach(entry => {
        if (entry && typeof entry === 'object') {
          Object.entries(entry).forEach(([key, value]) => {
            if (
              typeof value === 'string' &&
              value.trim().length > 0 &&
              /^[a-zA-Z\s'.-]{2,}$/.test(value) // Only allow name-like strings
            ) {
              allValues.push(value.trim());
            }
          });
        }
      });
    } else if (section && typeof section === 'object') {
      Object.entries(section).forEach(([key, value]) => {
        if (
          typeof value === 'string' &&
          value.trim().length > 0 &&
          /^[a-zA-Z\s'.-]{2,}$/.test(value)
        ) {
          allValues.push(value.trim());
        }
      });
    }
  });

  // Remove duplicates
  const uniqueValues = [...new Set(allValues)];

  // Optional: Sort alphabetically
  uniqueValues.sort((a, b) => a.localeCompare(b));

  return uniqueValues;
}
