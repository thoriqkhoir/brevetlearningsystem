import { forwardRef, useImperativeHandle } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { columns } from "@/Components/layout/SPT21LIII/columns"; 
import { DataTableSPT21 } from "@/Components/layout/SPT21LIII/data-table";
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

const TabLIII = forwardRef(
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
        const dataLIII = [
            ...(bupots || [])
                .filter((item: any) => 
                item.object?.type === "selain pegawai" || 
                (item.object?.kap && item.object?.kap.includes("411127"))                 ) 
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
                    customer_name: item.customer_name || '', // Assuming customer_name is part of the object
                })),
        ];

        useImperativeHandle(ref, () => ({
            getData: () => {
                return dataLIII;
            }
        }));

        console.log("data object:", bupots);

        return (
            <div>
                <h1 className="text-xl font-semibold mt-8 mb-2">
                    Daftar Pemotongan Pajak Penghasilan Pasal 21 dan/atau Pasal 26 Selain Pegawai Tetap atau Pensiunan yang Menerima Uang terkait Pensiun Secara Berkala
                </h1>
                <div className="bg-muted p-4 w-full rounded-t-xl">
                    <p className="font-semibold text-sm">List-IA</p>
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
                <Accordion type="single" collapsible className="w-full" defaultValue="LIII">
                        <AccordionItem value="LIII">
                            <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                LIST-III
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                 <div className="border p-4 rounded-lg">
                                    <div className="mt-5">
                                        <DataTableSPT21 columns={columns} data={dataLIII} />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                    </Accordion>
                    
                    
                </div>
            </div>
            
        );
    }
);

export default TabLIII;