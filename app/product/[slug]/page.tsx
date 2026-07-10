import { getProduct, getRelated } from "@/data/products";;
import { Metadata } from "next";
import ProductPageClientArea from "@/components/product/ProductPageClientArea";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProduct(slug);

  if (!product) return {};

  return {
    title: `${product.name} — Glow & Go`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Glow & Go`,
      description: product.description,
      images: [
        {
          url: product.image as string,
        },
      ],
      type: "music.song", // Next.js types explicitly map standard 'product' to literal extensions or basic types. For retail products, standard OG tags fall back cleanly.
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const slug = (await params).slug;
  const product = await getProduct(slug);
  if (!product) {
      return (
        <>
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
            <p className="text-center text-zinc-500">Product not found.</p>
          </div>
        </>
      );
    }
  const related = getRelated(product.slug, 4);

  return <ProductPageClientArea product={product} related={related} />;
}