import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { APIProductResponse, DbShade } from "@/lib/db/schema";

export type CartItem = {
  productSlug: string;
  productName: string;
  productImage: string;
  price: number;
  shade: DbShade;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (product: APIProductResponse, shade: DbShade, quantity?: number) => void;
  removeItem: (slug: string, shadeName: string) => void;
  updateQuantity: (slug: string, shadeName: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  itemCount: () => number;
  subtotal: () => number;
};

function isValidShade(value: unknown): value is DbShade {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "hex" in value &&
    typeof value.name === "string" &&
    value.name.length > 0 &&
    typeof value.hex === "string" &&
    value.hex.length > 0
  );
}

function isLegacyFallbackShade(shade: DbShade) {
  return shade.name === "Signature" && shade.hex === "#d7b49e";
}

function normalizeShade(shade: unknown, fallbackShades: unknown[] = []): DbShade | null {
  if (isValidShade(shade)) {
    return isLegacyFallbackShade(shade) ? null : shade;
  }

  const fallbackShade = fallbackShades.find(isValidShade);
  return fallbackShade ?? null;
}

function normalizePrice(price: unknown) {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  if (typeof price === "string") {
    const parsed = Number(price);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeQuantity(quantity: unknown) {
  if (typeof quantity === "number" && Number.isFinite(quantity)) {
    return Math.max(1, Math.floor(quantity));
  }

  if (typeof quantity === "string") {
    const parsed = Number(quantity);
    return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
  }

  return 1;
}

function normalizeProductImage(product: APIProductResponse) {
  return product.images?.[0]?.storageKey || "/placeholder.jpg";
}

function sanitizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((item) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }

    const candidate = item as Partial<CartItem>;

    if (
      typeof candidate.productSlug !== "string" ||
      candidate.productSlug.length === 0 ||
      typeof candidate.productName !== "string" ||
      candidate.productName.length === 0
    ) {
      return [];
    }

    const shade = normalizeShade(candidate.shade);
    if (!shade) {
      return [];
    }

    return [
      {
        productSlug: candidate.productSlug,
        productName: candidate.productName,
        productImage:
          typeof candidate.productImage === "string" && candidate.productImage.length > 0
            ? candidate.productImage
            : "/placeholder.jpg",
        price: normalizePrice(candidate.price),
        shade,
        quantity: normalizeQuantity(candidate.quantity),
      },
    ];
  });
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      addItem: (product, shade, quantity = 1) =>
        set((state) => {
          const normalizedShade = normalizeShade(shade, product.shades);
          if (!normalizedShade) {
            return state;
          }
          const normalizedQuantity = normalizeQuantity(quantity);
          const existing = state.items.find(
            (i) => i.productSlug === product.slug && i.shade.name === normalizedShade.name,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing
                  ? { ...i, quantity: i.quantity + normalizedQuantity }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productSlug: product.slug,
                productName: product.name,
                productImage: normalizeProductImage(product),
                price: normalizePrice(product.price),
                shade: normalizedShade,
                quantity: normalizedQuantity,
              },
            ],
          };
        }),
      removeItem: (slug, shadeName) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productSlug === slug && i.shade.name === shadeName),
          ),
        })),
      updateQuantity: (slug, shadeName, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productSlug === slug && i.shade.name === shadeName
                ? { ...i, quantity: Math.max(1, quantity) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    {
      name: "glow-and-go-cart",
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<CartState> | undefined;

        return {
          items: sanitizeCartItems(state?.items),
          isOpen: typeof state?.isOpen === "boolean" ? state.isOpen : false,
          hasHydrated: true,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
