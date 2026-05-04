import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <p className="text-xl font-display font-extrabold text-prime tracking-tight mb-4">
              SHOPSMART
            </p>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Premium essentials with honest pricing. Designed in-studio,
              crafted with partners we know by name.
            </p>
            <div className="flex items-center gap-2 text-slate-400 sm:gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-slate-200/60 hover:text-prime transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={2} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-slate-200/60 hover:text-prime transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} strokeWidth={2} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-slate-200/60 hover:text-prime transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} strokeWidth={2} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-prime mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link
                  to="/collection"
                  className="hover:text-accent transition-colors"
                >
                  The Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/collection/archive"
                  className="hover:text-accent transition-colors"
                >
                  Extended archive
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-accent transition-colors"
                >
                  Shopping bag
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-accent transition-colors"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-prime mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/faq" className="hover:text-accent transition-colors">
                  FAQ &amp; returns
                </Link>
              </li>
              <li>
                <a
                  href="mailto:concierge@shopsmart.example"
                  className="hover:text-accent transition-colors"
                >
                  Contact concierge
                </a>
              </li>
              <li>
                <span className="text-slate-400">Track order (demo)</span>
              </li>
              <li>
                <span className="text-slate-400">Size &amp; care guides</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-prime mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition-colors"
                >
                  Our story
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-accent transition-colors"
                >
                  Editorial
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Careers</span>
              </li>
              <li>
                <span className="text-slate-400">Sustainability report</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSmart. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <span className="hover:text-prime cursor-default">Privacy</span>
            <span className="hover:text-prime cursor-default">Terms</span>
            <span className="hover:text-prime cursor-default">
              Accessibility
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
