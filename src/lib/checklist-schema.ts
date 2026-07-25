// // // Structure of the OT Handover Checklist form. Stored as JSONB `data` in checklists.

// // export type FieldType = "text" | "checkbox" | "checkbox_with_text" | "yesno";

// // export interface FieldDef {
// //   key: string;
// //   label: string;
// //   type: FieldType;
// //   placeholder?: string;
// //   inline?: boolean;
// // }

// // export interface SectionDef {
// //   key: string;
// //   title: string;
// //   fields: FieldDef[];
// // }

// // export const CHECKLIST_SECTIONS: SectionDef[] = [
// //   {
// //     key: "header",
// //     title: "Ward Sister → OT Technician",
// //     fields: [
// //       { key: "patient_name", label: "Patient name", type: "text" },
// //       { key: "weight", label: "Weight", type: "text", inline: true },
// //       { key: "room_no", label: "Room No", type: "text", inline: true },
// //       { key: "ac_status", label: "AC / Non AC", type: "text", inline: true, placeholder: "AC or Non AC" },
// //       { key: "consent_lscs", label: "Consent for LSCS signed and verified", type: "checkbox" },
// //     ],
// //   },
// //   {
// //     key: "preop_assessment",
// //     title: "1. Pre-operative Assessment",
// //     fields: [
// //       { key: "cbc_hb", label: "CBC / Hb", type: "checkbox" },
// //       { key: "blood_group", label: "Blood Group & Rh typing", type: "checkbox" },
// //       { key: "blood_sugar", label: "Blood Sugar", type: "checkbox" },
// //       { key: "urine_routine", label: "Urine Routine", type: "checkbox" },
// //       { key: "coagulation", label: "Coagulation profile (if indicated)", type: "checkbox" },
// //       { key: "lft_rft", label: "LFT / RFT (if indicated)", type: "checkbox" },
// //       { key: "viral_markers", label: "Viral markers (HIV, HBsAg, HCV)", type: "checkbox" },
// //       { key: "other_investigation", label: "Other", type: "checkbox_with_text" },
// //       { key: "ob_ultrasound", label: "Obstetric ultrasound report available", type: "checkbox" },
// //       { key: "high_risk", label: "High-risk pregnancy identified", type: "yesno" },
// //       { key: "high_risk_details", label: "High-risk details", type: "text" },
// //     ],
// //   },
// //   {
// //     key: "fasting",
// //     title: "2. Fasting Status",
// //     fields: [
// //       { key: "nbm_instructed", label: "NBM instructed", type: "checkbox" },
// //       { key: "last_meal", label: "Last meal taken at", type: "text" },
// //       { key: "last_fluids", label: "Last clear fluids taken at", type: "text" },
// //     ],
// //   },
// //   {
// //     key: "bowel_bladder",
// //     title: "3. Bowel & Bladder",
// //     fields: [
// //       { key: "last_stool", label: "Last stool passed", type: "text" },
// //       { key: "foley_catheter", label: "Foley catheter inserted", type: "text" },
// //       { key: "urine_output", label: "Urine output adequate", type: "text" },
// //     ],
// //   },
// //   {
// //     key: "preop_meds",
// //     title: "4. Pre-operative Medications",
// //     fields: [
// //       { key: "antibiotics", label: "Pre-operative antibiotics given (Name)", type: "checkbox_with_text" },
// //       { key: "inj_pantop", label: "INJ. PANTOP", type: "checkbox" },
// //       { key: "inj_vomikind", label: "INJ. VOMIKIND", type: "checkbox" },
// //     ],
// //   },
// //   {
// //     key: "complications",
// //     title: "5. Medical & Obstetric Complications",
// //     fields: [
// //       { key: "pih", label: "PIH / Preeclampsia", type: "checkbox" },
// //       { key: "gdm", label: "Gestational Diabetes", type: "checkbox" },
// //       { key: "cardiac", label: "Cardiac disease", type: "checkbox" },
// //       { key: "thyroid", label: "Thyroid disorder", type: "checkbox_with_text", placeholder: "Hypo / Hyper" },
// //       { key: "asthma", label: "Asthma", type: "checkbox" },
// //       { key: "anemia", label: "Anemia", type: "checkbox" },
// //       { key: "previous_lscs", label: "Previous LSCS", type: "checkbox" },
// //       { key: "placenta_previa", label: "Placenta Previa / Accrete", type: "checkbox" },
// //       { key: "multiple_pregnancy", label: "Multiple pregnancy", type: "checkbox" },
// //       { key: "other_complications", label: "Other complications", type: "checkbox_with_text" },
// //     ],
// //   },
// //   {
// //     key: "blood",
// //     title: "6. Blood Availability",
// //     fields: [
// //       { key: "blood_group_type", label: "Blood group & type", type: "text" },
// //       { key: "blood_reserved", label: "Blood reserved (Units)", type: "text" },
// //       { key: "ready_in_hospital", label: "Ready in hospital", type: "checkbox" },
// //       { key: "blood_cross_matched", label: "Blood cross-matched", type: "checkbox" },
// //     ],
// //   },
// //   {
// //     key: "stem_cell",
// //     title: "7. Stem Cell Collection",
// //     fields: [
// //       { key: "stem_cell_planned", label: "Stem cell collection planned", type: "yesno" },
// //       { key: "kit_available", label: "Collection kit available in OT", type: "checkbox" },
// //     ],
// //   },
// //   {
// //     key: "anesthesia_readiness",
// //     title: "8. Anesthesia Readiness",
// //     fields: [
// //       { key: "anesthetist_informed", label: "Anesthetist informed and available", type: "checkbox" },
// //       { key: "anesthetist_name", label: "Anesthetist Name", type: "text" },
// //       { key: "difficult_airway", label: "Difficult airway anticipated", type: "yesno" },
// //       { key: "allergy_informed", label: "Allergy history informed", type: "checkbox" },
// //     ],
// //   },
// //   {
// //     key: "pediatrician",
// //     title: "9. Pediatrician",
// //     fields: [
// //       { key: "pediatrician_informed", label: "Pediatrician / Neonatologist informed", type: "checkbox" },
// //       { key: "pediatrician_name", label: "Pediatrician Name", type: "text" },
// //       { key: "amount_to_pay", label: "Amount to pay", type: "text" },
// //     ],
// //   },
// //   {
// //     key: "ot_staffing",
// //     title: "10. OT Staffing",
// //     fields: [
// //       { key: "wash_sister", label: "Scrub Team — Wash Sister", type: "text" },
// //       { key: "support_team", label: "Support Team", type: "text" },
// //       { key: "anesthesia_sister", label: "Anesthesia Sister / Technician", type: "text" },
// //       { key: "primary_consultant", label: "Primary Surgeon / Consultant", type: "text" },
// //     ],
// //   },
// //   {
// //     key: "patient_prep",
// //     title: "11. Patient Preparation",
// //     fields: [
// //       { key: "surgical_consent", label: "Surgical consent verified", type: "checkbox" },
// //       { key: "anesthesia_consent", label: "Anesthesia consent verified", type: "checkbox" },
// //       { key: "transfusion_consent", label: "Blood transfusion consent available (if applicable)", type: "checkbox" },
// //       { key: "jewelry_removed", label: "Jewelry / dentures removed", type: "checkbox" },
// //       { key: "ot_gown", label: "OT gown and cap worn", type: "checkbox" },
// //       { key: "iv_line", label: "IV line secured (18G / 16G if high risk)", type: "checkbox" },
// //       { key: "three_way_cannula", label: "3-way cannula", type: "checkbox" },
// //       { key: "vitals_stable", label: "Vital signs stable and recorded", type: "checkbox" },
// //       { key: "fhr_documented", label: "Fetal heart rate documented before shifting", type: "checkbox" },
// //     ],
// //   },
// //   {
// //     key: "special",
// //     title: "12. Special Requirements",
// //     fields: [
// //       { key: "placenta_tray", label: "Placenta previa / accrete tray ready", type: "checkbox" },
// //       { key: "pph_tray", label: "PPH tray ready", type: "checkbox" },
// //       { key: "cell_saver", label: "Cell saver arranged (if available)", type: "checkbox" },
// //       { key: "icu_bed", label: "ICU / HDU bed reserved (if required)", type: "checkbox" },
// //       { key: "consultant_informed", label: "Additional consultant informed (if required)", type: "checkbox" },
// //     ],
// //   },
// //   {
// //     key: "handover",
// //     title: "Handover",
// //     fields: [
// //       { key: "remarks", label: "Remarks", type: "text" },
// //       { key: "ward_sister_name", label: "Ward Sister Name & Signature", type: "text" },
// //       { key: "ot_tech_name", label: "OT Technician Name & Signature", type: "text" },
// //       { key: "handover_date", label: "Date", type: "text", placeholder: "YYYY-MM-DD" },
// //       { key: "handover_time", label: "Time", type: "text", placeholder: "HH:MM" },
// //       { key: "status_accepted", label: "Final OT Takeover Status: Accepted for OT", type: "checkbox" },
// //       { key: "status_deficiency", label: "Deficiency informed and corrected before shifting", type: "checkbox" },
// //       { key: "shifted_to_ot_at", label: "Shifted to OT at (hrs)", type: "text" },
// //     ],
// //   },
// // ];

