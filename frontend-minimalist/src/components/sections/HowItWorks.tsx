"use client";

const steps = [
  {
    num: "01",
    title: "Record on site",
    body: "Talk through the job while you are still on the tools. 30 seconds, done.",
  },
  {
    num: "02",
    title: "AI writes it",
    body: "Line items, materials, labour, GST. All calculated automatically.",
  },
  {
    num: "03",
    title: "Send PDF",
    body: "Professional quote hits their inbox before you leave the driveway.",
  },
  {
    num: "04",
    title: "Auto follow-up",
    body: "Get reminded to follow up. Use one-click templates. Win jobs you'd normally forget.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1917] mb-4">
            How it works
          </h2>
          <p className="text-base md:text-lg text-[#A8A29E] max-w-2xl mx-auto">
            Three steps. That is it.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 border border-[#D6D3D1] flex items-center justify-center mx-auto mb-5 bg-white">
                <span className="text-lg font-bold text-[#C2410C]">
                  {step.num}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#78716C] leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
