export function renderTemplate(template, formValues) {
  if (!template || typeof template !== 'string') return '';
  // Replace {{field:section:field:format}} or {{field:section:field}} or {{field:field}}
  return template.replace(
    /\{\{field:([a-zA-Z0-9_]+)(?::([a-zA-Z0-9_]+))?(?::([a-zA-Z0-9_]+))?\}\}/g,
    (_, part1, part2, part3) => {
      let value = '';
      if (part3) {
        // {{field:section:field:format}}
        if (formValues[part1] && typeof formValues[part1] === 'object') {
          value = formValues[part1][part2];
        }
        if (part3 === 'formattedAmount' && value) {
          value = Number(value).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
        }
        if (part3 === 'selectedPurposes' && Array.isArray(value)) {
          value = value.join(' and ');
        }
      } else if (part2) {
        // {{field:section:field}}
        if (formValues[part1] && typeof formValues[part1] === 'object') {
          value = formValues[part1][part2];
        } else if (formValues[`${part1}.${part2}`]) {
          value = formValues[`${part1}.${part2}`];
        }
      } else {
        // {{field:field}}
        value = formValues[part1];
      }
      return value ?? '';
    }
  );
}