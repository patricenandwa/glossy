import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  markPaystackPaymentFailed,
  markPaystackPaymentPaid,
  verifyPaystackTransaction,
} from "@/lib/checkout/server";

function buildCheckoutFailureUrl(request: NextRequest, reference?: string) {
  const url = new URL("/checkout", request.url);
  url.searchParams.set("payment", "failed");
  if (reference) {
    url.searchParams.set("reference", reference);
  }
  return url;
}

export async function GET(request: NextRequest) {
  const reference =
    request.nextUrl.searchParams.get("reference") ??
    request.nextUrl.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(buildCheckoutFailureUrl(request));
  }

  try {
    const verification = await verifyPaystackTransaction(reference);

    if (verification.status !== "success") {
      await markPaystackPaymentFailed(reference, verification);
      return NextResponse.redirect(buildCheckoutFailureUrl(request, reference));
    }

    const orderNumber = await markPaystackPaymentPaid(reference, verification);
    const destination = new URL(`/order-confirmed/${orderNumber}`, request.url);
    destination.searchParams.set("payment", "success");
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error("Paystack callback verification failed:", error);
    await markPaystackPaymentFailed(reference).catch((markError) => {
      console.error("Failed to mark Paystack payment as failed:", markError);
    });
    return NextResponse.redirect(buildCheckoutFailureUrl(request, reference));
  }
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-paystack-signature");
    if (!signature || !process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.text();
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
        status?: string;
        amount?: number;
        id?: number | string;
        paid_at?: string;
        gateway_response?: string;
        metadata?: Record<string, unknown>;
      };
    };

    const reference = body.data?.reference;
    if (!reference) {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    if (body.event === "charge.success" || body.data?.status === "success") {
      await markPaystackPaymentPaid(reference, body.data ?? {});
      return NextResponse.json({ status: "processed" }, { status: 200 });
    }

    if (body.event === "charge.failed" || body.data?.status === "failed") {
      await markPaystackPaymentFailed(reference, body.data);
    }

    return NextResponse.json({ status: "acknowledged" }, { status: 200 });
  } catch (error) {
    console.error("Error processing Paystack webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
