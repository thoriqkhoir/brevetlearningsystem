import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";
import { ResponsiveContainer } from "recharts";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
} from "recharts";
import { InvoiceColumns } from "@/Components/layout/Invoice/columns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

export default function Dashboard() {
    const { invoices: unknownInvoices } = usePage().props;

    const invoices = unknownInvoices as InvoiceColumns[];

    const statusCounts = invoices.reduce(
        (acc: any, invoice: InvoiceColumns) => {
            acc[invoice.status] = (acc[invoice.status] || 0) + 1;
            return acc;
        },
        {}
    );

    const pieData = Object.keys(statusCounts).map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: statusCounts[key],
    }));

    const totalDPP = invoices.reduce((acc, invoice) => acc + invoice.dpp, 0);
    const totalPPN = invoices.reduce((acc, invoice) => acc + invoice.ppn, 0);
    const totalPPnBM = invoices.reduce(
        (acc, invoice) => acc + invoice.ppnbm,
        0
    );

    const barData = [
        { name: "DPP", value: totalDPP },
        { name: "PPN", value: totalPPN },
        { name: "PPnBM", value: totalPPnBM },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8 mx-auto px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="text-2xl font-semibold text-primary">
                        Dashboard di e-Faktur
                    </h1>

                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <div className="py-4 px-6 bg-sidebar border rounded-xl">
                            <h6 className="font-semibold text-lg">
                                Dashboard Faktur Pajak
                            </h6>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) =>
                                                `${name}: ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center gap-2 justify-center my-12">
                                    <AlertCircle
                                        size={16}
                                        className="text-yellow-600"
                                    />
                                    <p className="font-medium text-sm text-primary/70">
                                        Tidak ada data yang tersedia!
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="py-4 px-6 bg-sidebar border rounded-xl">
                            <h6 className="font-semibold text-lg">
                                Dashboard Pembayaran dan Pelaporan SPT Masa PPn
                            </h6>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <Tooltip
                                        formatter={(value) =>
                                            rupiahFormatter.format(
                                                Number(value)
                                            )
                                        }
                                    />
                                    <Bar dataKey="value" fill={COLORS[0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="py-4 px-6 bg-sidebar border rounded-xl">
                        <h6 className="font-semibold text-lg">
                            Dashboard Pembayaran sebelum Pelaporan SPT Masa PPn
                        </h6>
                        <div className="flex items-center gap-2 justify-center my-12">
                            <AlertCircle
                                size={16}
                                className="text-yellow-600"
                            />
                            <p className="font-medium text-sm text-primary/70">
                                Tidak ada data yang tersedia!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
