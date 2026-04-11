import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

interface PasswordVerificationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
}

const PasswordVerificationDialog: React.FC<PasswordVerificationDialogProps> = ({
    open,
    onClose,
    onConfirm,
}) => {
    const [password, setPassword] = useState("");

    const handleConfirm = (event: React.FormEvent) => {
        event.preventDefault();
        onConfirm(password);
        setPassword("");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verifikasi Password</DialogTitle>
                    <DialogDescription>
                        Masukkan password Anda untuk melanjutkan.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleConfirm} className="space-y-4">
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password Anda"
                        required
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit">Konfirmasi</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordVerificationDialog;
