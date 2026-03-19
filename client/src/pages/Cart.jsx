import { useState, useEffect } from 'react';
import { getCart, removeFromCart, addToCart } from '../api/api';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const item = cart.items.find(i => i.product.id === productId);
    if (!item) return;
    if (item.quantity <= 1 && delta === -1) {
      return handleRemove(productId);
    }
    const updatedCart = await addToCart(productId, delta);
    setCart({ ...updatedCart });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-display font-extrabold text-prime mb-12 animate-fade-up">
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
            Looks like you haven&apos;t added any premium selections to your cart
            yet.
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
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6 animate-fade-up animate-delay-100">
            {cart.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-6 p-6 bg-white border border-slate-100 shadow-sm rounded-3xl relative"
              >
                <div className="w-32 h-40 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
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
                <div className="flex-grow flex flex-col justify-between py-1">
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
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4 bg-slate-50 rounded-full px-4 py-2 border border-slate-100">
                      <button 
                        onClick={() => handleUpdateQty(item.product.id, -1)}
                        className="text-slate-400 hover:text-prime font-bold text-lg"
                      >
                        -
                      </button>
                      <span className="text-prime font-semibold font-sans">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQty(item.product.id, 1)}
                        className="text-slate-400 hover:text-prime font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.product.id)}
                      className="text-rose-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Checkout Block */}
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 lg:sticky lg:top-32 animate-fade-up animate-delay-200">
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

            <button className="w-full py-5 bg-prime text-white rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(15,23,42,0.15)] hover:shadow-[0_8px_30px_rgb(15,23,42,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
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
    </div>
  );
};

export default Cart;
