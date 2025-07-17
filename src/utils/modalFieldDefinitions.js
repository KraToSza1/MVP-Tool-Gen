export const modalFieldDefinitions = {
  guardian: [
    { id: "firstName", type: "text", label: "First Name(s)*", required: true },
    { id: "middleNames", type: "text", label: "Middle Name(s)" },
    { id: "lastName", type: "text", label: "Last Name*", required: true },
    { id: "knownAs", type: "text", label: "Known As" },
    { id: "alias", type: "text", label: "Alias" },
    { id: "dateOfBirth", type: "date", label: "Date of Birth*", required: true },
    { id: "relationship", type: "text", label: "Relationship to Child" },
    { id: "gender", type: "radio", label: "Gender*", required: true, options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" }
    ] },
    { id: "mobile", type: "tel", label: "Mobile*", required: true },
    { id: "email", type: "email", label: "Email Address*", required: true },
    { id: "address1", type: "text", label: "Address 1*", required: true },
    { id: "address2", type: "text", label: "Address 2" },
    { id: "address3", type: "text", label: "Address 3" },
    { id: "signature", type: "signature", label: "Signature (optional)" }
  ],
  partner: [
    { id: "title", type: "radio", label: "Title*", required: true, options: [
      { value: "Mr", label: "Mr" },
      { value: "Mrs", label: "Mrs" },
      { value: "Miss", label: "Miss" },
      { value: "Ms", label: "Ms" },
      { value: "Dr", label: "Dr" },
      { value: "Prof", label: "Prof" },
      { value: "Sir", label: "Sir" },
      { value: "Dame", label: "Dame" },
      { value: "Lord", label: "Lord" },
      { value: "Lady", label: "Lady" },
      { value: "Other", label: "Other" }
    ]},
    { id: "firstName", type: "text", label: "First Name(s)*", required: true },
    { id: "middleNames", type: "text", label: "Middle Name(s)" },
    { id: "lastName", type: "text", label: "Last Name*", required: true },
    { id: "knownAs", type: "text", label: "Known As" },
    { id: "alias", type: "text", label: "Alias" },
    { id: "dateOfBirth", type: "date", label: "Date of Birth*", required: true },
    { id: "gender", type: "radio", label: "Gender*", required: true, options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" }
    ]},
    { id: "mobile", type: "tel", label: "Mobile*", required: true },
    { id: "email", type: "email", label: "Email Address*", required: true },
    { id: "address1", type: "text", label: "Address 1*", required: true },
    { id: "address2", type: "text", label: "Address 2" },
    { id: "address3", type: "text", label: "Address 3" },
    { id: "signature", type: "signature", label: "Signature (optional)" }
  ],
  executor: [
    { id: "title", type: "radio", label: "Title*", required: true, options: [
      { value: "Mr", label: "Mr" },
      { value: "Mrs", label: "Mrs" },
      { value: "Miss", label: "Miss" },
      { value: "Ms", label: "Ms" },
      { value: "Dr", label: "Dr" },
      { value: "Prof", label: "Prof" },
      { value: "Sir", label: "Sir" },
      { value: "Dame", label: "Dame" },
      { value: "Lord", label: "Lord" },
      { value: "Lady", label: "Lady" },
      { value: "Other", label: "Other" }
    ]},
    { id: "firstName", type: "text", label: "First Name(s)*", required: true },
    { id: "middleNames", type: "text", label: "Middle Name(s)" },
    { id: "lastName", type: "text", label: "Last Name*", required: true },
    { id: "knownAs", type: "text", label: "Known As" },
    { id: "alias", type: "text", label: "Alias" },
    { id: "dateOfBirth", type: "date", label: "Date of Birth*", required: true },
    { id: "relationship", type: "text", label: "Relationship*" },
    { id: "gender", type: "radio", label: "Gender*", required: true, options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" }
    ]},
    { id: "mobile", type: "tel", label: "Mobile*", required: true },
    { id: "email", type: "email", label: "Email Address*", required: true },
    { id: "address1", type: "text", label: "Address 1*", required: true },
    { id: "address2", type: "text", label: "Address 2" },
    { id: "address3", type: "text", label: "Address 3" },
    { id: "signature", type: "signature", label: "Signature (optional)" }
  ]
  // ...add more as needed!
};
