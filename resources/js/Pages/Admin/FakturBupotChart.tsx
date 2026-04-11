"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
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
    total: {
        label: "Total",
    },
    output: {
        label: "Pajak Keluaran",
        color: "hsl(var(--chart-3))",
    },
    input: {
        label: "Pajak Masukan",
        color: "hsl(var(--chart-2))",
    },
    bupot: {
        label: "Bukti Potong",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function FakturBupotChart({
    outputInvoiceCount,
    inputInvoiceCount,
    bupotCount,
}: {
    outputInvoiceCount: number;
    inputInvoiceCount: number;
    bupotCount: number;
}) {
    const chartData = [
        {
            tax: "output",
            total: outputInvoiceCount,
            fill: "var(--color-output)",
        },
        { tax: "input", total: inputInvoiceCount, fill: "var(--color-input)" },
        { tax: "bupot", total: bupotCount, fill: "var(--color-bupot)" },
    ];

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Grafik Jumlah Data e-Faktur dan e-Bupot</CardTitle>
                <CardDescription>
                    Berdasarkan yang sudah dibuat oleh semua pengguna
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                            right: 20,
                        }}
                    >
                        <YAxis
                            dataKey="tax"
                            type="category"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]
                                    ?.label
                            }
                        />
                        <XAxis dataKey="total" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="total" layout="vertical" radius={5}>
                            <LabelList
                                dataKey="total"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
