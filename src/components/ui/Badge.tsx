type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "scenario-a" | "scenario-b";
  size?: "sm" | "md";
};

export function Badge({ children, variant = "default", size = "md" }: BadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm"
  };

  const variants = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    primary: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-orange-100 text-orange-700 border-orange-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    "scenario-a": "bg-green-50 text-green-700 border-green-200 font-medium",
    "scenario-b": "bg-purple-50 text-purple-700 border-purple-200 font-medium"
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        border rounded-md font-medium
        ${sizes[size]} ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}
