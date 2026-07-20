import { userRoleEnum } from "@/lib/db/schema";
import { StaticImageData } from "next/image";

export type UserRole = "admin" | "user";

export interface SessionUser {
    uid: string;
    email: string | undefined;
    role: UserRole;
    emailVerified: boolean;
}

type InstagramImagePost = {
    type: "image";
    image: StaticImageData;
    alt: string;
    href?: string;
};

type InstagramEmbedPost = {
    type: "embed";
    embedCode: string; // Changed from permalink to accept the raw string
};

export type InstagramPost = InstagramImagePost | InstagramEmbedPost;

export type InstagramGalleryProps = {
    posts: InstagramPost[];
    profileUrl: string;
};