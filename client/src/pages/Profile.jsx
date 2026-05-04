import { useState, useEffect } from 'react';
import { User, Package, Settings, LogOut } from 'lucide-react';

const STORAGE_KEY = 'shopsmart-profile';

const defaultForm = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  street: '123 Signature Avenue',
  city: 'New York',
  state: 'NY',
  zip: '10001',
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultForm;
    const parsed = JSON.parse(raw);
    return { ...defaultForm, ...parsed };
  } catch {
    return defaultForm;
  }
}

const Profile = () => {
  const [section, setSection] = useState('personal');
  const [form, setForm] = useState(defaultForm);
  const [saveMessage, setSaveMessage] = useState('');
  const [signOutMessage, setSignOutMessage] = useState('');
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefSms, setPrefSms] = useState(false);

  useEffect(() => {
    setForm(loadProfile());
  }, []);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setSaveMessage('');
    setSignOutMessage('');
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaveMessage('Your changes have been saved.');
    setTimeout(() => setSaveMessage(''), 4000);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setForm({ ...defaultForm });
    setSection('personal');
    setSignOutMessage(
      'You have been signed out (demo: session cleared locally).'
    );
    setTimeout(() => setSignOutMessage(''), 5000);
  };

  const navItems = [
    { id: 'personal', icon: User, label: 'Personal Info' },
    { id: 'orders', icon: Package, label: 'Order History' },
    { id: 'preferences', icon: Settings, label: 'Preferences' },
  ];

  return (
    <div className="mx-auto flex min-h-[100dvh] min-h-screen max-w-6xl flex-col gap-8 px-4 pb-20 pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:gap-10 sm:px-6 sm:pb-24 sm:pt-32 md:flex-row md:gap-12">
      <div className="w-full md:w-64 flex-shrink-0 animate-fade-up">
        <div className="sticky top-[calc(5.5rem+env(safe-area-inset-top,0px))] rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:rounded-[2rem] sm:p-6 md:top-32">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-prime text-white rounded-full flex items-center justify-center text-xl font-bold">
              {form.firstName?.[0] || 'U'}
              {form.lastName?.[0] || ''}
            </div>
            <div>
              <h2 className="font-bold text-prime text-lg">
                {form.firstName} {form.lastName}
              </h2>
              <p className="text-sm text-slate-500">{form.email}</p>
            </div>
          </div>

          {signOutMessage ? (
            <p className="text-sm text-accent font-medium mb-4">
              {signOutMessage}
            </p>
          ) : null}

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium ${section === item.id ? 'bg-white text-prime shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-prime'}`}
              >
                <item.icon
                  size={18}
                  className={section === item.id ? 'text-accent' : ''}
                />
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-rose-500 hover:bg-rose-50"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex-grow animate-fade-up animate-delay-100">
        {section === 'personal' ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8 md:p-10">
            <h1 className="text-3xl font-display font-bold text-prime mb-2">
              Personal Information
            </h1>
            {saveMessage ? (
              <p className="text-sm text-emerald-600 font-medium mb-6">
                {saveMessage}
              </p>
            ) : (
              <p className="text-sm text-slate-400 mb-8">
                Update your account details. Data is stored in this browser only
                (demo).
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-sm font-bold text-prime uppercase tracking-wider">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-prime uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-prime uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            <h2 className="text-xl font-display font-bold text-prime mb-6 mt-12 border-t border-slate-100 pt-10">
              Shipping Details
            </h2>
            <div className="grid gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-prime uppercase tracking-wider">
                  Street Address
                </label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => update('street', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-bold text-prime uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-bold text-prime uppercase tracking-wider">
                    State
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-bold text-prime uppercase tracking-wider">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => update('zip', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-4 bg-prime text-white rounded-full font-bold shadow-md hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : null}

        {section === 'orders' ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8 md:p-10">
            <h1 className="text-3xl font-display font-bold text-prime mb-4">
              Order History
            </h1>
            <p className="text-slate-500 mb-8 max-w-xl">
              When you place orders, they will appear here. This demo does not
              persist orders to a server.
            </p>
            <ul className="space-y-4">
              <li className="border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/50">
                <div>
                  <p className="font-bold text-prime">#SM-20489</p>
                  <p className="text-sm text-slate-500">
                    Placed May 1, 2026 · Delivered
                  </p>
                </div>
                <span className="text-prime font-semibold">$245.00</span>
              </li>
              <li className="border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/50">
                <div>
                  <p className="font-bold text-prime">#SM-20102</p>
                  <p className="text-sm text-slate-500">
                    Placed Mar 18, 2026 · Delivered
                  </p>
                </div>
                <span className="text-prime font-semibold">$110.00</span>
              </li>
            </ul>
          </div>
        ) : null}

        {section === 'preferences' ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8 md:p-10">
            <h1 className="text-3xl font-display font-bold text-prime mb-4">
              Preferences
            </h1>
            <p className="text-slate-500 mb-8 max-w-xl">
              Marketing and notification preferences for your ShopSmart account
              (demo toggles).
            </p>
            <div className="space-y-4 max-w-md">
              <label className="flex items-center justify-between gap-4 border border-slate-100 rounded-2xl px-5 py-4 cursor-pointer hover:bg-slate-50">
                <span className="font-medium text-prime">Editorial emails</span>
                <input
                  type="checkbox"
                  checked={prefEmail}
                  onChange={() => setPrefEmail((v) => !v)}
                  className="h-4 w-4 accent-prime"
                />
              </label>
              <label className="flex items-center justify-between gap-4 border border-slate-100 rounded-2xl px-5 py-4 cursor-pointer hover:bg-slate-50">
                <span className="font-medium text-prime">
                  SMS order updates
                </span>
                <input
                  type="checkbox"
                  checked={prefSms}
                  onChange={() => setPrefSms((v) => !v)}
                  className="h-4 w-4 accent-prime"
                />
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
