import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
    disabled?: boolean;
    maxWidth?: "sm" | "md" | "lg" | "xl";
}

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    icon,
    children,
    disabled = false,
    maxWidth = "md",
}: ModalProps) => {
    const handleClose = () => {
        if (!disabled) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={handleClose}
                aria-hidden="true"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className={`bg-dark-200 rounded-xl border border-light-600/20 w-full ${maxWidthClasses[maxWidth]}`}
                    role="dialog"
                    aria-labelledby="modal-title"
                    aria-describedby={description ? "modal-description" : undefined}
                >
                    <div className="flex items-center justify-between p-6 border-b border-light-600/20">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                                    {icon}
                                </div>
                            )}
                            <div>
                                <h2 id="modal-title" className="text-xl font-semibold text-white">
                                    {title}
                                </h2>
                                {description && (
                                    <p id="modal-description" className="text-sm text-light-100">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            disabled={disabled}
                            className="text-light-100 hover:text-white hover:bg-dark-300"
                            aria-label="Close modal"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
