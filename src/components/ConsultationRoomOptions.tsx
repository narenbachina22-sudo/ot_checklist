import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BedDouble, Check, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  newCustomFeature,
  newRoomOption,
  ROOM_FEATURE_KEYS,
  ROOM_FEATURE_LABELS,
  ROOM_TYPES,
  type RoomFeatureKey,
  type RoomOption,
  type RoomType,
} from "@/lib/consultation";

interface Props {
  options: RoomOption[];
  selectedId: string;
  onOptionsChange: (next: RoomOption[]) => void;
  onSelectedChange: (id: string) => void;
  readOnly?: boolean;
}

export function ConsultationRoomOptions({
  options,
  selectedId,
  onOptionsChange,
  onSelectedChange,
  readOnly = false,
}: Props) {
  // Which option cards are expanded, and the "add another feature" drafts.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [customDrafts, setCustomDrafts] = useState<Record<string, string>>({});

  function toggleExpanded(id: string) {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  }

  function updateOption(id: string, patch: Partial<RoomOption>) {
    onOptionsChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function addOption() {
    const opt = newRoomOption();
    onOptionsChange([...options, opt]);
    setExpanded((e) => ({ ...e, [opt.id]: true })); // open the new one to fill it
  }

  function removeOption(id: string) {
    onOptionsChange(options.filter((o) => o.id !== id));
    if (selectedId === id) onSelectedChange("");
  }

  function toggleFeature(optId: string, key: RoomFeatureKey) {
    onOptionsChange(
      options.map((o) => {
        if (o.id !== optId) return o;
        const has = o.features.includes(key);
        return {
          ...o,
          features: has ? o.features.filter((f) => f !== key) : [...o.features, key],
        };
      }),
    );
  }

  function addCustom(optId: string) {
    const label = (customDrafts[optId] ?? "").trim();
    if (!label) return;
    onOptionsChange(
      options.map((o) =>
        o.id === optId
          ? { ...o, custom_features: [...o.custom_features, newCustomFeature(label)] }
          : o,
      ),
    );
    setCustomDrafts((d) => ({ ...d, [optId]: "" }));
  }

  function removeCustom(optId: string, cfId: string) {
    onOptionsChange(
      options.map((o) =>
        o.id === optId
          ? { ...o, custom_features: o.custom_features.filter((c) => c.id !== cfId) }
          : o,
      ),
    );
  }

  const staticChip = (label: string, key: string) => (
    <span
      key={key}
      className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-sm"
    >
      <Check className="h-3.5 w-3.5" />
      {label}
    </span>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Room options</h3>
          <p className="text-xs text-muted-foreground">
            Options presented to the patient. Add one or more.
          </p>
        </div>
        {!readOnly && (
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
            <Plus className="mr-2 h-4 w-4" />
            Add option
          </Button>
        )}
      </div>

      {options.length === 0 ? (
        <div className="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
          {readOnly
            ? "No room options were added."
            : "No options yet. Click “Add option” to create one."}
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedId === option.id;
            const isExpanded = expanded[option.id] ?? false;
            const featureCount = option.features.length + option.custom_features.length;
            const nothingAdded = featureCount === 0;
            return (
              <div
                key={option.id}
                className={cn(
                  "rounded-lg border",
                  isSelected && "border-primary ring-1 ring-primary",
                )}
              >
                {/* Collapsed header — click to expand/collapse */}
                <div className="flex items-center gap-2 p-4">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(option.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    aria-expanded={isExpanded}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                    <BedDouble className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="shrink-0 text-sm font-medium">Option {index + 1}</span>
                    {option.room_type && (
                      <span className="truncate text-sm text-muted-foreground">
                        · {option.room_type}
                      </span>
                    )}
                    {featureCount > 0 && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        · {featureCount} {featureCount === 1 ? "feature" : "features"}
                      </span>
                    )}
                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Chosen by patient
                      </span>
                    )}
                  </button>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(option.id)}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="space-y-4 border-t p-4">
                    <div className="space-y-1">
                      <Label>Room type</Label>
                      <Select
                        value={option.room_type || undefined}
                        onValueChange={(v) => updateOption(option.id, { room_type: v as RoomType })}
                        disabled={readOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type…" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOM_TYPES.map((rt) => (
                            <SelectItem key={rt} value={rt}>
                              {rt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Features</Label>

                      {readOnly ? (
                        nothingAdded ? (
                          <p className="text-sm text-muted-foreground">No features added.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {option.features.map((key) =>
                              staticChip(ROOM_FEATURE_LABELS[key], key),
                            )}
                            {option.custom_features.map((cf) => staticChip(cf.label, cf.id))}
                          </div>
                        )
                      ) : (
                        <>
                          {/* Tap a feature to add it; tap again to remove. */}
                          <div className="flex flex-wrap gap-2">
                            {ROOM_FEATURE_KEYS.map((key) => {
                              const active = option.features.includes(key);
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => toggleFeature(option.id, key)}
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors",
                                    active
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                                  )}
                                >
                                  {active ? (
                                    <Check className="h-3.5 w-3.5" />
                                  ) : (
                                    <Plus className="h-3.5 w-3.5" />
                                  )}
                                  {ROOM_FEATURE_LABELS[key]}
                                </button>
                              );
                            })}
                          </div>

                          {option.custom_features.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {option.custom_features.map((cf) => (
                                <span
                                  key={cf.id}
                                  className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary px-3 py-1 text-sm text-primary-foreground"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  {cf.label}
                                  <button
                                    type="button"
                                    onClick={() => removeCustom(option.id, cf.id)}
                                    className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground/20"
                                    aria-label={`Remove ${cf.label}`}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <Input
                              value={customDrafts[option.id] ?? ""}
                              onChange={(e) =>
                                setCustomDrafts((d) => ({ ...d, [option.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addCustom(option.id);
                                }
                              }}
                              placeholder="Add another feature…"
                              className="h-9 max-w-xs"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addCustom(option.id)}
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              Add
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {options.length > 0 && (
        <div className="space-y-1 pt-1">
          <Label htmlFor="selected_option">Option chosen by the patient</Label>
          <Select
            value={selectedId || undefined}
            onValueChange={(v) => onSelectedChange(v)}
            disabled={readOnly}
          >
            <SelectTrigger id="selected_option">
              <SelectValue placeholder="Not selected yet" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o, i) => (
                <SelectItem key={o.id} value={o.id}>
                  {`Option ${i + 1}${o.room_type ? ` — ${o.room_type}` : ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}