import { FieldError, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    options: readonly Option[];
    register: UseFormRegister<any>;
    error?: FieldError;
    required?: boolean;
}

const SelectField = ({
    name,
    label,
    placeholder,
    options,
    register,
    error,
    required = false,
}: SelectFieldProps) => {
    return (
        <div className="form-group">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <select
                id={name}
                className={`form-select ${error ? "border-red-500" : ""}`}
                {...register(name)}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${name}-error` : undefined}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p
                    id={`${name}-error`}
                    className="text-red-400 text-sm mt-1"
                    role="alert"
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default SelectField;
