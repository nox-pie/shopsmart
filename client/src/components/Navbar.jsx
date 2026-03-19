import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collection', path: '/collection' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`flex items-center justify-between rounded-full px-8 py-4 ${scrolled ? 'glass-dark text-white' : 'glass text-prime'}`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-display font-extrabold tracking-tight hover-scale"
          >
            SHOPSMART
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent relative group ${location.pathname === link.path ? 'text-accent' : ''}`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="hover:text-accent transition-colors hover-scale">
              <Search size={20} strokeWidth={2.5} />
            </button>
            <Link
              to="/profile"
              className="hover:text-accent transition-colors hover-scale"
            >
              <User size={20} strokeWidth={2.5} />
            </Link>
            <Link
              to="/cart"
              className="relative hover:text-accent transition-colors hover-scale flex items-center"
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] items-center justify-center flex h-4 w-4 rounded-full font-bold">
                3
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
