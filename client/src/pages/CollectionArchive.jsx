import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api/api';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const isArchiveId = (p) => /^s\d+$/.test(String(p.id));

const CollectionArchive = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = useCallback(() => {
    getProducts().then((data) => {
      const list = Array.isArray(data) ? data.filter(isArchiveId) : [];
      setProducts(list);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = products.filter(
    (p) => filter === 'All' || p.category === filter
  );

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 pt-24 sm:px-6">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] min-h-screen max-w-7xl px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-24 sm:pt-32">
      <Link
        to="/collection"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-prime transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft size={18} />
        Back to main collection
      </Link>

      <div className="mb-12 border-b border-slate-200 pb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
          Extended catalogue
        </p>
        <h1 className="mb-4 text-3xl font-display font-extrabold text-prime sm:text-4xl md:text-5xl">
          Archive &amp; studio line
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
          Additional silhouettes and seasonal experiments—same construction
          standards as our hero collection, offered here as a broader wardrobe
          library so the site feels as full as a real flagship.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-2 sm:justify-start">
        {['All', 'Essential', 'Limited'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-prime text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500 mb-8">
        Showing <strong className="text-prime">{visible.length}</strong> archive
        pieces
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {visible.map((product, idx) => (
          <div
            key={product.id}
            className="group animate-fade-up"
            style={{ animationDelay: `${(idx % 4) * 60}ms` }}
          >
            <Link
              to={`/product/${product.id}`}
              className="block relative aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden mb-5"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : null}
            </Link>
            <Link to={`/product/${product.id}`} className="block px-1">
              <h3 className="text-lg font-bold text-prime mb-1">
                {product.name}
              </h3>
              <p className="text-slate-500 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-prime font-bold">
                ${(Number(product.price) || 0).toFixed(2)}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionArchive;
