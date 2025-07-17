import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import logo from '../assets/logo_resized.png';

const BORDER_COLOR = '#222';

const styles = StyleSheet.create({
  // --- COVER PAGE ---
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    padding: 0,
  },
  borderOuter: {
    position: 'absolute',
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    border: `2pt solid ${BORDER_COLOR}`,
    borderRadius: 2,
  },
  borderInner: {
    position: 'absolute',
    top: 34,
    left: 34,
    right: 34,
    bottom: 34,
    border: `0.7pt solid ${BORDER_COLOR}`,
    borderRadius: 1,
  },
  coverTitle: {
    fontSize: 26,
    textAlign: 'center',
    marginTop: 75,
    fontFamily: 'Times-Bold',
    letterSpacing: 1.1,
  },
  coverOf: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 13,
    fontFamily: 'Times-Italic',
  },
  testatorName: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 13,
    marginTop: 8,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.5,
  },
  coverLogo: {
    width: 130,
    marginTop: 50,
    alignSelf: 'center',
  },
  firmLabel: {
    fontSize: 10,
    marginTop: 28,
    textAlign: 'center',
    color: '#666',
    letterSpacing: 1.1,
    fontFamily: 'Helvetica-Bold',
  },

  // --- MAIN PAGE ---
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    backgroundColor: '#fff',
    padding: 0,
    position: 'relative',
  },
  borderContent: {
    position: 'absolute',
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    border: `1pt solid ${BORDER_COLOR}`,
    borderRadius: 2,
    zIndex: 1,
  },
  pageInnerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 29,
    paddingBottom: 24,
    zIndex: 2,
  },
  pageContent: {
    width: '100%',
    flexDirection: 'column',
  },
  heading: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textAlign: 'left',
    marginBottom: 7,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    borderBottom: `0.7pt solid ${BORDER_COLOR}`,
    paddingBottom: 1,
    marginTop: 7,
  },
  subheading: {
    fontSize: 10.5,
    fontFamily: 'Times-Bold',
    marginTop: 7,
    marginBottom: 2,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: 'Times-Roman', // plain, NOT bold
    fontSize: 10.5,
    marginRight: 3,
    textAlign: 'left',
  },
  bodyText: {
    fontSize: 10.5,
    fontFamily: 'Times-Roman',
    marginBottom: 2.5,
    lineHeight: 1.35,
    textAlign: 'left',
    paddingLeft: 18, // Indented!
  },
  bulletList: {
    marginLeft: 32, // Indent party lists further
    marginBottom: 5,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1,
    marginLeft: 6,
  },
  line: {
    borderBottom: `1pt solid ${BORDER_COLOR}`,
    width: 120,
    marginVertical: 5,
  },

  // --- SIGNATURE PAGE ---
  signatureSection: {
    marginTop: 23,
  },
  signatureLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
    marginTop: 8,
    marginBottom: 5,
  },
  signatureImage: {
    marginTop: 8,
    width: 120,
    height: 45,
    objectFit: 'contain',
  },
  witnessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 6,
  },
  witnessCol: {
    width: '44%',
  },
  witnessField: {
    fontSize: 10,
    marginBottom: 3,
    fontFamily: 'Times-Roman',
  },
  pageNum: {
    position: 'absolute',
    fontSize: 9,
    bottom: 14,
    right: 24,
    color: '#999',
    textAlign: 'right',
    zIndex: 10,
    fontFamily: 'Times-Roman',
  },
});

