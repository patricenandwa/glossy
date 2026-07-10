export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <section className="bg-white py-14 sm:py-20">
            <article className="mx-auto max-w-3xl space-y-6 px-5 text-zinc-600 sm:px-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-charcoal [&_h2]:mt-8">
            {children}
            </article>
        </section>
        </>
    );
}