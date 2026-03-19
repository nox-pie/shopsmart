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
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16 animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-prime mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-slate-500">
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
              className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none"
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
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-slate-500 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center animate-fade-up animate-delay-200 flex flex-col items-center">
        <p className="text-slate-500 mb-4">Still have questions?</p>
        <button className="px-8 py-3 bg-prime text-white rounded-full font-medium hover:bg-slate-800 transition-colors pointer-cursor">
          Contact Concierge
        </button>
      </div>
    </div>
  );
};

export default FAQ;
