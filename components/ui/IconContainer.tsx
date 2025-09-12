import { LucideIcon } from "lucide-react";

interface IconContainerProps {
    icon: LucideIcon;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const IconContainer = ({
    icon: Icon,
    size = "md",
    className = "",
}: IconContainerProps) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };


    return (
        <div
            className={`
        ${sizeClasses[size]} 
        rounded-lg 
        flex 
        items-center 
        justify-center
        text-gray-300
        bg-primary-200
        ${className}
      `.trim()}
        >
            <Icon className={`${iconSizes[size]} text-gray-300`} />
        </div>
    );
};
