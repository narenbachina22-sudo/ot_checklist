// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   CHECKLIST_SECTIONS,
//   type ChecklistData,
//   type FieldDef,
// } from "@/lib/checklist-schema";

// interface Props {
//   value: ChecklistData;
//   onChange: (next: ChecklistData) => void;
//   readOnly?: boolean;
// }

// export function ChecklistForm({
//   value,
//   onChange,
//   readOnly = false,
// }: Props) {
//   function set(key: string, v: string | boolean) {
//     onChange({
//       ...value,
//       [key]: v,
//     });
//   }

//   return (
//     <div className="space-y-5">
//       {CHECKLIST_SECTIONS.map((section) => (
//         <Card key={section.key}>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base">
//               {section.title}
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="grid gap-4 sm:grid-cols-2">
//             {section.fields.map((field) => (
//               <FieldRow
//                 key={field.key}
//                 field={field}
//                 value={value}
//                 set={set}
//                 readOnly={readOnly}
//               />
//             ))}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// function FieldRow({
//   field,
//   value,
//   set,
//   readOnly,
// }: {
//   field: FieldDef;
//   value: ChecklistData;
//   set: (k: string, v: string | boolean) => void;
//   readOnly: boolean;
// }) {
//   const v = value[field.key];

//   // -------------------------
//   // Checkbox
//   // -------------------------

//   if (field.type === "checkbox") {
//     return (
//       <label className="flex items-center gap-2 text-sm">
//         <Checkbox
//           checked={Boolean(v)}
//           onCheckedChange={(c) => set(field.key, Boolean(c))}
//           disabled={readOnly}
//         />
//         <span>{field.label}</span>
//       </label>
//     );
//   }

//   // -------------------------
//   // Yes / No
//   // -------------------------

//   if (field.type === "yesno") {
//     return (
//       <div className="space-y-1">
//         <Label className="text-sm">{field.label}</Label>

//         <div className="flex gap-4 text-sm">
//           {["Yes", "No"].map((opt) => (
//             <label
//               key={opt}
//               className="flex items-center gap-1.5"
//             >
//               <input
//                 type="radio"
//                 name={field.key}
//                 checked={v === opt}
//                 onChange={() => set(field.key, opt)}
//                 disabled={readOnly}
//               />
//               {opt}
//             </label>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // -------------------------
//   // Checkbox + Text
//   // -------------------------

//   if (field.type === "checkbox_with_text") {
//     const checkedKey = `${field.key}__checked`;
//     const checked = Boolean(value[checkedKey]);

//     return (
//       <div className="space-y-2">
//         <label className="flex items-center gap-2 text-sm">
//           <Checkbox
//             checked={checked}
//             onCheckedChange={(c) =>
//               set(checkedKey, Boolean(c))
//             }
//             disabled={readOnly}
//           />

//           <span>{field.label}</span>
//         </label>

//         {checked && (
//           <Input
//             value={typeof v === "string" ? v : ""}
//             onChange={(e) =>
//               set(field.key, e.target.value)
//             }
//             placeholder={
//               field.placeholder ?? "Enter details"
//             }
//             disabled={readOnly}
//           />
//         )}
//       </div>
//     );
//   }

//   // -------------------------
//   // Select
//   // -------------------------

//   if (field.type === "select") {
//     return (
//       <div className="space-y-1">
//         <Label>{field.label}</Label>

//         <select
//           className="flex h-10 w-full rounded-md border bg-background px-3 text-base md:text-sm"
//           value={typeof v === "string" ? v : ""}
//           onChange={(e) =>
//             set(field.key, e.target.value)
//           }
//           disabled={readOnly}
//         >
//           <option value="">Select...</option>

//           {field.options?.map((option) => (
//             <option
//               key={option}
//               value={option}
//             >
//               {option}
//             </option>
//           ))}
//         </select>
//       </div>
//     );
//   }

//   // -------------------------
//   // Date Time
//   // -------------------------

//   if (field.type === "datetime") {
//   return (
//     <div className="space-y-1">
//       <Label htmlFor={field.key}>{field.label}</Label>

//       <Input
//         id={field.key}
//         type="datetime-local"
//         value={typeof v === "string" ? v : ""}
//         onChange={(e) => set(field.key, e.target.value)}
//         disabled={readOnly}
//       />
//     </div>
//   );
// }

//   // -------------------------
//   // Text
//   // -------------------------

//   return (
//     <div className="space-y-1">
//       <Label htmlFor={field.key}>
//         {field.label}
//       </Label>

//       <Input
//         id={field.key}
//         value={typeof v === "string" ? v : ""}
//         onChange={(e) =>
//           set(field.key, e.target.value)
//         }
//         placeholder={field.placeholder}
//         disabled={readOnly}
//       />
//     </div>
//   );
// }

