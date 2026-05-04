import { useState, useEffect } from 'react';
import { getCart, removeFromCart, addToCart } from '../api/api';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck, X } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    getCart()
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    const updatedCart = await removeFromCart(productId);
    setCart({ ...updatedCart });
  };

  const handleUpdateQty = async (productId, delta) => {
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) return;
    if (item.quantity <= 1 && delta === -1) {
      return handleRemove(productId);
    }
    const updatedCart = await addToCart(productId, delta);
    setCart({ ...updatedCart });
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 pt-24 sm:px-6">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="mx-auto min-h-[100dvh] min-h-screen max-w-6xl px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-24 sm:pt-32">
      <h1 className="mb-8 animate-fade-up text-3xl font-display font-extrabold text-prime sm:mb-12 sm:text-4xl md:text-5xl">
        Shopping Bag
      </h1>

      {isEmpty ? (
        <div className="text-center py-24 bg-slate-50 rounded-[2rem] border border-slate-100 animate-fade-up animate-delay-100">
          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-6">
            <span className="text-slate-300 text-4xl">👜</span>
          </div>
          <h2 className="text-2xl font-bold text-prime mb-4">
            Your bag is empty
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added any premium selections to your
            cart yet.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-prime text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-md hover-scale"
          >
            <span>Discover Items</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6 animate-fade-up animate-delay-100">
            {cart.items.map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:gap-6 sm:p-6"
              >
                <div className="mx-auto h-40 w-full max-w-[10rem] shrink-0 overflow-hidden rounded-2xl bg-slate-50 sm:mx-0 sm:h-40 sm:w-32 sm:max-w-none">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                  <div>
                    <h3 className="text-xl font-bold text-prime mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                      Color: Obsidian Slate • Size: M
                    </p>
                    <p className="text-xl font-medium text-prime">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center justify-center space-x-4 self-start rounded-full border border-slate-100 bg-slate-50 px-4 py-2 sm:justify-start">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.product.id, -1)}
                        className="flex min-h-10 min-w-10 items-center justify-center text-lg font-bold text-slate-400 hover:text-prime"
                      >
                        -
                      </button>
                      <span className="min-w-[1.5rem] text-center font-sans font-semibold text-prime">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.product.id, 1)}
                        className="flex min-h-10 min-w-10 items-center justify-center text-lg font-bold text-slate-400 hover:text-prime"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.product.id)}
                      className="self-end rounded-full p-2 text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-500 sm:self-auto"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-fade-up animate-delay-200 rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:rounded-[2rem] sm:p-8 lg:sticky lg:top-32">
            <h2 className="text-2xl font-display font-bold text-prime mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-prime">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Standard Shipping</span>
                <span className="text-emerald-500 uppercase font-bold text-xs tracking-wider pt-1">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Tax</span>
                <span className="text-prime">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mb-8 flex justify-between items-center">
              <span className="font-bold text-prime text-lg">Total</span>
              <span className="font-display font-extrabold text-3xl text-prime">
                ${cart.total.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-5 bg-prime text-white rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(15,23,42,0.15)] hover:shadow-[0_8px_30px_rgb(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Secure Checkout</span>
              <ArrowRight size={20} />
            </button>

            <div className="mt-6 flex items-center justify-center space-x-2 text-slate-400 text-xs font-medium">
              <ShieldCheck size={16} />
              <span>Secure encrypted SSL transaction</span>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-prime/50 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          onClick={() => setCheckoutOpen(false)}
        >
          <div
            className="relative max-h-[min(90dvh,100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Close"
              onClick={() => setCheckoutOpen(false)}
            >
              <X size={22} />
            </button>
            <h2
              id="checkout-title"
              className="text-2xl font-display font-bold text-prime mb-3 pr-8"
            >
              Checkout (demo)
            </h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Payments are not processed in this demo build. Your bag is ready
              for checkout—connect a payment provider (Stripe, PayPal, etc.) to
              go live.
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Order total:{' '}
              <strong className="text-prime">
                ${cart?.total?.toFixed(2) ?? '0.00'}
              </strong>
            </p>
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="w-full py-3.5 rounded-full bg-prime text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Back to bag
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Cart;
