"use client";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  helperText?: string;
};

export function Toggle({ label, checked, onChange, disabled, helperText }: ToggleProps) {
  return (
    <label className="flex items-center justify-between gap-3 py-2.5 cursor-pointer group">
      <div className="flex-1">
        <span className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}>
          {label}
        </span>
        {helperText && (
          <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>
        )}
      </div>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-all duration-200
            ${checked
              ? "bg-blue-600"
              : "bg-gray-200"
            }
            ${disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
            }
            peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full
              bg-white shadow-sm transition-transform duration-200
              ${checked ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </div>
      </div>
    </label>
  );
}
