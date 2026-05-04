import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { getCart } from '../api/api';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const applyCartCount = useCallback((data) => {
    const items = data?.items;
    if (!Array.isArray(items) || items.length === 0) {
      setCartCount(0);
      return;
    }
    const sum = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
    setCartCount(sum);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCart().then((data) => {
      if (cancelled) return;
      applyCartCount(data);
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname, applyCartCount]);

  useEffect(() => {
    const onCart = () => {
      getCart().then(applyCartCount);
    };
    window.addEventListener('shopsmart-cart-updated', onCart);
    return () => window.removeEventListener('shopsmart-cart-updated', onCart);
  }, [applyCartCount]);

  const navLinks = [
    { name: 'Collection', path: '/collection' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-200 ease-out ${scrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-6'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`flex flex-col gap-3 rounded-3xl px-4 py-3 sm:rounded-[2rem] sm:px-6 sm:py-4 md:px-8 md:py-4 ${
            scrolled ? 'glass-dark text-white' : 'glass text-prime'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 sm:flex-nowrap sm:gap-3 min-h-[2.75rem] sm:min-h-[3rem]">
            <Link
              to="/"
              className="order-1 text-lg font-display font-extrabold tracking-tight hover-scale shrink-0 sm:text-2xl"
            >
              SHOPSMART
            </Link>

            <div className="order-2 flex shrink-0 items-center gap-1 sm:order-3 sm:gap-2">
              <Link
                to="/profile"
                className="hover:text-accent transition-colors hover-scale flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 sm:min-h-0 sm:min-w-0 sm:p-1"
                aria-label="Profile"
              >
                <User size={20} strokeWidth={2.5} />
              </Link>
              <Link
                to="/cart"
                className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 transition-colors hover:text-accent hover-scale sm:min-h-0 sm:min-w-0 sm:p-1"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} strokeWidth={2.5} />
                {cartCount > 0 ? (
                  <span
                    className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white sm:-right-1 sm:-top-1"
                    aria-live="polite"
                    data-testid="cart-count-badge"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                ) : null}
              </Link>
            </div>

            <nav
              aria-label="Primary"
              className="order-3 flex w-full basis-full justify-start gap-3 overflow-x-auto overflow-y-visible overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:order-2 sm:w-auto sm:basis-auto sm:flex-1 sm:min-w-0 sm:justify-center sm:gap-4 sm:px-1 md:gap-8 md:px-2 [&::-webkit-scrollbar]:hidden"
            >
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`group relative inline-flex shrink-0 flex-col items-center whitespace-nowrap py-2 text-xs font-medium transition-colors hover:text-accent sm:py-1.5 sm:text-sm ${
                      active ? 'text-accent' : ''
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left rounded-full bg-accent shadow-[0_0_10px_rgba(6,182,212,0.45)] transition-transform duration-200 ease-out will-change-transform ${
                        active
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
