import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import { Camera, Upload, X, RotateCcw, Check } from "lucide-react";

const identityVerificationSchema = z.object({
    photo: z
        .instanceof(File, {
            message: "Foto identitas harus diupload",
        })
        .refine(
            (file) => file.size <= 5 * 1024 * 1024, // 5MB
            "Ukuran file maksimal 5MB"
        )
        .refine(
            (file) =>
                ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
            "Format file harus JPG, JPEG, atau PNG"
        ),
});

interface Props {
    onNext: (responseData?: any) => void;
    existingData?: any;
}

export default function IdentityVerification({ onNext, existingData }: Props) {
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [captureMode, setCaptureMode] = useState<"upload" | "camera" | null>(
        null
    );
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraReady, setCameraReady] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Load existing data
    useEffect(() => {
        const savedData = sessionStorage.getItem("identityVerificationData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData.photoPreview) {
                    setPhotoPreview(parsedData.photoPreview);
                }
            } catch (error) {
                console.error(
                    "Error loading saved identity verification data:",
                    error
                );
            }
        }
    }, []);

    // Save data to session storage
    useEffect(() => {
        if (photoPreview) {
            const identityData = {
                photoPreview: photoPreview,
                hasPhoto: !!photo,
            };
            sessionStorage.setItem(
                "identityVerificationData",
                JSON.stringify(identityData)
            );
        }
    }, [photoPreview, photo]);

    // Cleanup camera stream
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    // Handle video element when stream changes
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;

            const video = videoRef.current;

            const handleLoadedMetadata = () => {
                console.log("Video metadata loaded");
                setCameraReady(true);
            };

            const handleCanPlay = () => {
                console.log("Video can play");
                video.play().catch(console.error);
            };

            video.addEventListener("loadedmetadata", handleLoadedMetadata);
            video.addEventListener("canplay", handleCanPlay);

            return () => {
                video.removeEventListener(
                    "loadedmetadata",
                    handleLoadedMetadata
                );
                video.removeEventListener("canplay", handleCanPlay);
            };
        }
    }, [stream]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file: File) => {
        try {
            // Validate file
            identityVerificationSchema.parse({ photo: file });

            setPhoto(file);
            setErrors({});

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            setCaptureMode(null);
            toast.success("Foto berhasil diupload!");
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                toast.error(Object.values(newErrors)[0]);
            }
        }
    };

    const startCamera = async () => {
        try {
            setCameraReady(false);

            // Stop existing stream first
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            // Request camera access with fallback options
            let mediaStream;
            try {
                // Try with ideal constraints first
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280, min: 640 },
                        height: { ideal: 720, min: 480 },
                        facingMode: "user",
                    },
                    audio: false,
                });
            } catch (error) {
                console.log("Trying with basic constraints...");
                // Fallback to basic constraints
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",
                    },
                    audio: false,
                });
            }

            console.log("Camera stream obtained:", mediaStream);
            setStream(mediaStream);
            setCaptureMode("camera");
        } catch (error) {
            console.error("Error accessing camera:", error);
            toast.error(
                "Gagal mengakses kamera. Pastikan kamera tersedia dan izin telah diberikan."
            );
            setCaptureMode(null);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current && cameraReady) {
            const canvas = canvasRef.current;
            const video = videoRef.current;

            // Check if video is actually playing
            if (video.readyState < 3) {
                toast.error("Kamera belum siap. Tunggu sebentar...");
                return;
            }

            try {
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Draw video frame to canvas
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Convert to blob
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const file = new File(
                                    [blob],
                                    `captured-photo-${Date.now()}.jpg`,
                                    {
                                        type: "image/jpeg",
                                        lastModified: Date.now(),
                                    }
                                );

                                console.log("Photo captured:", file);
                                handleFileUpload(file);
                                stopCamera();
                            } else {
                                toast.error("Gagal mengambil foto. Coba lagi.");
                            }
                        },
                        "image/jpeg",
                        0.8
                    );
                } else {
                    toast.error("Gagal mengakses canvas context.");
                }
            } catch (error) {
                console.error("Error capturing photo:", error);
                toast.error("Gagal mengambil foto. Coba lagi.");
            }
        } else {
            toast.error("Kamera belum siap atau tidak tersedia.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
                console.log("Camera track stopped:", track);
            });
            setStream(null);
        }
        setCaptureMode(null);
        setCameraReady(false);

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const retakePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
        setErrors({});
        sessionStorage.removeItem("identityVerificationData");
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!photo && !photoPreview) {
            setErrors({ photo: "Foto identitas harus diupload" });
            toast.error("Harap upload foto identitas terlebih dahulu");
            return;
        }

        setProcessing(true);

        try {
            const identityData = {
                photo: photo,
                photoPreview: photoPreview,
                uploadedAt: new Date().toISOString(),
            };

            sessionStorage.setItem(
                "identityVerificationData",
                JSON.stringify({
                    ...identityData,
                    photo: null, // Don't store file in session storage
                })
            );

            toast.success("Verifikasi identitas berhasil!");
            onNext(identityData);
        } catch (error) {
            console.error("Error saving identity verification data:", error);
            toast.error("Gagal menyimpan data verifikasi identitas");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Verifikasi Identitas
                </h2>
                <p className="text-gray-600">
                    Silakan ambil foto atau unggah dari komputer Anda
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload Area */}
                {!photoPreview && captureMode !== "camera" && (
                    <div className="max-w-lg mx-auto">
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                                errors.photo
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                            )}
                            // onDragOver={handleDragOver}
                            // onDrop={handleDrop}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                                        Silakan ambil foto atau unggah dari
                                        komputer Anda
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Format: JPG, JPEG, PNG • Maksimal: 5MB
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                    <Button
                                        type="button"
                                        onClick={startCamera}
                                        className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white"
                                        disabled={processing}
                                    >
                                        <Camera className="w-4 h-4" />
                                        Take a photo
                                    </Button>

                                    {/* <span className="text-gray-400">Atau</span> */}

                                    {/* <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="flex items-center gap-2"
                                        disabled={processing}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload photo
                                    </Button> */}
                                </div>

                                {/* <p className="text-xs text-gray-400">
                                    Drag and drop file di sini atau klik tombol
                                    di atas
                                </p> */}
                            </div>
                        </div>

                        {errors.photo && (
                            <p className="text-sm text-red-500 text-center mt-2">
                                {errors.photo}
                            </p>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                )}

                {/* Camera View */}
                {captureMode === "camera" && (
                    <div className="max-w-lg mx-auto">
                        <div className="bg-black rounded-lg overflow-hidden relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-auto min-h-[300px]"
                                style={{ objectFit: "cover" }}
                            />

                            {/* Loading indicator */}
                            {!cameraReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="text-white text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                        <p>Mempersiapkan kamera...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-3 mt-4">
                            <Button
                                type="button"
                                onClick={capturePhoto}
                                disabled={!cameraReady}
                                className="bg-blue-900 hover:bg-blue-800"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                {cameraReady ? "Ambil Foto" : "Tunggu..."}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={stopCamera}
                            >
                                Batal
                            </Button>
                        </div>

                        {/* Debug info */}
                        {process.env.NODE_ENV === "development" && (
                            <div className="mt-2 text-xs text-gray-500 text-center">
                                Stream: {stream ? "Active" : "Inactive"} |
                                Camera Ready: {cameraReady ? "Yes" : "No"} |
                                Video Ready State:{" "}
                                {videoRef.current?.readyState || "N/A"}
                            </div>
                        )}
                    </div>
                )}

                {/* Photo Preview */}
                {photoPreview && (
                    <div className="max-w-lg mx-auto">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={photoPreview}
                                alt="Identity Photo Preview"
                                className="w-full h-auto max-h-96 object-cover"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={retakePhoto}
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={retakePhoto}
                            className="flex items-center gap-2 mt-4 mx-auto mb-4"
                        >
                            Hapus Foto
                        </Button>

                        <div className="flex items-center justify-center text-green-600">
                            <Check className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                                Validasi foto berhasil!
                            </span>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing || (!photo && !photoPreview)}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        {processing ? "Menyimpan..." : "Lanjutkan"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
