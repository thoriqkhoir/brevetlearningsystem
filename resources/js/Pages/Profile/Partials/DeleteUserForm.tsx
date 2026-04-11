import InputError from "@/Components/layout/InputError";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-primary">
                    Hapus Akun
                </h2>

                <p className="mt-1 text-sm text-primary/70">
                    Setelah akun Anda dihapus, semua sumber daya dan data akan
                    dihapus secara permanen. Sebelum menghapus akun Anda,
                    silahkan unduh data atau informasi yang ingin Anda simpan.
                </p>
            </header>

            <AlertDialog>
                <AlertDialogTrigger>
                    <Button variant={"destructive"}>Hapus Akun</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <form onSubmit={deleteUser}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Apakah Anda yakin ingin menghapus akun Anda?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                <p className="mt-1 text-sm text-primary/70">
                                    Setelah akun Anda dihapus, semua sumber daya
                                    dan data akan dihapus secara permanen.
                                    Silahkan masukkan password Anda untuk
                                    mengonfirmasi bahwa Anda ingin menghapus
                                    akun Anda secara permanen.
                                </p>

                                <div className="grid gap-2 my-4">
                                    <Label
                                        htmlFor="password"
                                        className="sr-only"
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="mt-1 block w-3/4"
                                        placeholder="Password"
                                        autoFocus
                                    />
                                    <InputError message={errors.password} />
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                type="submit"
                                disabled={processing}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Hapus Akun
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
}
