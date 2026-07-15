import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getPublicUrlForKey, getSignedUrlForUpload } from "@/lib/r2/r2";

const createUploadSchema = z.object({
    imageName: z.string().min(1),
    mimeType: z.string().min(1),
    fileSize: z.number().int().positive().max(5 * 1024 * 1024),
    contentType: z.string().min(1),
});

function getSafeFileName(fileName: string) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const parsed = createUploadSchema.safeParse(data);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Invalid data" },
                { status: 400 }
            );
        }

        const { imageName, mimeType, fileSize, contentType } = parsed.data;
        const effectiveContentType = contentType || mimeType;

        if (!effectiveContentType.startsWith("image/")) {
            return NextResponse.json(
                { success: false, error: "Only image uploads are allowed." },
                { status: 400 }
            );
        }

        const storageKey = `products/${Date.now()}-${getSafeFileName(imageName)}`;

        const signedUrl = await getSignedUrlForUpload(storageKey, effectiveContentType);

        return NextResponse.json({
            success: true,
            signedUrl,
            storageKey,
            publicUrl: getPublicUrlForKey(storageKey),
            imageName,
            mimeType,
            fileSize,
        });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate signed URL" },
            { status: 500 }
        );
    }
}
