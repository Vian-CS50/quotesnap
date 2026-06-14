"use client";

const testimonials = [
  {
    quote:
      "Was spending every Sunday arvo doing quotes instead of with the kids. Now I write them in the van and the app reminds me to follow up. Won 3 jobs last week I would've forgotten.",
    name: "Dave M.",
    role: "Landscaper",
    location: "Golden Grove, SA",
    initials: "DM",
  },
  {
    quote:
      "Sent a quote while I was still in the client's driveway. The follow-up message went out 2 days later. They signed that afternoon.",
    name: "Sarah K.",
    role: "Landscaper",
    location: "McLaren Vale, SA",
    initials: "SK",
  },
  {
    quote:
      "Used to write quotes on the back of receipts. Now they look professional AND the follow-ups happen without me thinking about it.",
    name: "Mike R.",
    role: "Pool Builder",
    location: "Adelaide Hills, SA",
    initials: "MR",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1917] mb-4">
            Real tradies, real results
          </h2>
          <p className="text-base md:text-lg text-[#A8A29E] max-w-2xl mx-auto">
            From Adelaide landscapers who actually use it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#F5F4F0] border border-[#D6D3D1] p-6 relative"
            >
              <span className="absolute top-4 right-4 text-5xl font-serif text-[#C2410C]/10 select-none leading-none">
                &ldquo;
              </span>

              <p className="text-[#1C1917] text-base leading-relaxed mb-6 relative z-10">
                {t.quote}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#D6D3D1] flex items-center justify-center bg-white">
                  <span className="text-[#C2410C] font-bold text-sm">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">{t.name}</p>
                  <p className="text-xs text-[#C2410C]">
                    {t.role}
                    <span className="text-[#A8A29E]">, {t.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
