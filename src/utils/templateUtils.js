// Utility: Get a person's full name and address (works for any modal person entry)
export function getFullNameAndAddress(person = {}) {
  if (!person) return "";

// If they selected "Other" in a firm-type modal (Executor/Trustee), show custom firm name
  if (
    (person.professionalExecutorType === "Other" ||
     person.professionalTrusteeType === "Other") &&
    person.customFirmName
  ) {
    return person.customFirmName;
  }

// Fallback: Full name
  const full = [person.title, person.firstName, person.middleName, person.lastName]
    .filter(Boolean)
    .join(" ");

// Include country as requested by Mariyam
  const addr = [person.address1, person.address2, person.address3, person.postcode, person.country]
    .filter(Boolean)
    .join(", ");

  return addr ? `${full} of ${addr}` : full;
}

// Format a list for human-readable text (e.g., “Anna, Ben and Carla”)
export function formatList(list, conj = "and") {
  if (!list?.length) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return list.join(` ${conj} `);
  return `${list.slice(0, -1).join(", ")}, ${conj} ${list[list.length - 1]}`;
}

// Scan formValues and return all modal-based people for dropdown reuse
export function getAllPeople(formValues) {
  const personArrays = Object.entries(formValues)
    .filter(([key, val]) => Array.isArray(val) && val.length > 0 && isPersonArray(val));

  const people = [];

  personArrays.forEach(([key, arr]) => {
    arr.forEach(person => {
      if (person && typeof person === "object") {
        people.push({
          ...person,
          // Smart label for UI autofill dropdowns
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

// Helper to determine if array is a modal-type array with people
function isPersonArray(arr) {
  if (!Array.isArray(arr)) return false;
  const first = arr[0];
  if (!first || typeof first !== "object") return false;
  return (
    "firstName" in first ||
    "lastName" in first ||
    "title" in first
  );
}

// Template clause renderer
export function renderTemplate(template, formValues) {
  if (!template || typeof template !== "string") return "";

  return template.replace(
    /\{\{field:([a-zA-Z0-9_]+)(?::([a-zA-Z0-9_]+))?(?::([a-zA-Z0-9_]+))?\}\}/g,
    (_, part1, part2, part3) => {
      let value = "";

      if (part3) {
        // e.g., {{field:section:field:format}}
        if (formValues[part1] && typeof formValues[part1] === "object") {
          value = formValues[part1][part2];
        }

        // Format options
        if (part3 === "formattedAmount" && value) {
          value = Number(value).toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP"
          });
        }

        if (part3 === "selectedPurposes" && Array.isArray(value)) {
          value = value.join(" and ");
        }

      } else if (part2) {
        // e.g., {{field:section:field}}
        if (formValues[part1] && typeof formValues[part1] === "object") {
          value = formValues[part1][part2];
        } else if (formValues[`${part1}.${part2}`]) {
          value = formValues[`${part1}.${part2}`];
        }

      } else {
        // e.g., {{field:field}}
        value = formValues[part1];
      }

      return value ?? "";
    }
  );
}

// Format numbers as GBP currency
export function formatCurrency(amount) {
  if (!amount) return "";
  return Number(amount).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}
