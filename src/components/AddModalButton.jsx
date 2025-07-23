import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { modalFieldDefinitions } from "../utils/modalFieldDefinitions";
import UniversalModal from "./UniversalModal";

// --- Figure out the modal key for field definitions ---
function getModalKey(field) {
  if (field.modalKey) return field.modalKey;
  if (field.id.toLowerCase().includes("guardian")) return "guardian";
  if (field.id.toLowerCase().includes("partner")) return "partner";
  if (field.id.toLowerCase().includes("executor")) return "executor";
  return field.id.replace(/add|button/gi, "").toLowerCase();
}

export default function AddModalButton({ field, formValues, setFormValues }) {
  const modalKey = getModalKey(field);
  const modalFields = field.modalFields || modalFieldDefinitions[modalKey];
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // --- Target field in formValues (store repeaters as arrays) ---
  let targetFieldId = "";
  if (field.id.toLowerCase().includes("partner")) targetFieldId = "partnerSection";
  else if (field.id.toLowerCase().includes("guardian")) targetFieldId = "guardianData"; // always use Section for consistency!
  else targetFieldId = (
    field.id.replace(/^add/i, "")
    .replace(/button$/i, "")
    + "Data"
  );

  // Always treat Guardians/Partners as repeater (array)
  const isRepeater =
    field.isRepeater === true ||
    field.id.toLowerCase().includes("partner") ||
    field.id.toLowerCase().includes("guardian");
  const addedEntries = Array.isArray(formValues[targetFieldId]) ? formValues[targetFieldId] : [];

  // --- Debug logs ---
  console.log("[AddModalButton] field.id:", field.id);
  console.log("[AddModalButton] modalKey:", modalKey);
  console.log("[AddModalButton] targetFieldId:", targetFieldId);
  console.log("[AddModalButton] modalFields:", modalFields);
  console.log("[AddModalButton] isRepeater:", isRepeater);
  console.log("[AddModalButton] addedEntries:", addedEntries);
  console.log("[AddModalButton] showModal:", showModal, "editIndex:", editIndex);

  // --- Save handler for add/edit ---
  const handleSave = (data) => {
    console.log("[AddModalButton] handleSave called with data:", data);
    setFormValues(prev => {
      let updated;
      if (isRepeater) {
        if (editIndex !== null) {
          updated = prev[targetFieldId].map((item, i) => (i === editIndex ? data : item));
          console.log("[AddModalButton] Editing entry at index", editIndex, ":", updated);
        } else {
          const current = Array.isArray(prev[targetFieldId]) ? prev[targetFieldId] : [];
          updated = [...current, data];
          console.log("[AddModalButton] Adding new entry:", updated);
        }
        return { ...prev, [targetFieldId]: updated };
      } else {
        console.log("[AddModalButton] Setting single entry:", data);
        return { ...prev, [targetFieldId]: data };
      }
    });
    setShowModal(false);
    setEditIndex(null);
    console.log("[AddModalButton] Modal closed after save");
  };

  // --- Compute "existingPeople" for UniversalModal's dropdown ---
  let existingPeople = [];
  if (
    isRepeater &&
    Array.isArray(addedEntries) &&
    addedEntries.length > 0
  ) {
    existingPeople = addedEntries;
  }
  // To allow dropdown for all repeaters, just use the above block only.

  return (
    <>
      <div className="mb-2 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowModal(true);
              setEditIndex(null);
              console.log("[AddModalButton] Opening modal for", field.label, "| editIndex:", editIndex);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
            {field.label}
          </button>
        </div>
        {/* CHIP/LIST UI REMOVED - Add your custom display here if needed */}
      </div>
      {!modalFields && (
        <div className="text-red-500 text-xs mb-2">
          No modal fields found for this Add button! Check modalFieldDefinitions.js for “{modalKey}”
        </div>
      )}
      {modalFields && showModal && (
        <UniversalModal
          show={showModal}
          title={field.label || "Add Entry"}
          fields={modalFields}
          initialValues={
            isRepeater && editIndex !== null
              ? addedEntries[editIndex]
              : (isRepeater ? {} : addedEntries || {})
          }
          existingPeople={existingPeople}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditIndex(null);
            console.log("[AddModalButton] Modal closed without save");
          }}
        />
      )}
    </>
  );
}
