const fs = require('fs');

const INPUT_FILES = [
  '../data/Complete-WillSuite-Form-Data.json',
  '../data/Complete-WillSuite-Form-Data-UPDATED.json',
  '../data/Complete-WillSuite-Form-Data-REACTREADY.json',
  '../data/Complete-WillSuite-Form-Data-FINAL.json'
];
const OUTPUT = '../data/Complete-WillSuite-Form-Data-SUPERFINAL.json';

function deepMerge(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    // Merge arrays, keep unique fields by id if present
    const all = [...a];
    for (const item of b) {
      if (!all.find(x => x && item && x.id === item.id)) {
        all.push(item);
      }
    }
    return all;
  } else if (typeof a === 'object' && typeof b === 'object' && a && b) {
    const result = { ...a };
    for (const key of Object.keys(b)) {
      if (key in result) {
        result[key] = deepMerge(result[key], b[key]);
      } else {
        result[key] = b[key];
      }
    }
    return result;
  } else {
    return b === undefined ? a : b;
  }
}

// Load and merge all files
let merged = {};
for (const p of INPUT_FILES) { // THIS IS THE ONLY THING THAT WAS WRONG! No more 'paths'.
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    merged = deepMerge(merged, data);
  } else {
    console.warn('Not found:', p);
  }
}

// Remove any exact duplicates from arrays (by id)
function dedupFields(fields) {
  const seen = new Set();
  return (fields || []).filter(f => {
    if (f && f.id && !seen.has(f.id)) {
      seen.add(f.id);
      // De-dupe subFields recursively
      if (Array.isArray(f.subFields)) {
        f.subFields = dedupFields(f.subFields);
      }
      return true;
    }
    return false;
  });
}
if (merged.formSections) {
  merged.formSections = merged.formSections.map(sec => {
    if (Array.isArray(sec.fields)) sec.fields = dedupFields(sec.fields);
    return sec;
  });
}

// Save output
fs.writeFileSync(OUTPUT, JSON.stringify(merged, null, 2));
console.log('🎉 Complete-WillSuite-Form-Data-SUPERFINAL.json created! 🎉');
