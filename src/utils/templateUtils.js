export function renderTemplate(template, formValues) {
  if (!template || typeof template !== 'string') return '';
  console.log('[renderTemplate] Template:', template);
  console.log('[renderTemplate] formValues:', formValues);

  return template.replace(
    /\{\{field:([a-zA-Z0-9_]+):([a-zA-Z0-9_]+)(?::([a-zA-Z0-9_]+))?\}\}/g,
    (_, section, field, format) => {
      let value = '';
      if (formValues[section] && typeof formValues[section] === 'object') {
        value = formValues[section][field];
      } else if (formValues[`${section}.${field}`]) {
        value = formValues[`${section}.${field}`];
      }
      if (format === 'formattedAmount' && value) {
        value = Number(value).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
      }
      if (format === 'selectedPurposes' && Array.isArray(value)) {
        value = value.join(' and ');
      }
      if (!value) {
        console.warn(`[renderTemplate] Could not resolve: section="${section}", field="${field}", format="${format}"`);
      } else {
        console.log(`[renderTemplate] Resolved: section="${section}", field="${field}", format="${format}" =>`, value);
      }
      return value || '';
    }
  );
}