"use client";

import { Badge } from "./Badge";

export type ScenarioView = "A" | "B" | "BOTH";

type ScenarioToggleProps = {
  value: ScenarioView;
  onChange: (view: ScenarioView) => void;
};

export function ScenarioToggle({ value, onChange }: ScenarioToggleProps) {
  const options: { value: ScenarioView; label: string; badge: "scenario-a" | "scenario-b" | "primary" }[] = [
    { value: "A", label: "Scenario A", badge: "scenario-a" },
    { value: "B", label: "Scenario B", badge: "scenario-b" },
    { value: "BOTH", label: "Compare Both", badge: "primary" }
  ];

  return (
    <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
            ${value === option.value
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }
          `}
        >
          <div className="flex items-center gap-2">
            {value === option.value && <Badge variant={option.badge} size="sm">{option.value === "BOTH" ? "A vs B" : option.value}</Badge>}
            <span>{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
