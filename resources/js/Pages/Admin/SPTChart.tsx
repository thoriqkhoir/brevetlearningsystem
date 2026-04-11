"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    ppn: {
        label: "SPT PPN",
        color: "hsl(var(--chart-1))",
    },
    unifikasi: {
        label: "SPT Unifikasi",
        color: "hsl(var(--chart-2))",
    },
    pph21: {
        label: "SPT PPH 21/26",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function SPTChart({
    sptPpnCount,
    sptUnifikasiCount,
    sptPph21Count,
}: {
    sptPpnCount: number;
    sptUnifikasiCount: number;
    sptPph21Count: number;
}) {
    const chartData = [
        { spt: "SPT PPN", visitors: sptPpnCount, fill: "var(--color-ppn)" },
        {
            spt: "SPT Unifikasi",
            visitors: sptUnifikasiCount,
            fill: "var(--color-unifikasi)",
        },
        {
            spt: "SPT PPH 21/26",
            visitors: sptPph21Count,
            fill: "var(--color-pph21)",
        },
    ];

    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    }, [sptPpnCount, sptUnifikasiCount, sptPph21Count]);

    return (
        <Card className="flex flex-col col-span-2">
            <CardHeader className="items-center pb-0">
                <CardTitle>Grafik SPT</CardTitle>
                <CardDescription>
                    Total SPT yang sudah dibuat pengguna
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="spt"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total SPT
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Distribusi berdasarkan jenis SPT{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    PPN: {sptPpnCount} | Unifikasi: {sptUnifikasiCount} | PPH
                    21/26: {sptPph21Count}
                </div>
            </CardFooter>
        </Card>
    );
}