// // export type ChecklistData = Record<string, string | boolean>;

// // export function emptyChecklist(): ChecklistData {
// //   const out: ChecklistData = {};
// //   for (const s of CHECKLIST_SECTIONS) {
// //     for (const f of s.fields) {
// //       out[f.key] = f.type === "text" || f.type === "yesno" || f.type === "checkbox_with_text" ? "" : false;
// //       if (f.type === "checkbox_with_text") out[`${f.key}__checked`] = false;
// //     }
// //   }
// //   return out;
// // }


// // Structure of the OT Handover Checklist form. Stored as JSONB `data` in checklists.

// export type FieldType =
//   | "text"
//   | "checkbox"
//   | "checkbox_with_text"
//   | "yesno"
//   | "select"
//   | "datetime";

// export interface FieldDef {
//   key: string;
//   label: string;
//   type: FieldType;
//   placeholder?: string;
//   inline?: boolean;

//   // Used only by select fields
//   options?: string[];

//   // Used only by datetime fields
//   autoNow?: boolean;
// }

// export interface SectionDef {
//   key: string;
//   title: string;
//   fields: FieldDef[];
// }

// export const CHECKLIST_SECTIONS: SectionDef[] = [
//   {
//     key: "header",
//     title: "Ward Sister → OT Technician",
//     fields: [
//       {
//         key: "patient_name",
//         label: "Patient name",
//         type: "text",
//       },
//       {
//         key: "weight",
//         label: "Weight",
//         type: "text",
//         inline: true,
//       },
//       {
//         key: "room_no",
//         label: "Room No",
//         type: "text",
//         inline: true,
//       },

