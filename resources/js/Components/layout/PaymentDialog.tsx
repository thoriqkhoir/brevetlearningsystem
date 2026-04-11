import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirmDeposit: () => void;
    onConfirmBilling: () => void;
    onConfirmSpt: () => void;
    title: string;
    description: string;
    saldo: number;
    total: number;
}

export default function PaymentDialog({
    open,
    onClose,
    onConfirmDeposit,
    onConfirmBilling,
    onConfirmSpt,
    title,
    description,
    saldo,
    total,
}: PaymentDialogProps) {
    const formatCurrency = (value: number) => {
        const formattedValue = Math.abs(value).toLocaleString("id-ID");
        return `${value < 0 ? "- Rp " : "Rp "}${formattedValue}`;
    };

    const isSaldoSufficient = saldo >= total;
    const isTotalAboveZero = total > 0;

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                        <div className="mt-2 text-primary">
                            Saldo Anda :{" "}
                            <span
                                className={`font-semibold ${
                                    isSaldoSufficient ? "" : "text-red-500"
                                }`}
                            >
                                {formatCurrency(saldo)}
                                {isSaldoSufficient
                                    ? ""
                                    : " - Saldo Anda Tidak Cukup"}
                            </span>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        Batal
                    </AlertDialogCancel>
                    {isTotalAboveZero ? (
                        <>
                            <AlertDialogAction
                                onClick={onConfirmDeposit}
                                disabled={!isSaldoSufficient}
                            >
                                Bayar dengan Saldo Deposit
                            </AlertDialogAction>
                            <AlertDialogAction onClick={onConfirmBilling}>
                                Buat Kode Billing
                            </AlertDialogAction>
                        </>
                    ) : (
                        <AlertDialogAction onClick={onConfirmSpt}>
                            Kirim SPT
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
