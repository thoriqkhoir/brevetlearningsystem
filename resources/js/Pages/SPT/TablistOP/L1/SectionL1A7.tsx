import { TableL1A7 } from "./TableL1A7";

interface SectionL1A7Props {
    totalAcquisitionCost: number;
    totalAmountNow: number;
}

export function SectionL1A7({
    totalAcquisitionCost,
    totalAmountNow,
}: SectionL1A7Props) {
    return (
        <div className="space-y-4">
            <TableL1A7
                totalAcquisitionCost={totalAcquisitionCost}
                totalAmountNow={totalAmountNow}
            />
        </div>
    );
}

export default SectionL1A7;
