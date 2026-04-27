import { PropsWithChildren, ReactNode } from "react";
import { Button } from "@/Components/ui/button";
import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

type HeaderOnlyLayoutProps = PropsWithChildren<{
    title?: ReactNode;
    backHref?: string;
    onBack?: () => void;
    right?: React.ReactNode;
}>;

export default function HeaderOnlyLayout({
    title,
    backHref,
    onBack,
    right,
    children,
}: HeaderOnlyLayoutProps) {
    const handleBack = () => {
        if (onBack) return onBack();
        if (backHref) return router.visit(backHref);
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50/70">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_35%)]" />
            <header className="sticky top-0 z-40 w-full border-b border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50/90 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleBack}>
                            <ArrowLeft size={16} className="mr-1" /> Kembali
                        </Button>
                        {title && (
                            <h1 className="truncate text-sm font-medium text-slate-700 sm:text-base md:text-lg">
                                {title}
                            </h1>
                        )}
                    </div>
                    <div className="flex items-center gap-2">{right}</div>
                </div>
            </header>

            <main className="relative z-10 flex-1">{children}</main>

            <Toaster position="top-right" />
        </div>
    );
}
