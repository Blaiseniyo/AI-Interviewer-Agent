import { ReactNode } from "react";

type SectionProps = {
    title?: string;
    className?: string;
    children: ReactNode;
};

const Section = ({ title, className = "", children }: SectionProps) => (
    <div className={`px-8 mb-8 ${className}`}>
        {title && (
            <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        )}
        <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
            {children}
        </div>
    </div>
);

export default Section;