// --- UTILS: Normalizing, Rendering ---
function normalizePerson(obj) {
  if (!obj || typeof obj !== "object") return null;
  const flat = {};
  Object.entries(obj).forEach(([k, v]) => {
    const cleanKey = k.replace(/^[a-zA-Z0-9]+_/, "");
    flat[cleanKey] = v;
  });
  return flat;
}
function extractPeople(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(normalizePerson).filter(Boolean);
  if (typeof val === "object") {
    if (Object.keys(val).some(k => /firstName|lastName/i.test(k))) {
      return [normalizePerson(val)];
    }
    if (Object.values(val).some(Array.isArray)) {
      return Object.values(val).filter(Array.isArray).flat().map(normalizePerson).filter(Boolean);
    }
    return [normalizePerson(val)];
  }
  return [];
}
function getFullName(item) {
  if (!item) return "[Name]";
  return [
    item.title, item.firstName, item.middleName, item.lastName, item.fullName
  ].filter(Boolean).join(" ") || "[Name]";
}
function getFullAddress(item) {
  if (!item) return "";
  return [
    item.address1, item.address2, item.address3, item.postcode, item.address
  ].filter(Boolean).join(", ");
}
function renderPartyList(arr, label) {
  if (!arr || arr.length === 0)
    return <Text style={styles.bodyText}>No {label} specified.</Text>;
  return (
    <View style={styles.bulletList}>
      {arr.map((item, idx) => (
        <View style={{ marginBottom: 13, marginLeft: 0 }} key={idx}>
          {/* Main Name/Bullet */}
          <Text style={styles.bodyText}>
            <Text style={{ fontFamily: 'Times-Bold' }}>{getFullName(item)}</Text>
          </Text>
          {/* Known As, Alias, Gender */}
          {(item.knownAs || item.alias || item.gender) && (
            <Text style={styles.bodyText}>
              {item.knownAs ? `Known as: ${item.knownAs}   ` : ''}
              {item.alias ? `Alias: ${item.alias}   ` : ''}
              {item.gender ? `Gender: ${item.gender}` : ''}
            </Text>
          )}
          {/* Occupation, Relationship */}
          {(item.occupation || item.relationship) && (
            <Text style={styles.bodyText}>
              {item.occupation ? `Occupation: ${item.occupation}   ` : ''}
              {item.relationship ? `Relationship: ${item.relationship}` : ''}
            </Text>
          )}
          {/* Contact Info */}
          {(item.mobile || item.email) && (
            <Text style={styles.bodyText}>
              {item.mobile ? `Mobile: ${item.mobile}   ` : ''}
              {item.email ? `Email: ${item.email}` : ''}
            </Text>
          )}
          {/* Address */}
          {getFullAddress(item) && (
            <Text style={styles.bodyText}>
              Address: {getFullAddress(item)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

// --- MAIN PDF COMPONENT ---
const PDFDocument = ({ formValues = {} }) => {
  // ALL details on testator:
  const testatorDetails = [
    { label: "Full Name", value: getFullName(formValues) },
    { label: "Known As", value: formValues.knownAs },
    { label: "Alias", value: formValues.alias },
    { label: "Title", value: formValues.personalinformationTitle },
    { label: "Middle Name", value: formValues.middleName },
    { label: "Gender", value: formValues.gender },
    { label: "Date of Birth", value: formValues.dateOfBirth },
    { label: "Mobile", value: formValues.mobile },
    { label: "Alt Tel", value: formValues.tel2 },
    { label: "Email", value: formValues.email },
    { label: "Occupation", value: formValues.occupation },
    { label: "Postcode", value: formValues.personalinformationAddressPostcode },
    { label: "Address 1", value: formValues.personalinformationAddressAddress1 },
    { label: "Address 2", value: formValues.personalinformationAddressAddress2 },
    { label: "Address 3", value: formValues.personalinformationAddressAddress3 },
    { label: "Marital Status", value: formValues.maritalStatus },
  ];

  // All possible roles (executors, trustees, guardians, business trustees, etc)
  const peopleSections = [
    { title: "Partners", keys: ["partnerSection"] },
    { title: "Guardians", keys: ["GuardianData", "guardiansSection"] },
    { title: "Substitute Guardians", keys: ["SubstituteGuardianData", "substituteGuardiansSection"] },
    { title: "Executors", keys: ["ExecutorData", "executorsSection", "ProfessionalExecutorData"] },
    { title: "Substitute Executors", keys: ["SubstituteExecutorData", "substituteExecutorsSection", "substituteProfessionalExecutorData"] },
    { title: "Trustees", keys: ["TrusteeData", "trusteesSection", "ProfessionalTrusteeData"] },
    { title: "Substitute Trustees", keys: ["SubstituteTrusteeData", "substituteTrusteesSection", "substituteProfessionalTrusteeData"] },
    { title: "Digital Executors", keys: ["DigitalExecutorData", "digitalExecutorsSection"] },
    { title: "Business Trustees", keys: ["businessTrusteesSection", "BusinessTrusteeData"] },
  ];

  // Gifts/charity/pets
  const petProvision = formValues.provisionsForPets || formValues.petProvisionDetails || "";
  const exclusion = formValues.excludedPersonDetails || "";
  const stepProvision = formValues.stepProvision || "";
  const charityProvision = formValues.give10PercentToCharity || formValues.charityBenefitDetails || "";
  const lifetimeGifts = formValues.lifetimeGifts || "";
  const business = formValues.businessInterestDetails || "";

return (
  <Document>
    {/* COVER PAGE */}
    <Page size="A4" style={styles.coverPage}>
      <Text style={styles.coverTitle}>LAST WILL & TESTAMENT</Text>
      <Text style={styles.coverOf}>-of-</Text>
      <Text style={styles.testatorName}>{getFullName(formValues)}</Text>
      <Image style={styles.coverLogo} src={logo} />
      <Text style={styles.firmLabel}>ARISTONE SOLICITORS</Text>
    </Page>

    {/* MAIN CONTENT PAGE */}
    <Page size="A4" style={styles.page}>
      <View style={styles.pageInnerContainer}>
        <View style={styles.pageContent}>
          <Text style={styles.heading}>LAST WILL AND TESTAMENT</Text>

          {/* 1. TESTATOR DETAILS */}
          <View wrap={false}>
            <Text style={styles.subheading}>1. TESTATOR DETAILS</Text>
            <Text style={styles.bodyText}>
              <Text style={styles.label}>Full Name:</Text> {getFullName(formValues) || '[N/A]'}
            </Text>
          </View>
          {testatorDetails.slice(1).map((detail, i) => (
            <Text key={i} style={styles.bodyText}>
              <Text style={styles.label}>{detail.label}:</Text> {detail.value || '[N/A]'}
            </Text>
          ))}

          {/* 2. PEOPLE SECTIONS */}
          {peopleSections.map(section => {
            const peopleArr = section.keys
              .map(k => extractPeople(formValues[k]))
              .flat();
            if (peopleArr.length === 0) return null;
            // Only keep heading + first item together
            return (
              <React.Fragment key={section.title}>
                <View wrap={false}>
                  <Text style={styles.subheading}>{section.title.toUpperCase()}</Text>
                  {peopleArr.length > 0 && (
                    renderPartyList([peopleArr[0]], section.title.toLowerCase())
                  )}
                </View>
                {peopleArr.slice(1).map((item, idx) =>
                  renderPartyList([item], section.title.toLowerCase())
                )}
              </React.Fragment>
            );
          })}

          {/* 3. FOREIGN ASSETS & WILLS */}
          <View wrap={false}>
            <Text style={styles.subheading}>FOREIGN ASSETS & WILLS</Text>
            <Text style={styles.bodyText}>Assets abroad: {formValues.assetsAbroad || '[N/A]'}</Text>
          </View>
          <Text style={styles.bodyText}>Property in EU/EEA: {formValues.propertyInEU || '[N/A]'}</Text>
          <Text style={styles.bodyText}>English law applies to EU assets: {formValues.englishLawGovernsEUAssets || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Testator UK National/Habitual: {formValues.testatorUKNationalOrHabitual || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Foreign Will NOT revoked: {formValues.foreignWillNotRevoked || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Will applies only to UK: {formValues.willAppliesToUK || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Foreign Will Location: {formValues.foreignWillLocation || '[N/A]'}</Text>

          {/* 4. GIFTS & CHARITIES */}
          <View wrap={false}>
            <Text style={styles.subheading}>GIFTS & CHARITIES</Text>
            <Text style={styles.bodyText}>Monetary Gifts: {formValues.monetaryGiftsDetails || '[N/A]'}</Text>
          </View>
          <Text style={styles.bodyText}>Specific Gifts: {formValues.specificGiftsDetails || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Charity: {formValues.charityProvision || '[N/A]'}</Text>

          {/* 5. BENEFICIARIES */}
          <View break>
            <Text style={styles.subheading}>BENEFICIARIES</Text>
            {renderPartyList([
              ...extractPeople(formValues.finalBeneficiariesSection),
              ...extractPeople(formValues.BeneficiariesData)
            ], "beneficiaries")}
          </View>

          {/* 6. OTHER WISHES */}
          <View wrap={false}>
            <Text style={styles.bodyText}>Pet Provision: {petProvision || '[N/A]'}</Text>
          </View>
          <Text style={styles.bodyText}>Exclusions: {exclusion || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Step Provision: {stepProvision || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Charity: {charityProvision || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Lifetime Gifts: {lifetimeGifts || '[N/A]'}</Text>
          <Text style={styles.bodyText}>Business Interests: {business || '[N/A]'}</Text>

          {/* 7. ORGAN DONATION */}
          <View wrap={false}>
            <Text style={styles.subheading}>ORGAN DONATION</Text>
            <Text style={styles.bodyText}>
              {formValues.organDonationPreference || formValues.organDonation || '[N/A]'}
            </Text>
          </View>
          <Text style={styles.bodyText}>
            Specific organs to donate: {formValues.specificOrgansToDonate || '[N/A]'}
          </Text>
          <Text style={styles.bodyText}>
            Specific organs to exclude: {formValues.specificOrgansToExclude || '[N/A]'}
          </Text>
          <Text style={styles.bodyText}>
            Organ Purpose: {formValues.organPurposeGroup || '[N/A]'}
          </Text>

          {/* 8. FUNERAL ARRANGEMENTS */}
          <View wrap={false}>
            <Text style={styles.subheading}>FUNERAL ARRANGEMENTS</Text>
            <Text style={styles.bodyText}>
              {formValues.specifyFuneralArrangements || '[N/A]'}
            </Text>
          </View>
          <Text style={styles.bodyText}>
            Burial or Cremation: {formValues.burialOrCremation || '[N/A]'}
          </Text>
          <Text style={styles.bodyText}>
            Other funeral requirements: {formValues.otherFuneralRequirements || '[N/A]'}
          </Text>
          <Text style={styles.bodyText}>
            Funeral Wishes: {formValues.funeralWishes || '[N/A]'}
          </Text>

          {/* 9. ADMINISTRATIVE PROVISIONS */}
          <View wrap={false}>
            <Text style={styles.subheading}>ADMINISTRATIVE PROVISIONS</Text>
            <Text style={styles.bodyText}>
              The standard provisions only of the Society of Trust and Estate Practitioners (3rd Edition) shall apply to this Will.
            </Text>
          </View>

          {/* 10. RESIDUARY ESTATE & DISTRIBUTION */}
          <View wrap={false}>
            <Text style={styles.subheading}>RESIDUARY ESTATE & DISTRIBUTION</Text>
            <Text style={styles.bodyText}>
              I give my residuary estate to my Executors upon trust to sell the same and to hold the proceeds upon the trusts declared by this my Will.
            </Text>
          </View>
          <Text style={styles.bodyText}>
            My Trustees shall hold my Residuary Estate upon trust to pay the income thereof to {formValues.lifeTenantName || '[Life Tenant Name]'} during {formValues.lifeTenantGender === "Female" ? "her" : "his/her"} lifetime and after {formValues.lifeTenantGender === "Female" ? "her" : "his/her"} death for {formValues.finalBeneficiaries || '[Final Beneficiaries/Distribution Details]'}.
          </Text>
          <Text style={styles.bodyText}>
            Signed by me as my last Will and Testament in the presence of the witnesses who have signed below in my presence and in the presence of each other.
          </Text>
        </View>
      </View>
      <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} fixed />
    </Page>

    {/* SIGNATURE PAGE */}
    <Page size="A4" style={styles.page}>
      <View style={styles.borderContent} fixed />
      <View style={styles.pageInnerContainer}>
        <View style={styles.pageContent}>
          <View style={styles.signatureSection}>
            <Text style={styles.bodyText}>Signed by, to give effect to this Will, on</Text>
            <Text style={{ marginTop: 15, marginLeft: 25 }}>Date</Text>
            <View style={styles.line} />
            <Text style={styles.signatureLabel}>SIGNATURE</Text>
            {formValues.testatorSignature ? (
              <Image src={formValues.testatorSignature} style={styles.signatureImage} />
            ) : (
              <View style={styles.line} />
            )}
          </View>
          <Text style={styles.bodyText} break>
            We confirm this Will was signed first by in our presence and then by both of us in the presence of.
          </Text>
          <View style={styles.witnessRow}>
            <View style={styles.witnessCol}>
              <Text style={styles.witnessField}>Witness 1</Text>
              <Text style={styles.signatureLabel}>SIGNATURE</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Full name</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.witnessCol}>
              <Text style={styles.witnessField}>Witness 2</Text>
              <Text style={styles.signatureLabel}>SIGNATURE</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Full name</Text>
              <View style={styles.line} />
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} fixed />
    </Page>
  </Document>
);

}

export default PDFDocument;