//       // CHANGED
//       {
//         key: "ac_status",
//         label: "AC / Non AC",
//         type: "select",
//         inline: true,
//         options: ["AC", "Non AC"],
//       },

//       {
//         key: "consent_lscs",
//         label: "Consent for LSCS signed and verified",
//         type: "checkbox",
//       },
//     ],
//   },

//   {
//     key: "preop_assessment",
//     title: "1. Pre-operative Assessment",
//     fields: [
//       { key: "cbc_hb", label: "CBC / Hb", type: "checkbox" },
//       { key: "blood_group", label: "Blood Group & Rh typing", type: "checkbox" },
//       { key: "blood_sugar", label: "Blood Sugar", type: "checkbox" },
//       { key: "urine_routine", label: "Urine Routine", type: "checkbox" },
//       { key: "coagulation", label: "Coagulation profile (if indicated)", type: "checkbox" },
//       { key: "lft_rft", label: "LFT / RFT (if indicated)", type: "checkbox" },
//       { key: "viral_markers", label: "Viral markers (HIV, HBsAg, HCV)", type: "checkbox" },

//       // Textbox now appears only when checked (handled by ChecklistForm)
//       {
//         key: "other_investigation",
//         label: "Other",
//         type: "checkbox_with_text",
//       },

//       { key: "ob_ultrasound", label: "Obstetric ultrasound report available", type: "checkbox" },
//       { key: "high_risk", label: "High-risk pregnancy identified", type: "yesno" },
//       { key: "high_risk_details", label: "High-risk details", type: "text" },
//     ],
//   },

