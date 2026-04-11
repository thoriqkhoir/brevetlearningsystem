import { FormL12A } from "./FormL12A";
import type { L12AData } from "./types";

interface TabL12AProps {
    sptBadanId: string;
    l12a: L12AData | null;
}

export function TabL12A({ sptBadanId, l12a }: TabL12AProps) {
    return <FormL12A sptBadanId={sptBadanId} data={l12a} />;
}

export default TabL12A;
