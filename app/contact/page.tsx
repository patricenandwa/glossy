import {  Mail, MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";
import { Metadata } from "next";
import ContactRow from "@/components/Contact/ContactRow";
import ContactForm from "@/components/Contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Glow & Go",
  description: "Reach the Glow & Go studio via WhatsApp, Instagram, TikTok, or email.",
};



export default function ContactPage() {

  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Contact</p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Say hello.</h1>
          <p className="mt-4 max-w-[42ch] text-zinc-600">Our studio replies fastest on WhatsApp. Prefer email? We'll get back within one working day.</p>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            <ContactRow icon={MessageCircle} label="WhatsApp" value={`+${SITE.whatsapp}`} href={`https://wa.me/${SITE.whatsapp}`} />
            <ContactRow icon={Instagram} label="Instagram" value="@glowandgo" href={SITE.instagram} />
            <ContactRow icon={Mail} label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
            <div className="rounded-3xl bg-soft-pink p-6 ring-1 ring-black/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Studio hours</p>
              <p className="mt-2 text-charcoal">{SITE.hours}</p>
              <p className="text-sm text-zinc-500">{SITE.location}</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

const Instagram = () => {
  return (
    <svg fill="#000000" width="25px" height="25px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
      <path d="M128,84a44,44,0,1,0,44,44A44.04978,44.04978,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36.04061,36.04061,0,0,1,128,164ZM172,32H84A52.059,52.059,0,0,0,32,84v88a52.059,52.059,0,0,0,52,52h88a52.059,52.059,0,0,0,52-52V84A52.059,52.059,0,0,0,172,32Zm44,140a44.04978,44.04978,0,0,1-44,44H84a44.04978,44.04978,0,0,1-44-44V84A44.04978,44.04978,0,0,1,84,40h88a44.04978,44.04978,0,0,1,44,44ZM188,76a8,8,0,1,1-8-8A8.00917,8.00917,0,0,1,188,76Z"/>
    </svg>
  );
};
