import { useState, useEffect } from 'react';
import { getProduct, addToCart } from '../api/api';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, X } from 'lucide-react';

const SIZE_GUIDE_ROWS = [
  { size: 'S', chest: '34–36"', waist: '28–30"' },
  { size: 'M', chest: '38–40"', waist: '32–34"' },
  { size: 'L', chest: '42–44"', waist: '36–38"' },
  { size: 'XL', chest: '46–48"', waist: '40–42"' },
];

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const colorClasses = ['bg-prime', 'bg-slate-300', 'bg-accent'];

  useEffect(() => {
    setThumbIndex(0);
    setSelectedSize('M');
    setSelectedColor(0);
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

  const objectPositions = [
    'object-[center_25%]',
    'object-center',
    'object-[center_75%]',
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 pt-[calc(6rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-28">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-32">
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
    <div className="mx-auto min-h-[100dvh] min-h-screen max-w-6xl px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-24 sm:pt-32">
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

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-up">
          <div className="relative aspect-[4/5] bg-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 ${objectPositions[thumbIndex] || 'object-center'}`}
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
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setThumbIndex(i)}
                aria-label={`View product photo ${i + 1}`}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-colors ${thumbIndex === i ? 'border-prime ring-2 ring-prime/20' : 'border-transparent hover:border-slate-200'}`}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    className={`w-full h-full object-cover ${objectPositions[i]}`}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-up animate-delay-100 lg:sticky lg:top-32">
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-6">
            NEW ARRIVAL
          </div>
          <h1 className="mb-4 text-2xl font-display font-extrabold text-prime sm:text-3xl md:text-4xl lg:text-5xl">
            {product.name}
          </h1>
          <p className="mb-6 text-xl font-medium text-slate-600 sm:mb-8 sm:text-2xl">
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
                {colorClasses.map((color, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColor(i)}
                    aria-label={`Color option ${i + 1}`}
                    aria-pressed={selectedColor === i}
                    className={`w-10 h-10 rounded-full border-2 border-white ring-2 ${selectedColor === i ? 'ring-prime scale-110' : 'ring-transparent hover:ring-slate-200'} ${color} transition-all`}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-prime uppercase tracking-wider mb-3 flex justify-between items-center gap-4">
                <span>Size</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-slate-400 hover:text-prime underline decoration-dotted text-xs font-semibold uppercase tracking-wide"
                >
                  Size Guide
                </button>
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={`min-h-11 rounded-xl border py-2.5 text-sm font-semibold transition-colors sm:py-3 sm:text-base ${selectedSize === size ? 'border-prime bg-prime text-white' : 'border-slate-200 text-slate-600 hover:border-prime'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-4">
            Selected:{' '}
            <span className="font-semibold text-prime">
              {['Obsidian', 'Mist', 'Amber'][selectedColor] ?? 'Obsidian'}
            </span>{' '}
            · Size {selectedSize}
          </p>

          <button
            type="button"
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

          <div className="mt-8 space-y-3 border-t border-slate-100 pt-8 text-sm text-slate-500">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="font-semibold text-prime">
                Complimentary Delivery
              </span>
              <span>2-3 Business Days</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="font-semibold text-prime">Extended Returns</span>
              <span>Within 30 Days</span>
            </div>
          </div>
        </div>
      </div>

      {sizeGuideOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-prime/45 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          onClick={() => setSizeGuideOpen(false)}
        >
          <div
            className="relative max-h-[min(90dvh,100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Close size guide"
              onClick={() => setSizeGuideOpen(false)}
            >
              <X size={22} />
            </button>
            <h2
              id="size-guide-title"
              className="text-2xl font-display font-bold text-prime mb-2"
            >
              Size guide
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Measurements are body dimensions in inches. Between sizes? Size up
              for a relaxed fit.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-prime">
                    <th className="px-4 py-3 font-bold">Size</th>
                    <th className="px-4 py-3 font-bold">Chest</th>
                    <th className="px-4 py-3 font-bold">Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE_ROWS.map((row) => (
                    <tr key={row.size} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-prime">
                        {row.size}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.chest}</td>
                      <td className="px-4 py-3 text-slate-600">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="mt-6 w-full py-3 rounded-full bg-prime text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Product;
