import { ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: 'The Architecture of Everyday Carry',
      category: 'Design',
      date: 'Oct 12, 2023',
      excerpt:
        'Exploring the structural integrity and aesthetic minimalism involved in designing our latest collection.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Sustainable Manufacturing in 2024',
      category: 'Sustainability',
      date: 'Sep 28, 2023',
      excerpt:
        'How we achieved a completely carbon-neutral supply chain through innovative material sourcing.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Interview: The Minds Behind the Aesthetic',
      category: 'Editorial',
      date: 'Aug 15, 2023',
      excerpt:
        'A deep dive conversation with our head designers detailing the philosophy shaping the future.',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=600'
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-prime mb-4">
          Editorial
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Insights, design philosophies, and cultural commentary from the
          ShopSmart creative studio.
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden flex flex-col md:flex-row animate-fade-up animate-delay-100 group cursor-pointer">
        <div className="md:w-1/2 aspect-video md:aspect-auto bg-slate-200 relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" alt="Featured Post" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Manifesto
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-xs font-medium text-slate-500">
              Nov 01, 2023
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-prime mb-4 group-hover:text-accent transition-colors">
            The Future of Minimalist Utility
          </h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Why less truly is more. A comprehensive look into how stripping away
            the non-essential creates room for profound, lasting utility in
            everyday life.
          </p>
          <span className="inline-flex items-center space-x-2 text-prime font-bold group-hover:translate-x-2 transition-transform">
            <span>Read Article</span>
            <ArrowRight size={18} />
          </span>
        </div>
      </div>

      {/* Grid Posts */}
      <div className="grid md:grid-cols-3 gap-8 animate-fade-up animate-delay-200">
        {posts.map((post, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[4/3] rounded-2xl bg-slate-100 mb-6 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
              <h3 className="text-2xl font-display font-bold text-prime mb-3 group-hover:text-accent transition-colors">
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
    </div>
  );
};

export default Blog;