// export function useChecklistState(
//   initial: ChecklistData
// ) {
//   return useState(initial);
// }

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CHECKLIST_SECTIONS,
  type ChecklistData,
  type FieldDef,
} from "@/lib/checklist-schema";

interface Props {
  value: ChecklistData;
  onChange: (next: ChecklistData) => void;
  readOnly?: boolean;
}

export function ChecklistForm({
  value,
  onChange,
  readOnly = false,
}: Props) {
  function set(key: string, v: string | boolean) {
    onChange({
      ...value,
      [key]: v,
    });
  }

  return (
    <div className="space-y-5">
      {CHECKLIST_SECTIONS.map((section) => (
        <Card key={section.key}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {section.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <FieldRow
                key={field.key}
                field={field}
                value={value}
                set={set}
                readOnly={readOnly}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FieldRow({
  field,
  value,
  set,
  readOnly,
}: {
  field: FieldDef;
  value: ChecklistData;
  set: (k: string, v: string | boolean) => void;
  readOnly: boolean;
}) {
  const v = value[field.key];

  // -------------------------
  // Conditional visibility
  // -------------------------
  // Fields with `showWhen` render only when the controlling field matches.
  // If `equals` is omitted, the field shows when the controlling value is truthy.
  if (field.showWhen) {
    const controlling = value[field.showWhen.key];
    const matches =
      field.showWhen.equals === undefined
        ? Boolean(controlling)
        : controlling === field.showWhen.equals;

    if (!matches) return null;
  }

  // -------------------------
  // Checkbox
  // -------------------------

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={Boolean(v)}
          onCheckedChange={(c) => set(field.key, Boolean(c))}
          disabled={readOnly}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  // -------------------------
  // Yes / No
  // -------------------------

  if (field.type === "yesno") {
    return (
      <div className="space-y-1">
        <Label className="text-sm">{field.label}</Label>

        <div className="flex gap-4 text-sm">
          {["Yes", "No"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-1.5"
            >
              <input
                type="radio"
                name={field.key}
                checked={v === opt}
                onChange={() => set(field.key, opt)}
                disabled={readOnly}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------
  // Checkbox + Text
  // -------------------------

  if (field.type === "checkbox_with_text") {
    const checkedKey = `${field.key}__checked`;
    const checked = Boolean(value[checkedKey]);

    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={checked}
            onCheckedChange={(c) =>
              set(checkedKey, Boolean(c))
            }
            disabled={readOnly}
          />

          <span>{field.label}</span>
        </label>

        {checked && (
          <Input
            value={typeof v === "string" ? v : ""}
            onChange={(e) =>
              set(field.key, e.target.value)
            }
            placeholder={
              field.placeholder ?? "Enter details"
            }
            disabled={readOnly}
          />
        )}
      </div>
    );
  }

  // -------------------------
  // Select
  // -------------------------

  if (field.type === "select") {
    const current = typeof v === "string" ? v : "";
    const isDanger = Boolean(field.dangerValues?.includes(current));

    return (
      <div className="space-y-1">
        <Label htmlFor={field.key}>{field.label}</Label>

        <select
          id={field.key}
          className={
            "flex h-10 w-full rounded-md border bg-background px-3 text-base md:text-sm " +
            (isDanger
              ? "border-red-500 text-red-600 font-medium ring-1 ring-red-500 focus-visible:ring-red-500"
              : "")
          }
          value={current}
          onChange={(e) => set(field.key, e.target.value)}
          disabled={readOnly}
        >
          <option value="">Select...</option>

          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {isDanger && (
          <p className="text-xs font-medium text-red-600">
            ⚠ {current} — verify blood arrangement
          </p>
        )}
      </div>
    );
  }

  // -------------------------
  // Date (calendar picker, no time)
  // -------------------------

  if (field.type === "date") {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.key}>{field.label}</Label>

        <Input
          id={field.key}
          type="date"
          value={typeof v === "string" ? v : ""}
          onChange={(e) => set(field.key, e.target.value)}
          disabled={readOnly}
        />
      </div>
    );
  }

  // -------------------------
  // Date Time
  // -------------------------

  if (field.type === "datetime") {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.key}>{field.label}</Label>

        <Input
          id={field.key}
          type="datetime-local"
          value={typeof v === "string" ? v : ""}
          onChange={(e) => set(field.key, e.target.value)}
          disabled={readOnly}
        />
      </div>
    );
  }

  // -------------------------
  // Text
  // -------------------------

  return (
    <div className="space-y-1">
      <Label htmlFor={field.key}>
        {field.label}
      </Label>

      <Input
        id={field.key}
        value={typeof v === "string" ? v : ""}
        onChange={(e) =>
          set(field.key, e.target.value)
        }
        placeholder={field.placeholder}
        disabled={readOnly}
      />
    </div>
  );
}

export function useChecklistState(
  initial: ChecklistData
) {
  return useState(initial);
}