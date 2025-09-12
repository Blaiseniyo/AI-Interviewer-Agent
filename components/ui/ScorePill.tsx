type ScorePillProps = {
    score: number;
    colorClass: string;
    label?: string;
};

const ScorePill = ({ score, colorClass, label }: ScorePillProps) => (
    <div>
        {label && <p className="text-sm text-light-100">{label}</p>}
        <p className={`text-2xl font-bold ${colorClass}`}>{score}/100</p>
    </div>
);

export default ScorePill;


