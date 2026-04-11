import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div
            className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10"
            style={{
                backgroundImage: "url('/images/login background.png')",
                backgroundSize: "cover",
                backgroundPosition: "left",
            }}
        >
            <div className="w-full max-w-sm md:max-w-5xl">
                <Toaster position="top-center" />
                {children}
            </div>
        </div>
    );
}
