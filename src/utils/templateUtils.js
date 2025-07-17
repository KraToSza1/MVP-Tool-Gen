// templateUtils.js

// Utility: Get a person's full name and address (object can be any person type)
export function getFullNameAndAddress(person = {}) {
  if (!person) return "";
  const full = [person.title, person.firstName, person.middleName, person.lastName]
    .filter(Boolean)
    .join(" ");
  const addr = [person.address1, person.address2, person.address3, person.postcode]
    .filter(Boolean)
    .join(", ");
  return addr ? `${full} of ${addr}` : full;
}

// Utility: Format a list for human text (with "and", "or", etc.)
export function formatList(list, conj = "and") {
  if (!list?.length) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return list.join(` ${conj} `);
  return `${list.slice(0, -1).join(", ")}, ${conj} ${list[list.length - 1]}`;
}

// Utility: Get all people from formValues (for dropdowns)
// Looks for arrays in formValues that contain person-like objects
export function getAllPeople(formValues) {
  const personArrays = Object.entries(formValues)
    .filter(([key, val]) => Array.isArray(val) && val.length > 0 && isPersonArray(val));
  const people = [];
  personArrays.forEach(([key, arr]) => {
    arr.forEach(person => {
      if (person && typeof person === "object") {
        people.push({
          ...person,
          // Attach a helpful label for dropdowns:
          fullName:
            [person.title, person.firstName, person.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() || person.email || "Person"
        });
      }
    });
  });
  return people;
}

// Helper: Heuristic for whether an array contains "person" objects
function isPersonArray(arr) {
  // We consider it "person" if first object has firstName or lastName
  if (!Array.isArray(arr)) return false;
  const first = arr[0];
  if (!first || typeof first !== "object") return false;
  return (
    "firstName" in first ||
    "lastName" in first ||
    "title" in first
  );
}

// Template rendering utility: replace {{field:section:field:format}} etc.
export function renderTemplate(template, formValues) {
  if (!template || typeof template !== "string") return "";
  return template.replace(
    /\{\{field:([a-zA-Z0-9_]+)(?::([a-zA-Z0-9_]+))?(?::([a-zA-Z0-9_]+))?\}\}/g,
    (_, part1, part2, part3) => {
      let value = "";
      if (part3) {
        // {{field:section:field:format}}
        if (formValues[part1] && typeof formValues[part1] === "object") {
          value = formValues[part1][part2];
        }
        if (part3 === "formattedAmount" && value) {
          value = Number(value).toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP",
          });
        }
        if (part3 === "selectedPurposes" && Array.isArray(value)) {
          value = value.join(" and ");
        }
      } else if (part2) {
        // {{field:section:field}}
        if (formValues[part1] && typeof formValues[part1] === "object") {
          value = formValues[part1][part2];
        } else if (formValues[`${part1}.${part2}`]) {
          value = formValues[`${part1}.${part2}`];
        }
      } else {
        // {{field:field}}
        value = formValues[part1];
      }
      return value ?? "";
    }
  );
}

// Additional: Format amount (for use in templates)
export function formatCurrency(amount) {
  if (!amount) return "";
  return Number(amount).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}