//   {
//     key: "fasting",
//     title: "2. Fasting Status",
//     fields: [
//       { key: "nbm_instructed", label: "NBM instructed", type: "checkbox" },
//       { key: "last_meal", label: "Last meal taken at", type: "text" },
//       { key: "last_fluids", label: "Last clear fluids taken at", type: "text" },
//     ],
//   },

//   {
//     key: "bowel_bladder",
//     title: "3. Bowel & Bladder",
//     fields: [
//       { key: "last_stool", label: "Last stool passed", type: "text" },
//       { key: "foley_catheter", label: "Foley catheter inserted", type: "text" },
//       { key: "urine_output", label: "Urine output adequate", type: "text" },
//     ],
//   },

//   {
//     key: "preop_meds",
//     title: "4. Pre-operative Medications",
//     fields: [
//       {
//         key: "antibiotics",
//         label: "Pre-operative antibiotics given (Name)",
//         type: "checkbox_with_text",
//       },
//       { key: "inj_pantop", label: "INJ. PANTOP", type: "checkbox" },
//       { key: "inj_vomikind", label: "INJ. VOMIKIND", type: "checkbox" },
//     ],
//   },

//   {
//     key: "complications",
//     title: "5. Medical & Obstetric Complications",
//     fields: [
//       { key: "pih", label: "PIH / Preeclampsia", type: "checkbox" },
//       { key: "gdm", label: "Gestational Diabetes", type: "checkbox" },
//       { key: "cardiac", label: "Cardiac disease", type: "checkbox" },

//       {
//         key: "thyroid",
//         label: "Thyroid disorder",
//         type: "checkbox_with_text",
//         placeholder: "Hypo / Hyper",
//       },

//       { key: "asthma", label: "Asthma", type: "checkbox" },
//       { key: "anemia", label: "Anemia", type: "checkbox" },
//       { key: "previous_lscs", label: "Previous LSCS", type: "checkbox" },
//       { key: "placenta_previa", label: "Placenta Previa / Accrete", type: "checkbox" },
//       { key: "multiple_pregnancy", label: "Multiple pregnancy", type: "checkbox" },

//       {
//         key: "other_complications",
//         label: "Other complications",
//         type: "checkbox_with_text",
//       },
//     ],
//   },

//   {
//     key: "blood",
//     title: "6. Blood Availability",
//     fields: [
//       { key: "blood_group_type", label: "Blood group & type", type: "text" },
//       { key: "blood_reserved", label: "Blood reserved (Units)", type: "text" },
//       { key: "ready_in_hospital", label: "Ready in hospital", type: "checkbox" },
//       { key: "blood_cross_matched", label: "Blood cross-matched", type: "checkbox" },
//     ],
//   },

//   {
//     key: "stem_cell",
//     title: "7. Stem Cell Collection",
//     fields: [
//       { key: "stem_cell_planned", label: "Stem cell collection planned", type: "yesno" },
//       { key: "kit_available", label: "Collection kit available in OT", type: "checkbox" },
//     ],
//   },

