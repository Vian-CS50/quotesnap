"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, X, Film, Trash2, AlertCircle } from "lucide-react";

interface MediaUploadProps {
  images: string[];
  video: string | null;
  onImagesChange: (images: string[] | ((prev: string[]) => string[])) => void;
  onVideoChange: (video: string | null) => void;
}

function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = maxWidth / img.width;
      const w = scale < 1 ? maxWidth : img.width;
      const h = scale < 1 ? img.height * scale : img.height;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MediaUpload({
  images,
  video,
  onImagesChange,
  onVideoChange,
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      setVideoError(null);

      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          try {
            const compressed = await compressImage(file);
            onImagesChange((prev) => [...prev, compressed]);
          } catch {
            // fallback: raw base64
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              if (result) onImagesChange((prev) => [...prev, result]);
            };
            reader.readAsDataURL(file);
          }
        } else if (file.type.startsWith("video/")) {
          if (file.size > 10 * 1024 * 1024) {
            setVideoError("Video too large. Record a shorter clip or send photos.");
            continue;
          }
          // Only one video at a time
          if (video) {
            onVideoChange(null);
            onImagesChange([]);
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) onVideoChange(result);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [video, onImagesChange, onVideoChange]
  );

  const removeImage = useCallback(
    (index: number) => {
      onImagesChange(images.filter((_, i) => i !== index));
    },
    [images, onImagesChange]
  );

  const removeVideo = useCallback(() => {
    onVideoChange(null);
    setVideoError(null);
  }, [onVideoChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const totalMedia = images.length + (video ? 1 : 0);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {videoError && (
        <div className="mb-3 p-3 rounded-sm bg-red-500/10 border border-danger/20 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {videoError}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full rounded-sm border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-[#C2410C] bg-orange-50"
            : "border-[#D6D3D1] hover:border-[#C2410C]/50 hover:bg-orange-50"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <ImagePlus className="w-5 h-5 text-[#A8A29E]" />
            <Film className="w-5 h-5 text-[#A8A29E]" />
          </div>
          <p className="text-sm text-[#A8A29E]">
            {totalMedia > 0
              ? `${totalMedia} file${totalMedia > 1 ? "s" : ""} added. Click to add more.`
              : "Drop photos or a video here, or click to browse"}
          </p>
          <p className="text-xs text-[#A8A29E]/60">
            Photos auto-compressed. Video max 10MB.
          </p>
        </div>
      </div>

      {/* Photo Thumbnails */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-[#A8A29E] mb-2">Photos</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0 group">
                <img
                  src={img}
                  alt={`Site photo ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-sm border border-[#D6D3D1]"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Preview */}
      {video && (
        <div className="mt-4">
          <p className="text-xs text-[#A8A29E] mb-2">Video walkthrough</p>
          <div className="relative group max-w-xs">
            <video
              src={video}
              controls
              className="w-full rounded-sm border border-[#D6D3D1]"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeVideo();
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
