import { forwardRef, useImperativeHandle } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { columns } from "@/Components/layout/SPTPPHUni/columns"; 
import { DataTableSPTPPHUni } from "@/Components/layout/SPTPPHUni/data-table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/Components/ui/accordion";

interface User {
    name?: string;
    address?: string;
    phone_number?: string;
    npwp?: string;
}

interface Spt {
    start_period?: string;
    year?: number;
    correction_number?: number;
}

const TabI = forwardRef(
    (
        {
            user = {},
            spt = {},
            bupots = [],
            
        }: {
            user?: User;
            spt?: Spt;
            bupots?: any[];
            
        },
        ref
    ) => {
        // Transform data for the table
        const dataBppu = [
            ...(bupots || [])
                .filter((item: any) => item.object?.type === "bppu") // Filter to only include Bppu type
                .map((item: any) => ({
                    npwp: item.customer_id || '',
                    name: item.customer_name || '',
                    doc_no: item.doc_no || '',
                    doc_date: item.doc_date || '',
                    tax_type: item.object?.tax_type || '',
                    tax_code: item.object?.tax_code || '',
                    tax_name: item.object?.tax_name || '',
                    dpp: item.dpp || 0,
                    tarif: item.rates || 0,
                    tax: item.tax || 0,
                    facility: item.facility || '', // Assuming facility is part of the object
                })),
        ];

        const dataBpnr = [
            ...(bupots || [])
                .filter((item: any) => item.object?.type === "bpnr")
                .map((item: any) => {
                    let normalizedRate = item.rates || 0;
                    
                    if (normalizedRate > 1) {
                        normalizedRate = normalizedRate / 100;
                    }
                    
                    return {
                        npwp: item.customer_id || '',
                        name: item.customer_name || '',
                        doc_no: item.doc_no || '',
                        doc_date: item.doc_date || '',
                        tax_type: item.object?.tax_type || '',
                        tax_code: item.object?.tax_code || '',
                        tax_name: item.object?.tax_name || '',
                        dpp: item.dpp || 0,
                        tarif: normalizedRate, // Sudah dinormalisasi ke format desimal
                        tax: item.tax || 0,
                        facility: item.facility || '',
                    };
                }),
        ];
        
    console.log("data object:", bupots);
    console.log("bpnr:", dataBpnr);
    
        

        return (
            <div>
                <h1 className="text-xl font-semibold mt-8 mb-2">
                    Pemotongan Pajak Penghasilan
                </h1>
                <div className="bg-muted p-4 w-full rounded-t-xl">
                    <p className="font-semibold text-sm">List-I</p>
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl">
                    <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                            <Label className="min-w-[180px] text-base font-medium">
                                Periode :
                            </Label>
                            <Input
                                type="text"
                                defaultValue={(spt.start_period || '-') + " " + (spt.year || '-')}
                                disabled
                                className="flex-1"
                            />
                        </div>

                        <div className="flex items-center">
                            <Label className="min-w-[180px] text-base font-medium">
                                NPWP :
                            </Label>
                            <Input
                                type="text"
                                defaultValue={user.npwp || '-'}
                                disabled
                                className="flex-1"
                            />
                        </div>                        
                    </div>
                </div>

                <div className="bg-muted p-4 mt-8 w-full rounded-t-xl">
                    <p className="font-semibold text-sm">Daftar Slip Pemotongan</p>
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl">
                <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="bpu">
                            <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                Tabel 1 BPU
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <div className="border p-4 rounded-lg">
                                    <div className="mt-5">
                                        <DataTableSPTPPHUni columns={columns} data={dataBppu} />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="bpnr" className="mt-2">
                            <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                Tabel 2 BPNR
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <div className="border p-4 rounded-lg">
                                <DataTableSPTPPHUni columns={columns} data={dataBpnr} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    
                    
                </div>
            </div>
            
        );
    }
);

export default TabI;