import { SectionL11C } from "./SectionL11C";
import type { L11CItem } from "./types";

interface TabL11CProps {
    sptBadanId: string;
    l11c: L11CItem[];
}

export function TabL11C({ sptBadanId, l11c }: TabL11CProps) {
    return <SectionL11C data={l11c} sptBadanId={sptBadanId} />;
}

export default TabL11C;
