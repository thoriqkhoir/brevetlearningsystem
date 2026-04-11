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

export default function HeaderOnlyLayout({ title, backHref, onBack, right, children }: HeaderOnlyLayoutProps) {
  const handleBack = () => {
    if (onBack) return onBack();
    if (backHref) return router.visit(backHref);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-sidebar ">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
               onClick={handleBack}
            >
              <ArrowLeft size={16} className="mr-1" /> Kembali
            </Button>
            {title && (
              <h1 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 truncate">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">{right}</div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
