"use client"

import * as React from "react"
import { UploadCloud, CheckCircle2, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UploadedProductImage } from "@/lib/schemas/product"

interface CloudflareImageUploaderProps {
  onUploadSuccess: (image: UploadedProductImage) => void
  onRemove: () => void
  className?: string
  disabled?: boolean
}

export function CloudflareImageUploader({
  onUploadSuccess,
  onRemove,
  className,
  disabled = false,
}: CloudflareImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [statusMessage, setStatusMessage] = React.useState("Preparing upload...")
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const currentObjectUrlRef = React.useRef<string | null>(null)
  const xhrRef = React.useRef<XMLHttpRequest | null>(null)

  const revokePreviewUrl = React.useCallback(() => {
    if (!currentObjectUrlRef.current) {
      return
    }

    URL.revokeObjectURL(currentObjectUrlRef.current)
    currentObjectUrlRef.current = null
  }, [])

  React.useEffect(() => {
    return () => {
      xhrRef.current?.abort()
      revokePreviewUrl()
    }
  }, [revokePreviewUrl])

  const uploadFileToCloudflare = React.useCallback(
    (signedUrl: string, file: File) =>
      new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhrRef.current = xhr
        xhr.open("PUT", signedUrl)
        xhr.setRequestHeader("Content-Type", file.type)

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) {
            return
          }

          setProgress((event.loaded / event.total) * 100)
        }

        xhr.onload = () => {
          xhrRef.current = null

          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100)
            resolve()
            return
          }

          reject(new Error("Cloudflare upload failed."))
        }

        xhr.onerror = () => {
          xhrRef.current = null
          reject(new Error("Network error while uploading image."))
        }

        xhr.onabort = () => {
          xhrRef.current = null
          reject(new Error("Upload cancelled."))
        }

        xhr.send(file)
      }),
    []
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    revokePreviewUrl()
    const objectUrl = URL.createObjectURL(file)
    currentObjectUrlRef.current = objectUrl
    setPreviewUrl(objectUrl)
    setUploadError(null)
    setStatusMessage("Preparing secure upload...")
    setIsUploading(true)
    setProgress(0)

    try {
      const response = await fetch("/api/v1/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          contentType: file.type,
        }),
      })

      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to prepare the image upload.")
      }

      setStatusMessage("Uploading to Cloudflare...")
      await uploadFileToCloudflare(payload.signedUrl, file)
      setIsUploading(false)
      setStatusMessage("Upload complete")
      onUploadSuccess({
        publicUrl: payload.publicUrl,
        storageKey: payload.storageKey,
        imageName: payload.imageName,
        mimeType: payload.mimeType,
        fileSize: payload.fileSize,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed."
      setIsUploading(false)
      setProgress(0)
      setUploadError(message)
      setPreviewUrl(null)
      revokePreviewUrl()
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    xhrRef.current?.abort()
    setPreviewUrl(null)
    setIsUploading(false)
    setProgress(0)
    setStatusMessage("Preparing upload...")
    setUploadError(null)
    revokePreviewUrl()
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onRemove()
  }

  if (previewUrl) {
    return (
      <div className={cn("relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border bg-muted/50 p-2", className)}>
        <img
          src={previewUrl}
          alt="Preview"
          className={cn("h-48 w-full rounded-xl object-cover transition-opacity", isUploading ? "opacity-50" : "opacity-100")}
        />

        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-charcoal" />
            <div className="w-1/2 overflow-hidden rounded-full bg-white/50 ring-1 ring-black/10">
              <div
                className="h-1.5 bg-charcoal transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-charcoal">{statusMessage} {Math.round(progress)}%</span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/10 flex items-start justify-end p-2 opacity-0 hover:opacity-100 group">
            <button
              type="button"
              onClick={handleRemove}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-charcoal shadow-sm ring-1 ring-black/10 hover:bg-red-50 hover:text-red-600 transition"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </button>
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Upload complete
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 transition-colors hover:border-zinc-400 hover:bg-zinc-100", disabled && "cursor-not-allowed opacity-60", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.04] group-hover:scale-105 transition-transform">
        <UploadCloud className="h-5 w-5 text-zinc-500" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-charcoal">Click to upload image</p>
        <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
      </div>
      {uploadError && <p className="text-center text-xs text-red-500">{uploadError}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        title="Upload Image"
      />
    </div>
  )
}
