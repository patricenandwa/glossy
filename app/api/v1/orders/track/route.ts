import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchTrackableOrder } from "@/lib/orders";

const trackSchema = z.object({
  orderNumber: z.string().trim().min(3),
  phone: z.string().trim().min(7),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = trackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid order number and phone." }, { status: 400 });
    }

    const order = await fetchTrackableOrder(parsed.data.orderNumber, parsed.data.phone);

    if (!order) {
      return NextResponse.json(
        { error: "We couldn't find that order. Double-check the number and phone." },
        { status: 404 },
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order tracking lookup failed:", error);
    return NextResponse.json({ error: "Unable to check this order right now." }, { status: 500 });
  }
}
