const About = () => {
  return (
    <div className="mx-auto min-h-[100dvh] min-h-screen max-w-5xl px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-24 sm:pt-32">
      <div className="mb-14 animate-fade-up text-center sm:mb-20">
        <h1 className="mb-4 text-3xl font-display font-extrabold tracking-tight text-prime sm:text-5xl md:text-6xl lg:text-7xl">
          Redefining Essentials.
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg md:text-xl">
          Founded on the principle that everyday items deserve extraordinary
          design. We craft premium pieces for the modern lifestyle.
        </p>
      </div>

      <div className="mb-16 grid items-center gap-10 animate-fade-up animate-delay-100 md:mb-24 md:grid-cols-2 md:gap-16">
        <div className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800"
            alt="Our Studio"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-display font-bold text-prime">
            Our Philosophy
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            We believe that true luxury lies in simplicity and uncompromising
            quality. Every product we release is the culmination of relentless
            iteration, sourcing the finest materials from ethical suppliers
            globally.
          </p>
          <p className="text-slate-500 text-lg leading-relaxed">
            By cutting out traditional retail markups, we deliver structural
            integrity and premium aesthetics directly to your door at a fraction
            of the expected cost.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-100 pt-16 animate-fade-up animate-delay-200">
        {[
          { stat: '2018', label: 'Founded' },
          { stat: '15M+', label: 'Customers' },
          { stat: '40', label: 'Countries' },
          { stat: '0% ', label: 'Carbon Footprint' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-prime mb-2">
              {item.stat}
            </div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
