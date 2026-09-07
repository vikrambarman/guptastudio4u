// components/erp/admin/MediaUploader.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import { UPLOAD_LIMITS } from "@/lib/config/upload";
import type { MediaType } from "@/lib/db/models/Media";

interface QueueItem {
    id: string;
    file: File;
    status: "pending" | "uploading" | "success" | "error";
    progress: number;
    error?: string;
}

interface MediaUploaderProps {
    eventId: string;
    onUploaded: () => void;
}

const TYPE_TABS: { value: MediaType; label: string; icon: string }[] = [
    { value: "photo", label: "Photos", icon: "📷" },
    { value: "video", label: "Videos", icon: "🎥" },
    { value: "reel", label: "Reels", icon: "🎬" },
];

/** Upload progress track karne ke liye XHR (fetch isse support nahi karta) */
function uploadWithProgress(
    url: string,
    file: File,
    onProgress: (pct: number) => void
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed (status ${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
    });
}

export default function MediaUploader({
    eventId,
    onUploaded,
}: MediaUploaderProps) {
    const [activeType, setActiveType] = useState<MediaType>("photo");
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const limits = UPLOAD_LIMITS[activeType];

    const validateFile = (file: File): string | null => {
        const maxBytes = limits.maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            return `${limits.maxSizeMB}MB se badi file allowed nahi`;
        }
        if (!limits.mimeTypes.includes(file.type)) {
            return `"${file.type}" format supported nahi hai`;
        }
        return null;
    };

    const processFile = useCallback(
        async (item: QueueItem) => {
            setQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q))
            );

            try {
                const presignRes = await fetch("/api/upload/presigned", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        eventId,
                        fileName: item.file.name,
                        fileType: activeType,
                        mimeType: item.file.type,
                        fileSize: item.file.size,
                    }),
                });
                const presignJson = await presignRes.json();
                if (!presignJson.success) throw new Error(presignJson.error);

                await uploadWithProgress(
                    presignJson.data.uploadUrl,
                    item.file,
                    (pct) => {
                        setQueue((prev) =>
                            prev.map((q) => (q.id === item.id ? { ...q, progress: pct } : q))
                        );
                    }
                );

                const confirmRes = await fetch("/api/upload/confirm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        eventId,
                        r2Key: presignJson.data.r2Key,
                        fileName: item.file.name,
                        originalName: item.file.name,
                        fileType: activeType,
                        mimeType: item.file.type,
                        fileSize: item.file.size,
                    }),
                });
                const confirmJson = await confirmRes.json();
                if (!confirmJson.success) throw new Error(confirmJson.error);

                setQueue((prev) =>
                    prev.map((q) =>
                        q.id === item.id ? { ...q, status: "success", progress: 100 } : q
                    )
                );
                onUploaded();
            } catch (err) {
                setQueue((prev) =>
                    prev.map((q) =>
                        q.id === item.id
                            ? {
                                ...q,
                                status: "error",
                                error: err instanceof Error ? err.message : "Upload failed",
                            }
                            : q
                    )
                );
            }
        },
        [eventId, activeType, onUploaded]
    );

    const addFiles = (files: FileList | null) => {
        if (!files) return;
        const newItems: QueueItem[] = Array.from(files).map((file) => {
            const error = validateFile(file);
            return {
                id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
                file,
                status: error ? "error" : "pending",
                progress: 0,
                error: error || undefined,
            };
        });

        setQueue((prev) => [...prev, ...newItems]);

        newItems
            .filter((item) => item.status === "pending")
            .forEach((item) => processFile(item));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const clearCompleted = () => {
        setQueue((prev) => prev.filter((q) => q.status !== "success"));
    };

    const activeTabInfo = TYPE_TABS.find((t) => t.value === activeType);

    return (
        <div>
            <div className="flex gap-2 mb-4">
                {TYPE_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        className={`btn btn-sm ${activeType === tab.value ? "btn-gold" : "btn-dark"}`}
                        onClick={() => setActiveType(tab.value)}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div
                className={`upload-zone ${dragging ? "dragging" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <div className="upload-zone-icon">📤</div>
                <div className="upload-zone-text">
                    {activeTabInfo?.label} yaha drag karein ya click karein
                </div>
                <div className="upload-zone-hint">
                    Max {limits.maxSizeMB}MB per file
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={limits.mimeTypes.join(",")}
                    style={{ display: "none" }}
                    onChange={(e) => addFiles(e.target.files)}
                />
            </div>

            {queue.length > 0 && (
                <div className="card mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted">
                            {queue.filter((q) => q.status === "success").length} /{" "}
                            {queue.length} uploaded
                        </span>
                        <button className="btn btn-ghost btn-sm" onClick={clearCompleted}>
                            Clear Completed
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {queue.map((item) => (
                            <div key={item.id}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-white-soft">{item.file.name}</span>
                                    {item.status === "success" && (
                                        <span className="text-gold">✓ Done</span>
                                    )}
                                    {item.status === "error" && (
                                        <span style={{ color: "var(--color-error)" }}>
                                            {item.error}
                                        </span>
                                    )}
                                    {item.status === "uploading" && (
                                        <span className="text-muted">{item.progress}%</span>
                                    )}
                                </div>
                                {(item.status === "uploading" || item.status === "success") && (
                                    <div className="upload-progress">
                                        <div
                                            className="upload-progress-bar"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}