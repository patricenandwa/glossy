import { NextRequest, NextResponse } from "next/server";
import { createCheckoutOrder, checkoutPayloadSchema } from "@/lib/checkout/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid checkout payload.",
        },
        { status: 400 },
      );
    }

    const result = await createCheckoutOrder(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create your order right now.",
      },
      { status: 500 },
    );
  }
}
