import { useState, useEffect } from 'react';
import { getProduct, addToCart } from '../api/api';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, 1).then(() => {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col justify-center items-center">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h1 className="text-3xl font-display font-bold text-prime mb-4">
          Product Not Found
        </h1>
        <Link
          to="/collection"
          className="text-accent font-medium hover:underline"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <Link
        to="/collection"
        className="inline-flex items-center space-x-2 text-slate-500 hover:text-prime transition-colors mb-12 group"
      >
        <ArrowLeft
          size={20}
          className="transform group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Back to Collection</span>
      </Link>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Visuals */}
        <div className="animate-fade-up">
          <div className="relative aspect-[4/5] bg-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white flex items-center justify-center p-12">
                <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center">
                  <span className="text-slate-300 font-display text-2xl font-bold tracking-widest uppercase">
                    Abstract
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-slate-50 border-2 cursor-pointer transition-colors ${i === 1 ? 'border-prime' : 'border-transparent hover:border-slate-200'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="animate-fade-up animate-delay-100 lg:sticky lg:top-32">
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-6">
            NEW ARRIVAL
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-prime mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-medium text-slate-600 mb-8">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-slate-500 text-lg leading-relaxed mb-10">
            {product.description ||
              'Expertly crafted with uncompromising attention to detail, this piece represents the pinnacle of modern design. Perfect for elevating your everyday aesthetic.'}
          </p>

          <div className="space-y-6 mb-12">
            <div>
              <h3 className="text-sm font-bold text-prime uppercase tracking-wider mb-3">
                Color
              </h3>
              <div className="flex space-x-3">
                {['bg-prime', 'bg-slate-300', 'bg-accent'].map((color, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 border-white ring-2 ${i === 0 ? 'ring-prime' : 'ring-transparent hover:ring-slate-200'} ${color} transition-all`}
                  ></button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-prime uppercase tracking-wider mb-3 flex justify-between">
                Size{' '}
                <span className="text-slate-400 font-normal hover:text-prime cursor-pointer underline decoration-dotted">
                  Size Guide
                </span>
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {['S', 'M', 'L', 'XL'].map((size, i) => (
                  <button
                    key={size}
                    className={`py-3 rounded-xl border font-semibold transition-colors ${i === 1 ? 'border-prime bg-prime text-white' : 'border-slate-200 text-slate-600 hover:border-prime'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-md ${added ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-prime text-white hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1'}`}
          >
            {added ? (
              <>
                <Check size={24} />
                <span>Added to Cart</span>
              </>
            ) : (
              <span>Add to Bag</span>
            )}
          </button>

          <div className="mt-8 pt-8 border-t border-slate-100 text-sm text-slate-500 space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold text-prime">
                Complimentary Delivery
              </span>
              <span>2-3 Business Days</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-prime">Extended Returns</span>
              <span>Within 30 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
