import { LucideIcon } from "lucide-react";
import { IconContainer } from "./IconContainer";

type InfoRowProps = {
    icon: LucideIcon;
    label: string;
    primary: string;
    secondary?: string;
};

const InfoRow = ({ icon, label, primary, secondary }: InfoRowProps) => (
    <div className="flex items-center gap-3">
        <IconContainer icon={icon} />
        <div>
            <p className="text-sm text-light-100">{label}</p>
            <p className="text-white font-medium">{primary}</p>
            {secondary && <p className="text-sm text-light-100">{secondary}</p>}
        </div>
    </div>
);

export default InfoRow;


