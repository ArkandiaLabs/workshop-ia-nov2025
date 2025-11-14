import React from "react";

/**
 * Option type for Select component
 */
export interface SelectOption {
  value: string | number;
  label: string;
}

/**
 * Props for Select component
 */
export interface SelectProps {
  options: SelectOption[];
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  placeholder: string;
  className?: string;
}

/**
 * Select dropdown component with native HTML select
 * Styled with Tailwind CSS to match the UI design
 * 
 * @example
 * <Select
 *   options={[{ value: 1, label: "Option 1" }]}
 *   value={selectedValue}
 *   onChange={handleChange}
 *   placeholder="Select an option"
 * />
 */
export function Select({
  options,
  value,
  onChange,
  placeholder,
  className = "",
}: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue === "") {
      return;
    }

    // Convert back to number if the original option was a number
    const option = options.find(
      (opt) => String(opt.value) === selectedValue
    );
    if (option) {
      onChange(option.value);
    }
  };

  return (
    <select
      value={value !== undefined ? String(value) : ""}
      onChange={handleChange}
      className={`
        w-full px-4 py-2 
        text-gray-700 
        bg-white 
        border border-gray-300 
        rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-gray-400
        transition-colors
        cursor-pointer
        ${className}
      `.trim().replace(/\s+/g, " ")}
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
