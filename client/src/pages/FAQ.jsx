import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day extended return policy. Items must be unworn, unwashed, and in their original packaging. Returns are complimentary for all domestic orders.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping takes 2-3 business days within the continental US. Express overnight shipping is available at checkout. International shipping varies by destination.',
    },
    {
      question: 'Are your products sustainably made?',
      answer:
        'Yes. Sustainability is intrinsic to our process. We use 100% recycled packaging and partner strictly with ethical, fair-trade certified manufacturers globally.',
    },
    {
      question: 'Do you offer international shipping?',
      answer:
        'We currently ship to over 40 countries worldwide. Duties and taxes are calculated directly at checkout so there are no hidden fees upon delivery.',
    },
  ];

  return (
    <div className="mx-auto min-h-[100dvh] min-h-screen max-w-3xl px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-24 sm:pt-32">
      <div className="text-center mb-16 animate-fade-up">
        <h1 className="mb-4 text-3xl font-display font-bold text-prime sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-slate-500 sm:text-lg">
          Everything you need to know about our products and services.
        </p>
      </div>

      <div className="space-y-4 animate-fade-up animate-delay-100">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${openIndex === index ? 'border-prime bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 px-4 py-5 text-left focus:outline-none sm:px-6 sm:py-6"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <h3
                className={`font-semibold text-lg transition-colors ${openIndex === index ? 'text-prime' : 'text-slate-700'}`}
              >
                {faq.question}
              </h3>
              <ChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-prime' : 'text-slate-400'}`}
              />
            </button>
            <div
              className={`overflow-hidden px-4 transition-all duration-300 ease-in-out sm:px-6 ${openIndex === index ? 'max-h-[min(28rem,75vh)] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-slate-500 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center animate-fade-up animate-delay-200 flex flex-col items-center">
        <p className="text-slate-500 mb-4">Still have questions?</p>
        <a
          href="mailto:concierge@shopsmart.example?subject=ShopSmart%20Concierge"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-prime px-8 py-3 font-medium text-white transition-colors hover:bg-slate-800"
        >
          Contact Concierge
        </a>
      </div>
    </div>
  );
};

export default FAQ;
