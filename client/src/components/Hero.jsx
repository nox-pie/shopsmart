import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-[100dvh] min-h-screen bg-surface overflow-hidden flex items-center justify-center px-4 pt-[calc(6rem+env(safe-area-inset-top,0px))] pb-12 sm:px-6 sm:pt-28 md:pt-24">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-accent/5 blur-[100px] animate-subtle-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-slate-900/5 blur-[120px] animate-subtle-pulse animate-delay-200"></div>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Text Content */}
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-full px-3 py-1 mb-8">
            <Star size={14} className="text-accent fill-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Premium Quality Assured
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-display font-extrabold leading-[1.08] tracking-tighter text-prime sm:text-5xl md:text-6xl lg:text-[5rem]">
            Unleash Your <br />{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime to-accent">
              Style.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-lg font-sans leading-relaxed">
            Discover a curated collection of modern essentials designed to
            elevate your everyday wardrobe with uncompromising quality.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/collection"
              className="w-full sm:w-auto px-8 py-4 bg-prime text-white rounded-full font-medium hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 hover-scale"
            >
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 bg-white text-prime border border-slate-200 rounded-full font-medium hover:bg-slate-50 shadow-sm transition-colors flex items-center justify-center hover-scale"
            >
              <span>Our Story</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-slate-100 pt-8 animate-fade-up animate-delay-300 sm:mt-16 sm:justify-start">
            <div>
              <p className="text-3xl font-display font-bold text-prime">15M+</p>
              <p className="text-sm text-slate-500 font-medium">
                Happy Customers
              </p>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div>
              <p className="text-3xl font-display font-bold text-prime">
                4.9/5
              </p>
              <p className="text-sm text-slate-500 font-medium">
                Global Rating
              </p>
            </div>
          </div>
        </div>

        {/* Visual Content (Abstract Premium UI) */}
        <div className="relative mx-auto hidden h-[min(380px,42vh)] w-full max-w-md md:block md:max-w-none lg:h-[600px] lg:max-h-none animate-fade-up animate-delay-200">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[28px] border border-white/50 bg-gradient-to-tr from-slate-100 to-slate-50 p-4 shadow-2xl transition-transform duration-500 hover-scale md:rounded-[40px] md:p-8">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800"
              alt="Premium Apparel Models"
              className="w-full h-full object-cover rounded-[2rem] shadow-sm border border-slate-100"
            />
            {/* Overlay abstract circle */}
            <div className="absolute bottom-12 -right-8 w-32 h-32 bg-prime rounded-full blur-2xl opacity-10"></div>
            <div className="absolute top-12 -left-8 w-40 h-40 bg-accent rounded-full blur-3xl opacity-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
