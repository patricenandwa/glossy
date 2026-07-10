"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(5).max(1000),
});
export default function ContactForm() {
    const [v, setV] = useState({ name: "", email: "", message: "" });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const r = schema.safeParse(v);
        if (!r.success) {
            toast.error("Please check your details");
            return;
        }
        toast.success("Message sent — we'll reply within a day.");
        setV({ name: "", email: "", message: "" });
    }
    return (
        <form onSubmit={submit} className="space-y-4 rounded-3xl bg-soft-pink p-6 ring-1 ring-black/[0.04] sm:p-8">
            <input className={inp} placeholder="Your name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
            <input className={inp} placeholder="Email address" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
            <textarea className={`${inp} resize-none`} rows={5} placeholder="How can we help?" value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
            <button className="w-full rounded-full bg-charcoal py-4 text-sm font-medium text-white">Send message</button>
        </form>
    )
}

const inp = "block w-full rounded-2xl bg-white px-4 py-3.5 text-sm ring-1 ring-black/[0.08] outline-none focus:ring-charcoal";