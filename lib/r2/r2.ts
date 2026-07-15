import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "https://pub-4eb07e980f8240e192ddd95cf5a0dd76.r2.dev";

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    throw new Error("Missing R2 credentials");
}
export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
    }
});

export async function getSignedUrlForUpload(
    key: string,
    contentType: string
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType
    })

    try {
        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
        return signedUrl
    } catch (error) {
        console.error('Error generating signed URL:', error)
        throw error
    }
}

export async function getSignedUrlForDownload(key: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key
    })

    try {
        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
        return signedUrl
    } catch (error) {
        console.error('Error generating signed URL:', error)
        throw error
    }
}

export function getPublicUrlForKey(storageKey: string): string {
    if (/^https?:\/\//.test(storageKey)) {
        return storageKey
    }

    return `${R2_PUBLIC_DOMAIN.replace(/\/$/, "")}/${storageKey.replace(/^\//, "")}`
}
