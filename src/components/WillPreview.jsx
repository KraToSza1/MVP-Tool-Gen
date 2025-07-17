import React from "react";

// Utility: Safely get value for nested properties
const getVal = (obj, key, fallback = '') =>
  (obj && obj[key] ? obj[key] : fallback);

// Example utility: full address as a single string
const getAddress = (fv) => {
  const parts = [
    fv.address1, fv.address2, fv.address3, fv.city, fv.postcode, fv.country
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '[Address]';
};

const getFullName = (fv) =>
  [fv.title, fv.firstName, fv.middleName, fv.lastName].filter(Boolean).join(' ') || '[Full Name]';

// ----------- CLAUSE TEMPLATES ------------

function clauseTestator(values) {
  return (
    <div>
      I, {getVal(values, 'title')} {getVal(values, 'firstName')} {getVal(values, 'lastName')} of {getAddress(values)}, DECLARE this to be my last Will and Testament.
    </div>
  );
}

function clauseRevocation() {
  return (
    <div>
      I revoke all former Wills and testamentary dispositions made by me.
    </div>
  );
}

function clauseSpecificGifts(values) {
  if (values.hasSpecificGifts === "Yes" && values.specificGiftsDetails) {
    return (
      <div>
        I give {values.specificGiftsDetails}
      </div>
    );
  }
  return null;
}

function clauseResiduaryEstate(values) {
  return (
    <div>
      I give my residuary estate to my Executors upon trust to sell the same and to hold the proceeds upon the trusts declared by this my Will.
    </div>
  );
}

function clauseTrustees() {
  return (
    <div>
      Any of my Trustees who is a professional person shall be entitled to charge and be paid all usual professional or other proper fees for business done, services rendered or time spent personally or by their firm in the administration of my estate, including acts which a trustee not engaged in any profession or business could have done personally.
    </div>
  );
}

function clauseOrganDonation(values) {
  if (values.organDonation === "Yes") {
    return (
      <div>
        I wish for any part of my body to be used for organ donation or scientific purposes, as my Executors see fit.
      </div>
    );
  }
  if (values.organDonation === "No") {
    return (
      <div>
        I do not wish for any part of my body to be used for organ donation or scientific purposes. I request that my Executors respect this wish.
      </div>
    );
  }
  return null;
}

function clausePersonalChattels(values) {
  return (
    <div>
      I direct that all my personal possessions not otherwise specifically given by this Will or any Codicil to it shall be distributed upon the same terms as my Residuary Estate.
      <br />
      Any Inheritance Tax arising from the gifts of my personal possessions shall be paid from my Residuary Estate so that the recipients receive these items free of tax.
    </div>
  );
}

function clauseAdministrativeProvisions() {
  return (
    <div>
      The standard provisions only of the Society of Trust and Estate Practitioners (3rd Edition) shall apply to this Will.
    </div>
  );
}

function clauseEstateAdmin(values) {
  return (
    <div>
      My Trustees shall hold my Residuary Estate upon trust to pay the income thereof to {getVal(values, 'lifeTenantName', '[Life Tenant Name]')} during {getVal(values, 'lifeTenantGender', '[his/her]')} lifetime (subject to the power to revoke/reduce below) and after {getVal(values, 'lifeTenantGender', '[his/her]')} death for {getVal(values, 'finalBeneficiaries', '[Final Beneficiaries/Distribution Details]')}...
    </div>
  );
}

function clauseAttestation() {
  return (
    <div>
      Signed by me as my last Will and Testament in the presence of the witnesses who have signed below in my presence and in the presence of each other.
    </div>
  );
}

// ----------- MAIN COMPONENT ---------------

export default function WillPreview({ formValues, open, onClose }) {
  if (!open) return null;

  // List your clauses in order, only show if function returns non-null
  const clauses = [
    { heading: "1. TESTATOR DETAILS", fn: clauseTestator },
    { heading: "2. REVOCATION CLAUSE", fn: clauseRevocation },
    { heading: "3. SPECIFIC GIFTS", fn: clauseSpecificGifts },
    { heading: "4. RESIDUARY ESTATE", fn: clauseResiduaryEstate },
    { heading: "TRUSTEES/EXECUTORS", fn: clauseTrustees },
    { heading: "5. ORGAN DONATION", fn: clauseOrganDonation },
    { heading: "6. PERSONAL CHATTELS", fn: clausePersonalChattels },
    { heading: "7. ADMINISTRATIVE PROVISIONS", fn: clauseAdministrativeProvisions },
    { heading: "ESTATE ADMINISTRATION/RESIDUE", fn: clauseEstateAdmin },
    { heading: "8. ATTESTATION CLAUSE", fn: clauseAttestation },
  ];

return (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white max-w-2xl rounded-xl shadow-lg w-full relative flex flex-col max-h-[90vh]">
      {/* Header (sticky, never scrolls out of view) */}
      <div className="sticky top-0 z-10 bg-white pb-2 pt-6 px-10 rounded-t-xl">
        <button
          className="absolute right-5 top-4 text-2xl font-bold text-gray-400 hover:text-indigo-700"
          onClick={onClose}
        >
          ×
        </button>
        <h1 className="text-3xl font-extrabold text-center mb-2">
          LAST WILL & TESTAMENT
        </h1>
        <hr className="border-indigo-200 mb-2" />
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto px-10 pb-8" style={{ maxHeight: '70vh' }}>
        {clauses.map((cl, idx) => {
          const clauseContent = cl.fn(formValues);
          if (!clauseContent) return null;
          return (
            <div key={idx} className="mb-6">
              <div className="font-bold uppercase mb-2">{cl.heading}</div>
              <div>{clauseContent}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
}

