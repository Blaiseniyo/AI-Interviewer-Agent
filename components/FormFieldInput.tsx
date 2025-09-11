import { FieldError, UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues = FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "date";
    register: UseFormRegister<T>;
    error?: FieldError;
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    className?: string;
}

const FormField = <T extends FieldValues = FieldValues>({
    name,
    label,
    placeholder,
    type = "text",
    register,
    error,
    required = false,
    disabled = false,
    autoFocus = false,
    className = "",
}: FormFieldProps<T>) => {
    return (
        <div className="form-group">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name)}
                className={`${error ? "border-red-500" : ""} ${className}`}
                disabled={disabled}
                autoFocus={autoFocus}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${name}-error` : undefined}
            />
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

export default FormField;
