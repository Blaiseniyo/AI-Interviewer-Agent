import { FieldError, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    type?: "text" | "email" | "password";
    register: UseFormRegister<any>;
    error?: FieldError;
    required?: boolean;
}

const FormField = ({
    name,
    label,
    placeholder,
    type = "text",
    register,
    error,
    required = false,
}: FormFieldProps) => {
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
                className={error ? "border-red-500" : ""}
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
