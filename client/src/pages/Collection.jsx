import { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import { Link } from 'react-router-dom';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12 animate-fade-up flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-prime mb-4">
            The Collection
          </h1>
          <p className="text-slate-500 max-w-xl text-lg">
            Curated essentials designed for the modern aesthetic. Uncompromising
            quality meets timeless design.
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-2">
          {['All', 'Essential', 'Limited'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-prime text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products
          .filter((p) => filter === 'All' || p.category === filter)
          .map((product, idx) => (
          <Link
            to={`/product/${product.id || product._id || idx}`}
            key={product.id || product._id || idx}
            className={`group cursor-pointer animate-fade-up`}
            style={{ animationDelay: `${(idx % 4) * 100}ms` }}
          >
            <div className="relative aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden mb-5">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-50 flex flex-col justify-end p-6">
                  <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center">
                    <span className="text-slate-400 font-medium">
                      Abstract View
                    </span>
                  </div>
                </div>
              )}
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-prime/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="w-full bg-white/95 backdrop-blur-md text-prime font-bold py-3.5 flex justify-center rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  Quick View
                </div>
              </div>

              {/* Badges */}
              {idx === 0 && (
                <div className="absolute top-4 left-4 bg-prime text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
                  NEW ARRIVAL
                </div>
              )}
              {idx === 2 && (
                <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
                  FEW LEFT
                </div>
              )}
            </div>
            <div className="px-1">
              <h3 className="text-lg font-bold text-prime mb-1">
                {product.name}
              </h3>
              <p className="text-slate-500 text-sm mb-3 line-clamp-1">
                {product.description || 'Premium quality crafted product.'}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-prime font-bold">
                  ${(Number(product.price) || 0).toFixed(2)}
                </p>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 rounded-full bg-slate-200 border border-slate-300"></div>
                  <div className="w-4 h-4 rounded-full bg-prime border border-slate-300"></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collection;