//   {
//     key: "anesthesia_readiness",
//     title: "8. Anesthesia Readiness",
//     fields: [
//       { key: "anesthetist_informed", label: "Anesthetist informed and available", type: "checkbox" },
//       { key: "anesthetist_name", label: "Anesthetist Name", type: "text" },
//       { key: "difficult_airway", label: "Difficult airway anticipated", type: "yesno" },
//       { key: "allergy_informed", label: "Allergy history informed", type: "checkbox" },
//     ],
//   },

//   {
//     key: "pediatrician",
//     title: "9. Pediatrician",
//     fields: [
//       { key: "pediatrician_informed", label: "Pediatrician / Neonatologist informed", type: "checkbox" },
//       { key: "pediatrician_name", label: "Pediatrician Name", type: "text" },
//       { key: "amount_to_pay", label: "Amount to pay", type: "text" },
//     ],
//   },

//   {
//     key: "ot_staffing",
//     title: "10. OT Staffing",
//     fields: [
//       { key: "wash_sister", label: "Scrub Team — Wash Sister", type: "text" },
//       { key: "support_team", label: "Support Team", type: "text" },
//       { key: "anesthesia_sister", label: "Anesthesia Sister / Technician", type: "text" },
//       { key: "primary_consultant", label: "Primary Surgeon / Consultant", type: "text" },
//     ],
//   },

//   {
//     key: "patient_prep",
//     title: "11. Patient Preparation",
//     fields: [
//       { key: "surgical_consent", label: "Surgical consent verified", type: "checkbox" },
//       { key: "anesthesia_consent", label: "Anesthesia consent verified", type: "checkbox" },
//       { key: "transfusion_consent", label: "Blood transfusion consent available (if applicable)", type: "checkbox" },
//       { key: "jewelry_removed", label: "Jewelry / dentures removed", type: "checkbox" },
//       { key: "ot_gown", label: "OT gown and cap worn", type: "checkbox" },
//       { key: "iv_line", label: "IV line secured (18G / 16G if high risk)", type: "checkbox" },
//       { key: "three_way_cannula", label: "3-way cannula", type: "checkbox" },
//       { key: "vitals_stable", label: "Vital signs stable and recorded", type: "checkbox" },
//       { key: "fhr_documented", label: "Fetal heart rate documented before shifting", type: "checkbox" },
//     ],
//   },

//   {
//     key: "special",
//     title: "12. Special Requirements",
//     fields: [
//       { key: "placenta_tray", label: "Placenta previa / accrete tray ready", type: "checkbox" },
//       { key: "pph_tray", label: "PPH tray ready", type: "checkbox" },
//       { key: "cell_saver", label: "Cell saver arranged (if available)", type: "checkbox" },
//       { key: "icu_bed", label: "ICU / HDU bed reserved (if required)", type: "checkbox" },
//       { key: "consultant_informed", label: "Additional consultant informed (if required)", type: "checkbox" },
//     ],
//   },

//   {
//     key: "handover",
//     title: "Handover",
//     fields: [
//       { key: "remarks", label: "Remarks", type: "text" },
//       { key: "ward_sister_name", label: "Ward Sister Name & Signature", type: "text" },
//       { key: "ot_tech_name", label: "OT Technician Name & Signature", type: "text" },

//       // CHANGED
//       {
//         key: "handover_datetime",
//         label: "Handover Date & Time",
//         type: "datetime",
//       },

//       { key: "status_accepted", label: "Final OT Takeover Status: Accepted for OT", type: "checkbox" },
//       { key: "status_deficiency", label: "Deficiency informed and corrected before shifting", type: "checkbox" },

//       // CHANGED
//       {
//         key: "shifted_to_ot_at",
//         label: "Shifted to OT",
//         type: "datetime",
//         autoNow: true,
//       },
//     ],
//   },
// ];

// export type ChecklistData = Record<string, string | boolean>;

// export function emptyChecklist(): ChecklistData {
//   const out: ChecklistData = {};

//   for (const section of CHECKLIST_SECTIONS) {
//     for (const field of section.fields) {
//       switch (field.type) {
//         case "checkbox":
//           out[field.key] = false;
//           break;

