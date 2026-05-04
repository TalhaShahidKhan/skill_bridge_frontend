"use client";

import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const onUpload = useCallback(
    (result: any) => {
      if (result.event !== "success") return;
      const info = result.info;
      if (typeof info !== "string" && info?.secure_url) {
        onChange(info.secure_url as string);
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <div className="z-10 absolute top-1 right-1">
              <button
                type="button"
                onClick={onRemove}
                className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition shadow-sm"
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
            <Image fill className="object-cover" alt="Profile" src={value} />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
            <ImagePlus className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <button
              type="button"
              onClick={onClick}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 cursor-pointer"
            >
              {value ? "Change Photo" : "Upload Photo"}
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
