import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { modalFieldDefinitions } from "../utils/modalFieldDefinitions";
import UniversalModal from "./UniversalModal";

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

const targetFieldId =
  field.id.toLowerCase().includes("partner")
    ? "partnerSection"
    : (
        field.id
          .replace(/^add/i, "")
          .replace(/button$/i, "")
          + "Data"
      );
  const isRepeater = field.isRepeater || false;
  const addedEntries = formValues[targetFieldId] || (isRepeater ? [] : null);

  return (
    <>
      <div className="mb-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
          {field.label}
        </button>
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
          initialValues={isRepeater ? {} : addedEntries || {}}
          onSave={data => {
            setFormValues(prev => {
              if (isRepeater) {
                const current = Array.isArray(prev[targetFieldId]) ? prev[targetFieldId] : [];
                return { ...prev, [targetFieldId]: [...current, data] };
              } else {
                return { ...prev, [targetFieldId]: data };
              }
            });
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}