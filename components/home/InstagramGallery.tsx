"use client";

import { useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import { InstagramGalleryProps } from "@/types";



declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

export function InstagramGallery({ posts, profileUrl }: InstagramGalleryProps) {
  // Re-run the Instagram parser every time the posts array modifications take effect
  useEffect(() => {
    window.instgrm?.Embeds?.process();
  }, [posts]);

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onReady={() => window.instgrm?.Embeds?.process()}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {posts.map((post, index) =>
          post.type === "embed" ? (
            <article
              key={`embed-${index}`}
              className="overflow-hidden rounded-[28px] bg-white p-2 ring-1 ring-black/[0.04] w-full flex justify-center [&_blockquote]:!m-0 [&_blockquote]:!min-w-full [&_blockquote]:!max-w-full"
              dangerouslySetInnerHTML={{ __html: post.embedCode }}
            />
          ) : (
            <a
              key={`${post.alt}-${index}`}
              href={post.href ?? profileUrl}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-[28px] ring-1 ring-black/[0.04]"
            >
              <Image
                src={post.image}
                alt={post.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
              />
            </a>
          ),
        )}
      </div>
    </>
  );
}