//         case "checkbox_with_text":
//           out[field.key] = "";
//           out[`${field.key}__checked`] = false;
//           break;

//         default:
//           out[field.key] = "";
//       }
//     }
//   }

//   return out;
// }



// Structure of the OT Handover Checklist form. Stored as JSONB `data` in checklists.

export type FieldType =
  | "text"
  | "checkbox"
  | "checkbox_with_text"
  | "yesno"
  | "select"
  | "datetime"
  | "date";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  inline?: boolean;

  // Used only by select fields
  options?: string[];

  // Used only by datetime fields
  autoNow?: boolean;

  // Show this field only when another field's value matches.
  // If `equals` is omitted, the field is shown whenever the controlling
  // value is truthy. Used e.g. to reveal kit-expiry/company when the
  // "Collection kit available in OT" checkbox is ticked.
  showWhen?: { key: string; equals?: string | boolean };

  // For select fields: when the selected value is in this list, the control
  // is rendered with a red / warning style (e.g. Rh Negative).
  dangerValues?: string[];
}

export interface SectionDef {
  key: string;
  title: string;
  fields: FieldDef[];
}

export const CHECKLIST_SECTIONS: SectionDef[] = [
  {
    key: "header",
    title: "Ward Sister > OT Technician",
    fields: [
      {
        key: "patient_name",
        label: "Patient name",
        type: "text",
      },
      {
        key: "weight",
        label: "Weight",
        type: "text",
        inline: true,
      },
      {
        key: "room_no",
        label: "Room No",
        type: "text",
        inline: true,
      },

      {
        key: "ac_status",
        label: "AC / Non AC",
        type: "select",
        inline: true,
        options: ["AC", "Non AC"],
      },

      // NEW: Insurance dropdown (mirrors AC / Non AC)
      {
        key: "insurance_status",
        label: "Insurance / Non Insurance",
        type: "select",
        inline: true,
        options: ["Insurance", "Non Insurance"],
      },

      {
        key: "consent_lscs",
        label: "Consent for LSCS signed and verified",
        type: "checkbox",
      },
    ],
  },

  {
    key: "preop_assessment",
    title: "1. Pre-operative Assessment",
    fields: [
      { key: "cbc_hb", label: "CBC / Hb", type: "checkbox" },

      // NEW: CT, BT below CBC / Hb
      { key: "ct_bt", label: "CT, BT", type: "checkbox" },

      { key: "blood_group", label: "Blood Group & Rh typing", type: "checkbox" },
      { key: "blood_sugar", label: "Blood Sugar", type: "checkbox" },

      // NEW: Sr. Creatinine below Blood Sugar
      { key: "sr_creatinine", label: "Sr. Creatinine", type: "checkbox" },

      { key: "urine_routine", label: "Urine Routine", type: "checkbox" },
      { key: "coagulation", label: "Coagulation profile (if indicated)", type: "checkbox" },
      { key: "lft_rft", label: "LFT / RFT (if indicated)", type: "checkbox" },
      { key: "viral_markers", label: "Viral markers (HIV, HBsAg, HCV)", type: "checkbox" },

      // NEW: ECG and 2D Echo below Viral markers (two distinct checkboxes)
      { key: "ecg", label: "ECG", type: "checkbox" },
      { key: "echo_2d", label: "2D Echo", type: "checkbox" },

      // Textbox appears only when checked (handled by ChecklistForm)
      {
        key: "other_investigation",
        label: "Other",
        type: "checkbox_with_text",
      },

      { key: "ob_ultrasound", label: "Obstetric ultrasound report available", type: "checkbox" },
      { key: "high_risk", label: "High-risk pregnancy identified", type: "yesno" },
      { key: "high_risk_details", label: "High-risk details", type: "text" },
    ],
  },

  {
    key: "fasting",
    title: "2. Fasting Status",
    fields: [
      { key: "nbm_instructed", label: "NBM instructed", type: "checkbox" },
      { key: "last_meal", label: "Last meal taken at", type: "text" },
      { key: "last_fluids", label: "Last clear fluids taken at", type: "text" },
    ],
  },

  {
    key: "bowel_bladder",
    title: "3. Bowel & Bladder",
    fields: [
      { key: "last_stool", label: "Last stool passed", type: "text" },
      { key: "foley_catheter", label: "Foley catheter inserted", type: "text" },
      { key: "urine_output", label: "Urine output adequate", type: "text" },
    ],
  },

  {
    key: "preop_meds",
    title: "4. Pre-operative Medications",
    fields: [
      {
        key: "antibiotics",
        label: "Pre-operative antibiotics given (Name)",
        type: "checkbox_with_text",
      },
      { key: "inj_pantop", label: "INJ. PANTOP", type: "checkbox" },
      { key: "inj_vomikind", label: "INJ. VOMIKIND", type: "checkbox" },
    ],
  },

  {
    key: "complications",
    title: "5. Medical & Obstetric Complications",
    fields: [
      { key: "pih", label: "PIH / Preeclampsia", type: "checkbox" },
      { key: "gdm", label: "Gestational Diabetes", type: "checkbox" },
      { key: "cardiac", label: "Cardiac disease", type: "checkbox" },

      {
        key: "thyroid",
        label: "Thyroid disorder",
        type: "checkbox_with_text",
        placeholder: "Hypo / Hyper",
      },

      { key: "asthma", label: "Asthma", type: "checkbox" },
      { key: "anemia", label: "Anemia", type: "checkbox" },
      { key: "previous_lscs", label: "Previous LSCS", type: "checkbox" },
      { key: "placenta_previa", label: "Placenta Previa / Accrete", type: "checkbox" },
      { key: "multiple_pregnancy", label: "Multiple pregnancy", type: "checkbox" },

      // NEW: IVF pregnancy just below Multiple pregnancy
      { key: "ivf_pregnancy", label: "IVF pregnancy", type: "checkbox" },

      {
        key: "other_complications",
        label: "Other complications",
        type: "checkbox_with_text",
      },
    ],
  },

  {
    key: "blood",
    title: "6. Blood Availability",
    fields: [
      // CHANGED: "Blood group & type" split into ABO group + Rh type.
      // Rh "Negative" is flagged in red via dangerValues.
      {
        key: "blood_group_abo",
        label: "Blood group",
        type: "select",
        inline: true,
        options: ["A", "B", "AB", "O"],
      },
      {
        key: "blood_rh",
        label: "Rh type",
        type: "select",
        inline: true,
        options: ["Positive", "Negative"],
        dangerValues: ["Negative"],
      },

      { key: "blood_reserved", label: "Blood reserved (Units)", type: "text" },
      { key: "ready_in_hospital", label: "Ready in hospital", type: "checkbox" },
      { key: "blood_cross_matched", label: "Blood cross-matched", type: "checkbox" },
    ],
  },

  {
    key: "stem_cell",
    title: "7. Stem Cell Collection",
    fields: [
      { key: "stem_cell_planned", label: "Stem cell collection planned", type: "yesno" },
      { key: "kit_available", label: "Collection kit available in OT", type: "checkbox" },

      // NEW: revealed only when "Collection kit available in OT" is checked
      {
        key: "kit_expiry",
        label: "Kit expiry date",
        type: "date",
        showWhen: { key: "kit_available", equals: true },
      },
      {
        key: "kit_company",
        label: "Company name",
        type: "text",
        placeholder: "Manufacturer / company",
        showWhen: { key: "kit_available", equals: true },
      },
    ],
  },

  {
    key: "anesthesia_readiness",
    title: "8. Anesthesia Readiness",
    fields: [
      { key: "anesthetist_informed", label: "Anesthetist informed and available", type: "checkbox" },
      { key: "anesthetist_name", label: "Anesthetist Name", type: "text" },
      { key: "difficult_airway", label: "Difficult airway anticipated", type: "yesno" },
      { key: "allergy_informed", label: "Allergy history informed", type: "checkbox" },
    ],
  },

  {
    key: "pediatrician",
    title: "9. Pediatrician",
    fields: [
      { key: "pediatrician_informed", label: "Pediatrician / Neonatologist informed", type: "checkbox" },
      { key: "pediatrician_name", label: "Pediatrician Name", type: "text" },
      { key: "amount_to_pay", label: "Amount to pay", type: "text" },
    ],
  },

  {
    key: "ot_staffing",
    title: "10. OT Staffing",
    fields: [
      { key: "wash_sister", label: "Scrub Team — Wash Sister", type: "text" },
      { key: "support_team", label: "Support Team", type: "text" },
      { key: "anesthesia_sister", label: "Anesthesia Sister / Technician", type: "text" },
      { key: "primary_consultant", label: "Primary Surgeon / Consultant", type: "text" },
    ],
  },

  {
    key: "patient_prep",
    title: "11. Patient Preparation",
    fields: [
      { key: "surgical_consent", label: "Surgical consent verified", type: "checkbox" },
      { key: "anesthesia_consent", label: "Anesthesia consent verified", type: "checkbox" },
      { key: "transfusion_consent", label: "Blood transfusion consent available (if applicable)", type: "checkbox" },
      { key: "jewelry_removed", label: "Jewelry / dentures removed", type: "checkbox" },
      { key: "ot_gown", label: "OT gown and cap worn", type: "checkbox" },

      { key: "iv_line", label: "IV line secured (18G / 16G if high risk)", type: "checkbox" },

      // NEW: gauge dropdown revealed only when "IV line secured" is checked
      {
        key: "iv_gauge",
        label: "IV cannula gauge",
        type: "select",
        options: ["16G", "18G", "22G"],
        showWhen: { key: "iv_line", equals: true },
      },

      { key: "three_way_cannula", label: "3-way cannula", type: "checkbox" },
      { key: "vitals_stable", label: "Vital signs stable and recorded", type: "checkbox" },
      { key: "fhr_documented", label: "Fetal heart rate documented before shifting", type: "checkbox" },
    ],
  },

  {
    key: "special",
    title: "12. Special Requirements",
    fields: [
      { key: "placenta_tray", label: "Placenta previa / accrete tray ready", type: "checkbox" },
      { key: "pph_tray", label: "PPH tray ready", type: "checkbox" },
      { key: "cell_saver", label: "Cell saver arranged (if available)", type: "checkbox" },
      { key: "icu_bed", label: "ICU / HDU bed reserved (if required)", type: "checkbox" },
      { key: "consultant_informed", label: "Additional consultant informed (if required)", type: "checkbox" },
    ],
  },

  {
    key: "handover",
    title: "Handover",
    fields: [
      { key: "remarks", label: "Remarks", type: "text" },
      { key: "ward_sister_name", label: "Ward Sister Name & Signature", type: "text" },
      { key: "ot_tech_name", label: "OT Technician Name & Signature", type: "text" },

      {
        key: "handover_datetime",
        label: "Handover Date & Time",
        type: "datetime",
      },

      { key: "status_accepted", label: "Final OT Takeover Status: Accepted for OT", type: "checkbox" },
      { key: "status_deficiency", label: "Deficiency informed and corrected before shifting", type: "checkbox" },

      {
        key: "shifted_to_ot_at",
        label: "Shifted to OT",
        type: "datetime",
        autoNow: true,
      },
    ],
  },
];

export type ChecklistData = Record<string, string | boolean>;

export function emptyChecklist(): ChecklistData {
  const out: ChecklistData = {};

  for (const section of CHECKLIST_SECTIONS) {
    for (const field of section.fields) {
      switch (field.type) {
        case "checkbox":
          out[field.key] = false;
          break;

        case "checkbox_with_text":
          out[field.key] = "";
          out[`${field.key}__checked`] = false;
          break;

        // text | yesno | select | datetime | date
        default:
          out[field.key] = "";
      }
    }
  }

  return out;
}