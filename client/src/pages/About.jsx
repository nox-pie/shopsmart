const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-20 animate-fade-up">
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-prime mb-6 tracking-tight">
          Redefining Essentials.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Founded on the principle that everyday items deserve extraordinary
          design. We craft premium pieces for the modern lifestyle.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-24 animate-fade-up animate-delay-100">
        <div className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800" alt="Our Studio" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
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
