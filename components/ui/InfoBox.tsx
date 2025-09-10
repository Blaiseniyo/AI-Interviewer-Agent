import { ReactNode } from "react";

interface InfoBoxProps {
    icon: ReactNode;
    title: string;
    description: string;
    variant?: "info" | "success" | "warning" | "error";
}

const InfoBox = ({
    icon,
    title,
    description,
    variant = "info"
}: InfoBoxProps) => {
    const variantClasses = {
        info: "bg-primary-200/10 border-primary-200/20 text-primary-200",
        success: "bg-green-200/10 border-green-200/20 text-green-200",
        warning: "bg-yellow-200/10 border-yellow-200/20 text-yellow-200",
        error: "bg-red-200/10 border-red-200/20 text-red-200",
    };

    const { bg, border, iconColor } = {
        bg: variantClasses[variant].split(' ')[0],
        border: variantClasses[variant].split(' ')[1],
        iconColor: variantClasses[variant].split(' ')[2],
    };

    return (
        <div className={`${bg} ${border} rounded-lg p-3`}>
            <div className="flex items-start gap-2">
                <div className={`w-4 h-4 mt-0.5 ${iconColor}`}>
                    {icon}
                </div>
                <div className="text-sm">
                    <p className={`${iconColor} font-medium`}>
                        {title}
                    </p>
                    <p className="text-light-100">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoBox;
