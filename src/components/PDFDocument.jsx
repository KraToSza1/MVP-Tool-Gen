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
    fontSize: 28,
    textAlign: 'center',
    marginTop: 140,
    fontFamily: 'Times-Bold',
    letterSpacing: 1.1,
    lineHeight: 1.1,
  },
  coverOf: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
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
    width: 90,
    marginTop: 40,
    alignSelf: 'center',
  },
  firmLabel: {
    fontSize: 11,
    marginTop: 36,
    textAlign: 'center',
    color: '#6b46c1',
    letterSpacing: 1.1,
    fontFamily: 'Helvetica-Bold',
  },
  // Main page
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
    padding: 45,
    paddingTop: 38,
    paddingBottom: 36,
    zIndex: 2,
  },
  pageContent: {
    width: '100%',
    flexDirection: 'column',
  },
  heading: {
    fontSize: 13.5,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'none',
    marginTop: 10,
  },
  section: {
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontFamily: 'Times-Bold',
    marginBottom: 4,
    marginTop: 10,
  },
  clause: {
    fontSize: 10.7,
    marginBottom: 4,
    fontFamily: 'Times-Roman',
    lineHeight: 1.3,
    textAlign: 'left',
  },
  clauseNum: {
    fontFamily: 'Times-Bold',
  },
  // Signature page
  signatureSection: {
    marginTop: 18,
    marginBottom: 10,
  },
  signatureLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
    marginTop: 8,
    marginBottom: 5,
  },
  signatureImage: {
    marginTop: 8,
    width: 120,
    height: 45,
    objectFit: 'contain',
  },
  line: {
    borderBottom: `1pt solid ${BORDER_COLOR}`,
    width: 120,
    marginVertical: 5,
  },
  witnessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  witnessCol: {
    width: '47%',
    border: `0.7pt solid #222`,
    padding: 8,
    borderRadius: 1,
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

// UTILS
function getFullName(item) {
  if (!item) return "[Name]";
  if (item.fullName) return item.fullName;
  return [item.title, item.firstName, item.middleName, item.lastName]
    .filter(Boolean)
    .join(" ");
}


const PDFDocument = ({ formValues = {} }) => {
  return (
    <Document>
      {/* --- COVER PAGE --- */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.borderOuter} fixed />
        <View style={styles.borderInner} fixed />
        <Text style={styles.coverTitle}>
          Last Will{'\n'}and Testament
        </Text>
        <Text style={styles.coverOf}>-of-</Text>
        <Text style={styles.testatorName}>
          {getFullName(formValues)}
        </Text>
        <Image style={styles.coverLogo} src={logo} />
        <Text style={styles.firmLabel}>ARISTONE SOLICITORS</Text>
      </Page>

      {/* --- MAIN CONTENT PAGE --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.borderContent} fixed />
        <View style={styles.pageInnerContainer}>
          <Text style={styles.heading}>Last Will and Testament</Text>

          <View style={styles.section}>
            <Text style={styles.clause}>
              This is the Will of my <Text style={{ fontFamily: 'Times-Bold' }}>{getFullName(formValues)}</Text>.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.clause}><Text style={styles.clauseNum}>1. Revoking Previous Wills</Text></Text>
            <Text style={styles.clause}>
              This is my last Will. It replaces and revokes any earlier Wills I have made.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.clause}><Text style={styles.clauseNum}>2. Organ Donation</Text></Text>
            <Text style={styles.clause}>
              I wish my body and all of my organs to be available for organ donation, anatomical examination, therapeutic, medical and scientific purposes.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.clause}><Text style={styles.clauseNum}>3. Appointment of Executors and Trustees</Text></Text>
            <Text style={styles.clause}>
              3.1. I appoint{" "}
              <Text style={{ fontFamily: 'Times-Bold' }}>
                {formValues.executorData?.length > 0
                  ? getFullName(formValues.executorData[0])
                  : "Mr John Smith"}
              </Text>{" "}
              to be my sole Executor and Trustee.
            </Text>
            <Text style={styles.clause}>
              3.2. In the rest of this Will, 'Trustees' means my Executors and the Trustees of any trust created under this Will, either appointed by me in this Will or appointed later under the terms of a trust.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.clause}><Text style={styles.clauseNum}>4. Definition of Estate</Text></Text>
            <Text style={styles.clause}>
              My estate shall mean all my legal and beneficial interests in property, money and possessions.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.clause}><Text style={styles.clauseNum}>5. Administration of My Estate</Text></Text>
            <Text style={styles.clause}>
              My Executors may sell or convert any or all of the remaining assets as they consider appropriate and then shall hold my estate in trust on the following terms:
            </Text>
            <Text style={styles.clause}>
              5.1. To pay my debts and any funeral costs, executor costs or administration expenses.
            </Text>
            <Text style={styles.clause}>
              5.2. To pay any tax or duty relating to assets passing under this Will or due as a result of my death on any gifts I made during my lifetime, unless this Will specifies otherwise.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.clause}><Text style={styles.clauseNum}>6. STEP Provisions</Text></Text>
            <Text style={styles.clause}>
              The standard provisions and all of the special provisions of the Society of Trust and Estate Practitioners (3rd Edition) apply to this Will.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.clause}><Text style={styles.clauseNum}>7. Final Clause</Text></Text>
            <Text style={styles.clause}>
              This is the last clause of my Will and is only followed by the attestation statement.
            </Text>
          </View>

          {/* ----- DYNAMIC FORM-DATA INSERTIONS ----- */}

          {formValues.guardianData?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>8. Appointment of Guardians</Text></Text>
              <Text style={styles.clause}>
                I appoint {formValues.guardianData.map(g => getFullName(g)).join(", ")} as guardian{formValues.guardianData.length > 1 ? "s" : ""} of my minor children.
              </Text>
            </View>
          )}

          {formValues.executorData?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>9. Executors</Text></Text>
              <Text style={styles.clause}>
                The following persons shall act as my Executors: {formValues.executorData.map(e => getFullName(e)).join(", ")}.
              </Text>
            </View>
          )}

          {formValues.trusteeData?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>10. Trustees</Text></Text>
              <Text style={styles.clause}>
                I appoint the following as Trustees of my Will: {formValues.trusteeData.map(t => getFullName(t)).join(", ")}.
              </Text>
            </View>
          )}

          {formValues.legacyData?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>11. Gifts and Legacies</Text></Text>
              {formValues.legacyData.map((gift, i) => (
                <Text key={i} style={styles.clause}>
                  I give {gift.description} to {gift.beneficiaryName || "[Beneficiary]"}.
                </Text>
              ))}
            </View>
          )}

          {formValues.funeralWishes && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>12. Funeral Wishes</Text></Text>
              <Text style={styles.clause}>
                {formValues.funeralWishes}
              </Text>
            </View>
          )}

          {formValues.digitalExecutorData?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>13. Digital Executor</Text></Text>
              <Text style={styles.clause}>
                I appoint {formValues.digitalExecutorData.map(d => getFullName(d)).join(", ")} to manage my digital assets and accounts.
              </Text>
            </View>
          )}

          {formValues.professionalExecutorData?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>14. Professional Executor</Text></Text>
              {formValues.professionalExecutorData.map((p, i) => (
                <Text key={i} style={styles.clause}>
                  I appoint {p.professionalExecutorType === "Other" ? p.customFirmName : p.professionalExecutorType} as Professional Executor.
                </Text>
              ))}
            </View>
          )}

          {formValues.residueData && formValues.residueData.beneficiaries?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.clause}><Text style={styles.clauseNum}>15. Residue of Estate</Text></Text>
              <Text style={styles.clause}>
                I leave the residue of my estate to: {formValues.residueData.beneficiaries.map(b => getFullName(b)).join(", ")}.
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} fixed />
      </Page>

      {/* --- SIGNATURE PAGE --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.borderContent} fixed />
        <View style={styles.pageInnerContainer}>
          <View style={styles.signatureSection}>
            <Text style={styles.clause}>
              Signed by my <Text style={{ fontFamily: 'Times-Bold' }}>{getFullName(formValues)}</Text>, to give effect to this Will, on
            </Text>
            <Text style={{ marginTop: 15, marginLeft: 25 }}>{formValues.signatureDate || "Date"}</Text>
            <View style={styles.line} />
            <Text style={styles.signatureLabel}>SIGNATURE</Text>
            {formValues.testatorSignature ? (
              <Image src={formValues.testatorSignature} style={styles.signatureImage} />
            ) : (
              <View style={styles.line} />
            )}
          </View>
          <Text style={styles.clause} break>
            We confirm this Will was signed first by my <Text style={{ fontFamily: 'Times-Bold' }}>{getFullName(formValues)}</Text> in our presence and then by both of us in the presence of my <Text style={{ fontFamily: 'Times-Bold' }}>{getFullName(formValues)}</Text>.
          </Text>
          <View style={styles.witnessRow}>
            <View style={styles.witnessCol}>
              <Text style={styles.signatureLabel}>Witness 1</Text>
              <Text style={styles.signatureLabel}>SIGNATURE</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Full name</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Address</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Phone</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Occupation</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.witnessCol}>
              <Text style={styles.signatureLabel}>Witness 2</Text>
              <Text style={styles.signatureLabel}>SIGNATURE</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Full name</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Address</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Phone</Text>
              <View style={styles.line} />
              <Text style={styles.witnessField}>Occupation</Text>
              <View style={styles.line} />
            </View>
          </View>
        </View>
        <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

export default PDFDocument;
