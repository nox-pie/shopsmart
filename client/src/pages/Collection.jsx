import { useState, useEffect, useCallback, useRef } from 'react';
import { getProducts, searchProducts, addToCart } from '../api/api';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const isCoreCatalogId = (p) => /^m\d+$/.test(String(p.id));

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('q') || ''
  );
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const searchDebounceRef = useRef(null);
  const collectionSearchRef = useRef(null);

  const qParam = searchParams.get('q') || '';

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  useEffect(() => {
    if (qParam && collectionSearchRef.current) {
      collectionSearchRef.current.focus();
    }
  }, [qParam]);

  const loadBase = useCallback(() => {
    getProducts().then((data) => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadBase();
  }, [loadBase]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      const trimmed = searchInput.trim();
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (trimmed) next.set('q', trimmed);
          else next.delete('q');
          if (next.toString() === prev.toString()) return prev;
          return next;
        },
        { replace: true }
      );
    }, 350);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchInput, setSearchParams]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!qParam.trim()) {
        if (!cancelled) setFilteredProducts(products);
        return;
      }
      const results = await searchProducts(qParam);
      if (!cancelled)
        setFilteredProducts(Array.isArray(results) ? results : []);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [qParam, products]);

  const pool = qParam.trim()
    ? filteredProducts
    : products.filter(isCoreCatalogId);

  const visible = pool.filter((p) => filter === 'All' || p.category === filter);

  const handleQuickViewAdd = async (product) => {
    setAddingId(product.id);
    await addToCart(product.id, 1);
    setAddingId(null);
    setQuickViewProduct(null);
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 pt-24 sm:px-6">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] min-h-screen max-w-7xl px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-24 sm:pt-32">
      <div className="mb-12 flex animate-fade-up flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:gap-8 md:flex-row md:items-end">
        <div>
          <h1 className="mb-4 text-3xl font-display font-extrabold text-prime sm:text-4xl md:text-5xl">
            The Collection
          </h1>
          <p className="max-w-xl text-base text-slate-500 sm:text-lg">
            Curated essentials designed for the modern aesthetic. Uncompromising
            quality meets timeless design.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap justify-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1 sm:justify-start">
            {['All', 'Essential', 'Limited'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-prime text-white' : 'text-slate-600 hover:bg-white/80'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-10 max-w-xl animate-fade-up">
        <label
          htmlFor="collection-search"
          className="flex items-center gap-2 text-sm font-bold text-prime uppercase tracking-wider mb-2"
        >
          <Search
            size={18}
            className="text-accent shrink-0"
            strokeWidth={2.5}
            aria-hidden
          />
          Search
        </label>
        <input
          id="collection-search"
          ref={collectionSearchRef}
          type="search"
          aria-label="Search collection"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Filter by name or description…"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-prime shadow-sm outline-none ring-2 ring-transparent focus:ring-accent/30 transition-shadow"
        />
        {qParam.trim() ? (
          <p className="mt-2 text-sm text-slate-500">
            Showing results for &ldquo;{qParam.trim()}&rdquo; ({visible.length}{' '}
            {visible.length === 1 ? 'item' : 'items'})
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {visible.map((product, idx) => (
          <div
            key={product.id || product._id || idx}
            className={`group animate-fade-up`}
            style={{ animationDelay: `${(idx % 4) * 100}ms` }}
          >
            <div className="relative mb-5">
              <Link
                to={`/product/${product.id || product._id || idx}`}
                className="block relative aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden"
              >
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
                {idx === 0 && (
                  <div className="absolute top-4 left-4 bg-prime text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md pointer-events-none">
                    NEW ARRIVAL
                  </div>
                )}
                {idx === 2 && (
                  <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md pointer-events-none">
                    FEW LEFT
                  </div>
                )}
              </Link>
              <button
                type="button"
                className="absolute bottom-4 left-4 right-4 z-10 flex translate-y-0 justify-center rounded-xl bg-white/95 py-3.5 font-bold text-prime opacity-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:bg-white sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                onClick={() => setQuickViewProduct(product)}
              >
                Quick View
              </button>
            </div>
            <Link
              to={`/product/${product.id || product._id || idx}`}
              className="block px-1"
            >
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
                <div className="flex space-x-1 pointer-events-none">
                  <div className="w-4 h-4 rounded-full bg-slate-200 border border-slate-300"></div>
                  <div className="w-4 h-4 rounded-full bg-prime border border-slate-300"></div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-slate-500 mt-16">
          No products match your filters. Try another search or category.
        </p>
      ) : null}

      {!qParam.trim() ? (
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-slate-50/80 px-5 py-6 sm:flex-row sm:rounded-[2rem] sm:px-8 sm:py-8">
          <div>
            <h2 className="text-lg font-display font-bold text-prime mb-1">
              Want more to explore?
            </h2>
            <p className="text-sm text-slate-500 max-w-md">
              Browse our extended archive—dozens of additional studio-line
              pieces in the same aesthetic.
            </p>
          </div>
          <Link
            to="/collection/archive"
            className="w-full shrink-0 rounded-full bg-prime px-8 py-3.5 text-center text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800 sm:w-auto"
          >
            Open extended archive
          </Link>
        </div>
      ) : null}

      {quickViewProduct ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-prime/40 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="relative max-h-[min(92dvh,100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-2xl sm:rounded-[2rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Close quick view"
              onClick={() => setQuickViewProduct(null)}
            >
              <X size={22} />
            </button>
            <div className="p-8 pt-12">
              {quickViewProduct.image ? (
                <img
                  src={quickViewProduct.image}
                  alt=""
                  className="w-full aspect-[4/5] object-cover rounded-2xl mb-6"
                />
              ) : null}
              <h2
                id="quick-view-title"
                className="text-2xl font-display font-bold text-prime mb-2"
              >
                {quickViewProduct.name}
              </h2>
              <p className="text-xl font-medium text-slate-600 mb-4">
                ${(Number(quickViewProduct.price) || 0).toFixed(2)}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-4">
                {quickViewProduct.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={addingId === quickViewProduct.id}
                  onClick={() => handleQuickViewAdd(quickViewProduct)}
                  className="flex-1 py-3.5 rounded-full bg-prime text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-60"
                >
                  {addingId === quickViewProduct.id ? 'Adding…' : 'Add to bag'}
                </button>
                <Link
                  to={`/product/${quickViewProduct.id}`}
                  className="flex-1 py-3.5 rounded-full border border-slate-200 text-prime font-bold text-center hover:bg-slate-50 transition-colors"
                  onClick={() => setQuickViewProduct(null)}
                >
                  Full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Collection;
