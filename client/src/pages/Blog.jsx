import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const Blog = () => {
  const [activePost, setActivePost] = useState(null);

  const featured = {
    title: 'The Future of Minimalist Utility',
    category: 'Manifesto',
    date: 'Nov 01, 2023',
    excerpt:
      'Why less truly is more. A comprehensive look into how stripping away the non-essential creates room for profound, lasting utility in everyday life.',
    body: 'Minimalist utility is not about owning fewer things for its own sake—it is about choosing objects that earn their place through reliability, clarity of form, and adaptability across contexts. In this long-form piece, we trace how ShopSmart prototypes are stress-tested in real urban routines before they ever reach production. We also outline our material R&D pipeline and how feedback from early adopters reshaped our carry systems for the better.',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=85&w=1200',
  };

  const posts = [
    {
      title: 'The Architecture of Everyday Carry',
      category: 'Design',
      date: 'Oct 12, 2023',
      excerpt:
        'Exploring the structural integrity and aesthetic minimalism involved in designing our latest collection.',
      body: 'Everyday carry is a systems design problem: weight distribution, pocket geometry, and tactile feedback must align so the object disappears into your day until you need it. Our design team walks through sketch iterations, 3D-printed maquettes, and field trials that informed the current capsule line.',
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Sustainable Manufacturing in 2024',
      category: 'Sustainability',
      date: 'Sep 28, 2023',
      excerpt:
        'How we achieved a completely carbon-neutral supply chain through innovative material sourcing.',
      body: 'Carbon neutrality required rethinking logistics windows, consolidating dye batches, and partnering with mills that publish third-party audits. This article breaks down the trade-offs we accepted—and the quality gains we did not compromise on.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Interview: The Minds Behind the Aesthetic',
      category: 'Editorial',
      date: 'Aug 15, 2023',
      excerpt:
        'A deep dive conversation with our head designers detailing the philosophy shaping the future.',
      body: 'A transcript-style conversation covering references from Brutalist architecture to contemporary dance, and how those influences translate into proportion, negative space, and restrained palettes across ShopSmart collections.',
      image:
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <div className="mx-auto min-h-[100dvh] min-h-screen max-w-7xl px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-24 sm:pt-32">
      <div className="mb-12 animate-fade-up sm:mb-16">
        <h1 className="mb-4 text-3xl font-display font-extrabold text-prime sm:text-4xl md:text-5xl">
          Editorial
        </h1>
        <p className="max-w-2xl text-base text-slate-500 sm:text-lg">
          Insights, design philosophies, and cultural commentary from the
          ShopSmart creative studio.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => setActivePost(featured)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActivePost(featured);
          }
        }}
        className="group mb-16 flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 animate-fade-up animate-delay-100 md:flex-row md:rounded-[2rem]"
      >
        <div className="relative aspect-[16/10] min-h-[200px] overflow-hidden bg-slate-200 md:aspect-auto md:min-h-[280px] md:w-1/2 lg:min-h-[360px]">
          <img
            src={featured.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10 md:w-1/2 md:p-16">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              {featured.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-xs font-medium text-slate-500">
              {featured.date}
            </span>
          </div>
          <h2 className="mb-4 text-2xl font-display font-bold text-prime transition-colors group-hover:text-accent sm:text-3xl md:text-4xl">
            {featured.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-500 sm:mb-8 sm:text-lg">
            {featured.excerpt}
          </p>
          <span className="inline-flex items-center space-x-2 text-prime font-bold group-hover:translate-x-2 transition-transform">
            <span>Read Article</span>
            <ArrowRight size={18} />
          </span>
        </div>
      </div>

      <div className="grid gap-8 animate-fade-up animate-delay-200 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => setActivePost(post)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActivePost(post);
              }
            }}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/3] rounded-2xl bg-slate-100 mb-6 overflow-hidden relative">
              <img
                src={post.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="px-2">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {post.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-xs font-medium text-slate-500">
                  {post.date}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-display font-bold text-prime transition-colors group-hover:text-accent sm:text-2xl">
                {post.title}
              </h3>
              <p className="text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center space-x-2 text-prime font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>Read More</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {activePost ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-prime/45 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative max-h-[min(92dvh,100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-2xl sm:rounded-[2rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Close article"
              onClick={() => setActivePost(null)}
            >
              <X size={22} />
            </button>
            {activePost.image ? (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-t-3xl sm:aspect-[21/9] sm:rounded-t-[2rem]">
                <img
                  src={activePost.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
            <div className="p-5 pt-12 sm:p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                {activePost.category}
              </p>
              <p className="text-sm text-slate-500 mb-4">{activePost.date}</p>
              <h2
                id="blog-modal-title"
                className="mb-4 text-2xl font-display font-bold text-prime sm:mb-6 sm:text-3xl"
              >
                {activePost.title}
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                {activePost.excerpt}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {activePost.body}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
