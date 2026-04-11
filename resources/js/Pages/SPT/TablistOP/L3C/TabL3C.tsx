import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Upload } from "lucide-react";
import { SectionL3C } from "./SectionL3C";
import {
    BUILDING_ASSET_OPTIONS,
    INTANGIBLE_ASSET_OPTIONS,
    L3CItem,
    TANGIBLE_ASSET_OPTIONS,
} from "./types";

export default function TabL3C({
    user,
    spt,
    sptOpId,
    l3c,
}: {
    user: { npwp: string };
    spt: { year: number };
    sptOpId: string;
    l3c: L3CItem[];
}) {
    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <h2 className="text-2xl font-semibold">
                DAFTAR PENYUSUTAN DAN AMORTISASI FISKAL
            </h2>

            {/* HEADER */}
            <div>
                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                    HEADER
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <Label className="text-sm">Tahun Pajak</Label>
                            <Input
                                type="text"
                                value={String(spt.year)}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <Label className="text-sm">NPWP</Label>
                            <Input
                                type="text"
                                value={user.npwp}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Button
                    variant="outline"
                    className="border-blue-950 text-blue-950"
                    disabled
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Impor data
                </Button>
            </div>

            <Accordion
                type="multiple"
                defaultValue={["tangible", "building", "intangible"]}
            >
                <AccordionItem value="tangible">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        HARTA BERWUJUD
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-8">
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="tangible"
                            subType="kelompok_1"
                            assetOptions={TANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="tangible"
                            subType="kelompok_2"
                            assetOptions={TANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="tangible"
                            subType="kelompok_3"
                            assetOptions={TANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="tangible"
                            subType="kelompok_4"
                            assetOptions={TANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="tangible"
                            subType="lainnya"
                            assetOptions={TANGIBLE_ASSET_OPTIONS}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="building">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        BANGUNAN
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-8">
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="building"
                            subType="permanen"
                            assetOptions={BUILDING_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="building"
                            subType="tidak_permanen"
                            assetOptions={BUILDING_ASSET_OPTIONS}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="intangible">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        HARTA TIDAK BERWUJUD
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-8">
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="intangible"
                            subType="kelompok_1"
                            assetOptions={INTANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="intangible"
                            subType="kelompok_2"
                            assetOptions={INTANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="intangible"
                            subType="kelompok_3"
                            assetOptions={INTANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="intangible"
                            subType="kelompok_4"
                            assetOptions={INTANGIBLE_ASSET_OPTIONS}
                        />
                        <SectionL3C
                            data={l3c ?? []}
                            sptOpId={sptOpId}
                            type="intangible"
                            subType="lainnya"
                            assetOptions={INTANGIBLE_ASSET_OPTIONS}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
