// Generates a nicely formatted PDF of a saved OT Handover Checklist record.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CHECKLIST_SECTIONS, type ChecklistData, type FieldDef } from "@/lib/checklist-schema";

interface ChecklistMeta {
  patientName: string;
  createdByName: string;
  createdAt: string;
}

const BRAND = { r: 13, g: 100, b: 100 }; // teal, matches clinical/OT theme
const HEADER_BG: [number, number, number] = [BRAND.r, BRAND.g, BRAND.b];
const SECTION_BG: [number, number, number] = [225, 240, 239];
const DANGER: [number, number, number] = [185, 28, 28];

function isFieldVisible(field: FieldDef, data: ChecklistData): boolean {
  if (!field.showWhen) return true;
  const controlling = data[field.showWhen.key];
  return field.showWhen.equals === undefined
    ? Boolean(controlling)
    : controlling === field.showWhen.equals;
}

function formatDate(raw: string, withTime: boolean): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const datePart = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (!withTime) return datePart;
  const timePart = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}

function fieldValueText(field: FieldDef, data: ChecklistData): { text: string; danger: boolean } {
  switch (field.type) {
    case "checkbox":
      return { text: data[field.key] ? "Yes" : "No", danger: false };

    case "checkbox_with_text": {
      const checked = Boolean(data[`${field.key}__checked`]);
      if (!checked) return { text: "No", danger: false };
      const detail = String(data[field.key] ?? "").trim();
      return { text: detail ? `Yes — ${detail}` : "Yes", danger: false };
    }

    case "yesno": {
      const v = String(data[field.key] ?? "").trim();
      return { text: v || "—", danger: false };
    }

    case "select": {
      const v = String(data[field.key] ?? "").trim();
      const danger = Boolean(v && field.dangerValues?.includes(v));
      return { text: v || "—", danger };
    }

    case "date":
      return { text: formatDate(String(data[field.key] ?? ""), false) || "—", danger: false };

    case "datetime":
      return { text: formatDate(String(data[field.key] ?? ""), true) || "—", danger: false };

    default: {
      const v = String(data[field.key] ?? "").trim();
      return { text: v || "—", danger: false };
    }
  }
}

export function buildChecklistPdf(data: ChecklistData, meta: ChecklistMeta): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;

  // ---- Header band ----
  doc.setFillColor(...HEADER_BG);
  doc.rect(0, 0, pageWidth, 74, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Keerthi Hospital", margin, 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("Major Surgery & Cesarean Section — OT Handover Checklist", margin, 47);

  // doc.setFontSize(9);
  // doc.text(`Generated ${new Date().toLocaleString()}`, margin, 62);

  // ---- Patient summary card ----
  let y = 92;
  doc.setDrawColor(...HEADER_BG);
  doc.setFillColor(247, 250, 250);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 46, 6, 6, "FD");

  doc.setTextColor(30, 41, 41);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(meta.patientName || "Unnamed patient", margin + 12, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(90, 105, 105);
  doc.text(
    `Recorded by ${meta.createdByName || "—"}  ·  ${formatDate(meta.createdAt, true)}`,
    margin + 12,
    y + 36,
  );

  y += 46 + 16;

  // ---- Section tables ----
  for (const section of CHECKLIST_SECTIONS) {
    const rows = section.fields
      .filter((field) => isFieldVisible(field, data))
      .map((field) => {
        const { text, danger } = fieldValueText(field, data);
        return { label: field.label, text, danger };
      });

    if (rows.length === 0) continue;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [[section.title, ""]],
      body: rows.map((r) => [r.label, r.text]),
      theme: "grid",
      styles: {
        fontSize: 9.5,
        cellPadding: 6,
        lineColor: [222, 230, 230],
        lineWidth: 0.6,
        textColor: [40, 50, 50],
      },
      headStyles: {
        fillColor: SECTION_BG,
        textColor: HEADER_BG,
        fontStyle: "bold",
        fontSize: 10.5,
      },
      columnStyles: {
        0: { cellWidth: (pageWidth - margin * 2) * 0.45, fontStyle: "bold" },
        1: { cellWidth: (pageWidth - margin * 2) * 0.55 },
      },
      didParseCell: (hookData) => {
        // Merge the section-title header row into a single spanning cell.
        if (hookData.section === "head") {
          if (hookData.column.index === 0) {
            hookData.cell.colSpan = 2;
          } else {
            hookData.cell.text = [];
          }
        }
        if (hookData.section === "body" && hookData.column.index === 1) {
          const row = rows[hookData.row.index];
          if (row?.danger) {
            hookData.cell.styles.textColor = DANGER;
            hookData.cell.styles.fontStyle = "bold";
          }
        }
      },
      didDrawPage: () => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150, 160, 160);
        doc.text(`Page ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 16, {
          align: "right",
        });
        doc.text(
          "Keerthi Hospital · OT Handover Checklist",
          margin,
          doc.internal.pageSize.getHeight() - 16,
        );
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 14;
  }

  return doc;
}

export function downloadChecklistPdf(data: ChecklistData, meta: ChecklistMeta) {
  const doc = buildChecklistPdf(data, meta);
  const safeName = (meta.patientName || "checklist").trim().replace(/[^a-z0-9]+/gi, "_");
  doc.save(`OT_Checklist_${safeName}.pdf`);
}
